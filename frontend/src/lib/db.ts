import { supabase } from "@/lib/supabase";
import type { OnboardingData, SavedJourneyEntry } from "@/types/app";

const PROFILE_KEY_STORAGE_KEY = "lantern_profile_key";

export function getOrCreateProfileKey(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existingKey = localStorage.getItem(PROFILE_KEY_STORAGE_KEY);
  if (existingKey) {
    return existingKey;
  }

  const newKey = crypto.randomUUID();
  localStorage.setItem(PROFILE_KEY_STORAGE_KEY, newKey);
  return newKey;
}

export async function saveOnboardingProfile(
  data: OnboardingData
): Promise<void> {
  const profileKey = getOrCreateProfileKey();

  const { error } = await supabase.from("onboarding_profiles").upsert(
    {
      profile_key: profileKey,
      intent: data.intent,
      language: data.language,
      rhythm: data.rhythm,
      pathway: data.pathway,
      completed_at: data.completedAt ?? null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "profile_key",
    }
  );

  if (error) {
    throw error;
  }
}

export async function getOnboardingProfile(): Promise<OnboardingData | null> {
  const profileKey = getOrCreateProfileKey();

  const { data, error } = await supabase
    .from("onboarding_profiles")
    .select("intent, language, rhythm, pathway, completed_at")
    .eq("profile_key", profileKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    intent: data.intent,
    language: data.language,
    rhythm: data.rhythm,
    pathway: data.pathway,
    completedAt: data.completed_at ?? undefined,
  };
}

export async function saveJourneyEntryToDb(
  entry: SavedJourneyEntry
): Promise<void> {
  const profileKey = getOrCreateProfileKey();

  const { error } = await supabase.from("journey_entries").insert({
    profile_key: profileKey,
    created_at: entry.createdAt,
    pathway: entry.pathway,
    pathway_title: entry.pathwayTitle,
    language: entry.language,
    rhythm: entry.rhythm,
    chapter_id: entry.chapterId,
    chapter_name: entry.chapterName,
    chapter_arabic_name: entry.chapterArabicName,
    reflection: entry.reflection,
    action_step: entry.actionStep,
  });

  if (error) {
    throw error;
  }
}

export async function getJourneyEntriesFromDb(): Promise<SavedJourneyEntry[]> {
  const profileKey = getOrCreateProfileKey();

  const { data, error } = await supabase
    .from("journey_entries")
    .select(
      `
      id,
      created_at,
      pathway,
      pathway_title,
      language,
      rhythm,
      chapter_id,
      chapter_name,
      chapter_arabic_name,
      reflection,
      action_step
    `
    )
    .eq("profile_key", profileKey)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    createdAt: item.created_at,
    pathway: item.pathway,
    pathwayTitle: item.pathway_title,
    language: item.language,
    rhythm: item.rhythm,
    chapterId: item.chapter_id,
    chapterName: item.chapter_name,
    chapterArabicName: item.chapter_arabic_name,
    reflection: item.reflection,
    actionStep: item.action_step,
  }));
}