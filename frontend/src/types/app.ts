export type OnboardingData = {
  firstName: string;
  lastName: string;
  intent: string;
  language: string;
  rhythm: string;
  pathway: string;
  completedAt: string;
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
  source?: "journey" | "feeling" | "journal" | "ayah-finder";
  lifeStateKey?: string | null;
  lifeStateLabel?: string | null;
  verseKey?: string | null;
  verseText?: string | null;
  verseTranslation?: string | null;
  journalPrompt?: string | null;
  journalNote?: string | null;
};

export type JournalEntry = {
  id: string;
  createdAt: string;
  title: string;
  note: string;
  mood?: string | null;
  prompt?: string | null;
};

export type UserProfile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

export type UserStreak = {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
};

export type UserJourneyProgress = {
  user_id: string;
  pathway: string;
  step_index: number;
  updated_at: string;
};