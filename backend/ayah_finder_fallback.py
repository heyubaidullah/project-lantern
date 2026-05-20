import re


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


def get_curated_fallback_verse_keys(query: str, max_results: int) -> list[str]:
    normalized_query = query.lower()
    verse_keys: list[str] = []

    for topic, topic_verse_keys in CURATED_FALLBACK_VERSES.items():
        if not re.search(rf"\b{re.escape(topic)}\b", normalized_query):
            continue

        for verse_key in topic_verse_keys:
            if verse_key not in verse_keys:
                verse_keys.append(verse_key)

            if len(verse_keys) == max_results:
                return verse_keys

    return verse_keys or DEFAULT_FALLBACK_VERSES[:max_results]
