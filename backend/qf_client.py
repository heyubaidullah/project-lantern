import re
import time
import httpx

from config import settings


DEFAULT_SEARCH_TRANSLATION_ID = 85
MAX_SEARCH_RESULTS = 3

CURATED_FALLBACK_VERSES = {
    "patience": ["2:153", "2:155", "3:200"],
    "anxiety": ["13:28", "20:46", "94:5"],
    "anxious": ["13:28", "20:46", "94:5"],
    "sadness": ["3:139", "9:40", "28:7"],
    "sad": ["3:139", "9:40", "28:7"],
    "hope": ["39:53", "94:5", "2:286"],
    "mercy": ["39:53", "7:156", "6:54"],
    "forgiveness": ["39:53", "3:135", "42:25"],
    "parents": ["17:23", "31:14", "46:15"],
    "salah": ["2:45", "2:153", "29:45"],
    "prayer": ["2:45", "2:153", "29:45"],
    "hijab": ["24:30", "24:31", "33:59"],
    "gratitude": ["14:7", "2:152", "31:12"],
    "grateful": ["14:7", "2:152", "31:12"],
    "anger": ["3:134", "42:37", "7:199"],
    "lonely": ["50:16", "57:4", "2:186"],
    "discipline": ["29:69", "3:200", "103:1"],
    "hardship": ["94:5", "2:286", "2:155"],
    "return": ["39:53", "66:8", "2:222"],
    "repentance": ["39:53", "66:8", "2:222"],
}

DEFAULT_FALLBACK_VERSES = ["17:9", "10:57", "2:2"]


class SearchScopeUnavailableError(Exception):
    pass


class QuranFoundationClient:
    def __init__(self) -> None:
        self._tokens: dict[str, str] = {}
        self._token_expires_at: dict[str, float] = {}
        self._chapters_cache: dict[int, str] | None = None

    async def get_access_token(self, scope: str = "content") -> str:
        now = time.time()

        if self._tokens.get(scope) and now < self._token_expires_at.get(scope, 0):
            return self._tokens[scope]

        token_url = f"{settings.qf_auth_base_url}/oauth2/token"

        client_id = settings.qf_client_id.strip()
        client_secret = settings.qf_client_secret.strip()

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                token_url,
                auth=(client_id, client_secret),
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={"grant_type": "client_credentials", "scope": scope},
            )
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                if scope == "search" and self._is_invalid_scope_response(exc.response):
                    raise SearchScopeUnavailableError() from exc
                raise

            data = response.json()

        access_token = data["access_token"]
        expires_in = data.get("expires_in", 3600)

        self._tokens[scope] = access_token
        self._token_expires_at[scope] = now + expires_in - 60
        return access_token

    def _auth_headers(self, access_token: str) -> dict[str, str]:
        return {
            "x-auth-token": access_token,
            "x-client-id": settings.qf_client_id.strip(),
            "Accept": "application/json",
        }

    async def get_chapters(self) -> dict:
        access_token = await self.get_access_token()
        url = f"{settings.qf_api_base_url}/content/api/v4/chapters"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers=self._auth_headers(access_token),
            )
            response.raise_for_status()
            return response.json()

    async def get_verse_by_key(self, verse_key: str) -> dict:
        access_token = await self.get_access_token()
        url = f"{settings.qf_api_base_url}/content/api/v4/verses/by_key/{verse_key}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers=self._auth_headers(access_token),
                params={
                    "fields": "text_uthmani",
                },
            )
            response.raise_for_status()
            return response.json()

    async def get_translation_resources(self) -> dict:
        access_token = await self.get_access_token()
        url = f"{settings.qf_api_base_url}/content/api/v4/resources/translations"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers=self._auth_headers(access_token),
                params={
                    "language_name": "english",
                },
            )
            response.raise_for_status()
            return response.json()

    async def get_translation_by_verse_key(
        self, translation_id: int, verse_key: str
    ) -> dict:
        access_token = await self.get_access_token()
        url = f"{settings.qf_api_base_url}/content/api/v4/quran/translations/{translation_id}"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers=self._auth_headers(access_token),
                params={
                    "verse_key": verse_key,
                    "fields": "resource_name,language_name,verse_key",
                },
            )
            response.raise_for_status()
            return response.json()

    async def search(self, query: str) -> dict:
        access_token = await self.get_access_token(scope="search")
        url = f"{settings.qf_api_base_url}/api/v1/search"

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers=self._auth_headers(access_token),
                params={
                    "mode": "advanced",
                    "query": query,
                    "page": 1,
                    "size": MAX_SEARCH_RESULTS,
                    "translation_ids": str(DEFAULT_SEARCH_TRANSLATION_ID),
                    "get_text": 1,
                    "highlight": 0,
                },
            )
            response.raise_for_status()
            return response.json()

    async def search_ayahs(self, query: str) -> dict:
        source = "qf-search"
        raw_search = {}

        try:
            raw_search = await self.search(query)
            verse_keys = self._extract_search_verse_keys(raw_search)[:MAX_SEARCH_RESULTS]
        except SearchScopeUnavailableError:
            source = "curated-fallback"
            verse_keys = self._get_curated_fallback_verse_keys(query)

        try:
            chapters = await self._get_chapter_name_map()
        except Exception:
            chapters = {}

        results = []
        for verse_key in verse_keys[:MAX_SEARCH_RESULTS]:
            result = await self._build_search_result(verse_key, chapters, raw_search)
            results.append(result)

        return {"query": query, "source": source, "results": results}

    def _is_invalid_scope_response(self, response: httpx.Response) -> bool:
        try:
            error_data = response.json()
        except ValueError:
            error_data = {}

        if not isinstance(error_data, dict):
            return False

        error = str(error_data.get("error", "")).lower()
        description = str(error_data.get("error_description", "")).lower()

        return error == "invalid_scope" or "invalid_scope" in description

    def _get_curated_fallback_verse_keys(self, query: str) -> list[str]:
        normalized_query = query.lower()
        verse_keys: list[str] = []

        for topic, topic_verse_keys in CURATED_FALLBACK_VERSES.items():
            if not re.search(rf"\b{re.escape(topic)}\b", normalized_query):
                continue

            for verse_key in topic_verse_keys:
                if verse_key not in verse_keys:
                    verse_keys.append(verse_key)

                if len(verse_keys) == MAX_SEARCH_RESULTS:
                    return verse_keys

        return verse_keys or DEFAULT_FALLBACK_VERSES

    def _extract_search_verse_keys(self, data: dict) -> list[str]:
        candidates = []
        result = data.get("result") if isinstance(data, dict) else None

        if isinstance(result, dict):
            verses = result.get("verses")
            if isinstance(verses, list):
                candidates.extend(verses)

        if isinstance(data.get("verses"), list):
            candidates.extend(data["verses"])

        if isinstance(data.get("results"), list):
            candidates.extend(data["results"])

        verse_keys: list[str] = []
        for candidate in candidates:
            verse_key = self._read_verse_key(candidate)
            if verse_key and verse_key not in verse_keys:
                verse_keys.append(verse_key)

        return verse_keys

    def _read_verse_key(self, value) -> str | None:
        if isinstance(value, str) and re.match(r"^\d{1,3}:\d{1,3}$", value):
            return value

        if not isinstance(value, dict):
            return None

        for key in ("verse_key", "verseKey", "key"):
            candidate = value.get(key)
            if isinstance(candidate, str) and re.match(
                r"^\d{1,3}:\d{1,3}$", candidate
            ):
                return candidate

        verse = value.get("verse")
        if isinstance(verse, dict):
            return self._read_verse_key(verse)

        return None

    async def _build_search_result(
        self, verse_key: str, chapters: dict[int, str], raw_search: dict
    ) -> dict:
        chapter_id, verse_number = self._split_verse_key(verse_key)
        chapter_name = chapters.get(chapter_id) if chapter_id else None
        search_item = self._find_raw_search_item(raw_search, verse_key)

        arabic = self._read_text_field(search_item, ("arabic", "text", "name"))
        translation = self._read_text_field(
            search_item, ("translation", "translated_text", "text_translation")
        )

        try:
            verse_data = await self.get_verse_by_key(verse_key)
            verse = verse_data.get("verse", {})
            if isinstance(verse, dict):
                arabic = verse.get("text_uthmani") or arabic
                chapter_id = int(verse.get("chapter_id") or chapter_id or 0) or None
                verse_number = (
                    int(verse.get("verse_number") or verse_number or 0) or None
                )
                if chapter_id:
                    chapter_name = chapters.get(chapter_id, chapter_name)
        except Exception:
            pass

        try:
            translation_data = await self.get_translation_by_verse_key(
                DEFAULT_SEARCH_TRANSLATION_ID, verse_key
            )
            translations = translation_data.get("translations")
            if isinstance(translations, list) and translations:
                first_translation = translations[0]
                if isinstance(first_translation, dict):
                    translation = self._strip_html(
                        first_translation.get("text") or translation
                    )
        except Exception:
            pass

        reference = self._build_reference(
            chapter_name, chapter_id, verse_number, verse_key
        )

        return {
            "verseKey": verse_key,
            "chapterId": chapter_id,
            "chapterName": chapter_name,
            "verseNumber": verse_number,
            "arabic": arabic or "",
            "translation": translation or "",
            "reference": reference,
            "quranComUrl": self._build_quran_com_url(verse_key),
        }

    async def _get_chapter_name_map(self) -> dict[int, str]:
        if self._chapters_cache is not None:
            return self._chapters_cache

        data = await self.get_chapters()
        chapters = data.get("chapters", [])
        chapter_map: dict[int, str] = {}

        if isinstance(chapters, list):
            for chapter in chapters:
                if not isinstance(chapter, dict):
                    continue

                chapter_id = chapter.get("id")
                chapter_name = chapter.get("name_simple")
                if isinstance(chapter_id, int) and isinstance(chapter_name, str):
                    chapter_map[chapter_id] = chapter_name

        self._chapters_cache = chapter_map
        return chapter_map

    def _find_raw_search_item(self, data: dict, verse_key: str) -> dict | None:
        result = data.get("result") if isinstance(data, dict) else None
        collections = []

        if isinstance(result, dict) and isinstance(result.get("verses"), list):
            collections.append(result["verses"])

        for key in ("verses", "results"):
            if isinstance(data.get(key), list):
                collections.append(data[key])

        for collection in collections:
            for item in collection:
                if self._read_verse_key(item) == verse_key and isinstance(item, dict):
                    return item

        return None

    def _read_text_field(self, value, field_names: tuple[str, ...]) -> str:
        if not isinstance(value, dict):
            return ""

        for field_name in field_names:
            candidate = value.get(field_name)
            if isinstance(candidate, str):
                return self._strip_html(candidate)

        return ""

    def _split_verse_key(self, verse_key: str) -> tuple[int | None, int | None]:
        try:
            chapter, verse = verse_key.split(":", 1)
            return int(chapter), int(verse)
        except ValueError:
            return None, None

    def _build_reference(
        self,
        chapter_name: str | None,
        chapter_id: int | None,
        verse_number: int | None,
        verse_key: str,
    ) -> str:
        if chapter_name and chapter_id and verse_number:
            return f"{chapter_name} {chapter_id}:{verse_number}"

        if chapter_name:
            return f"{chapter_name} {verse_key}"

        return verse_key

    def _build_quran_com_url(self, verse_key: str) -> str:
        chapter_id, verse_number = self._split_verse_key(verse_key)
        if chapter_id and verse_number:
            return f"https://quran.com/{chapter_id}/{verse_number}"

        return ""

    def _strip_html(self, value: str) -> str:
        return re.sub(r"<[^>]+>", "", value).strip()


qf_client = QuranFoundationClient()
