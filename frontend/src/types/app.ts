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