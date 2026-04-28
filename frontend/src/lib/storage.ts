import type { OnboardingData, SavedJourneyEntry } from "@/types/app";

const ONBOARDING_STORAGE_KEY = "lantern_onboarding";
const SAVED_ENTRIES_STORAGE_KEY = "lantern_saved_entries";

export function getOnboardingData(): OnboardingData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}

export function saveOnboardingData(data: OnboardingData): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
}

export function clearOnboardingData(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
}

export function getSavedJourneyEntries(): SavedJourneyEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(SAVED_ENTRIES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedJourneyEntry[];
  } catch {
    return [];
  }
}

export function saveJourneyEntry(entry: SavedJourneyEntry): SavedJourneyEntry[] {
  if (typeof window === "undefined") return [];

  const existingEntries = getSavedJourneyEntries();
  const updatedEntries = [entry, ...existingEntries];

  localStorage.setItem(
    SAVED_ENTRIES_STORAGE_KEY,
    JSON.stringify(updatedEntries)
  );

  return updatedEntries;
}

export function clearSavedJourneyEntries(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SAVED_ENTRIES_STORAGE_KEY);
}