export type OnboardingData = {
  intent: string;
  language: string;
  rhythm: string;
  pathway: string;
  completedAt?: string;
};

export type SavedJourneyEntry = {
  id: string;
  createdAt: string;
  pathway: string;
  pathwayTitle: string;
  language: string;
  rhythm: string;
  chapterId: number;
  chapterName: string;
  chapterArabicName: string;
  reflection: string;
  actionStep: string;
};