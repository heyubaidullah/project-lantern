import time
import httpx

from config import settings


class QuranFoundationClient:
    def __init__(self) -> None:
        self._token: str | None = None
        self._token_expires_at: float = 0

    async def get_access_token(self) -> str:
        now = time.time()

        if self._token and now < self._token_expires_at:
            return self._token

        token_url = f"{settings.qf_auth_base_url}/oauth2/token"

        client_id = settings.qf_client_id.strip()
        client_secret = settings.qf_client_secret.strip()

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                token_url,
                auth=(client_id, client_secret),
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={"grant_type": "client_credentials", "scope": "content"},
            )
            response.raise_for_status()
            data = response.json()

        access_token = data["access_token"]
        expires_in = data.get("expires_in", 3600)

        self._token = access_token
        self._token_expires_at = now + expires_in - 60
        return access_token

    async def get_chapters(self) -> dict:
        access_token = await self.get_access_token()
        url = f"{settings.qf_api_base_url}/content/api/v4/chapters"
        client_id = settings.qf_client_id.strip()

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers={
                    "x-auth-token": access_token,
                    "x-client-id": client_id,
                    "Accept": "application/json",
                },
            )
            response.raise_for_status()
            return response.json()

    async def get_verse_by_key(self, verse_key: str) -> dict:
        access_token = await self.get_access_token()
        url = f"{settings.qf_api_base_url}/content/api/v4/verses/by_key/{verse_key}"
        client_id = settings.qf_client_id.strip()

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers={
                    "x-auth-token": access_token,
                    "x-client-id": client_id,
                    "Accept": "application/json",
                },
                params={
                    "fields": "text_uthmani",
                },
            )
            response.raise_for_status()
            return response.json()

    async def get_translation_resources(self) -> dict:
        access_token = await self.get_access_token()
        url = f"{settings.qf_api_base_url}/content/api/v4/resources/translations"
        client_id = settings.qf_client_id.strip()

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers={
                    "x-auth-token": access_token,
                    "x-client-id": client_id,
                    "Accept": "application/json",
                },
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
        client_id = settings.qf_client_id.strip()

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers={
                    "x-auth-token": access_token,
                    "x-client-id": client_id,
                    "Accept": "application/json",
                },
                params={
                    "verse_key": verse_key,
                    "fields": "resource_name,language_name,verse_key",
                },
            )
            response.raise_for_status()
            return response.json()


qf_client = QuranFoundationClient()