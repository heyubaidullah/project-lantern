export type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  translated_name: {
    language_name: string;
    name: string;
  };
};

export type ChaptersResponse = {
  chapters: Chapter[];
};

export type AyahSearchResult = {
  verseKey: string | null;
  chapterId: number | null;
  chapterName: string | null;
  verseNumber: number | null;
  arabic: string;
  translation: string;
  reference: string;
  quranComUrl: string;
};

export type AyahSearchSource = "qf-search" | "curated-fallback";

export type AyahSearchResponse = {
  query: string;
  source: AyahSearchSource;
  results: AyahSearchResult[];
};
