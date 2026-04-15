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