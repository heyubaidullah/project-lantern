import { createClient } from "@/lib/supabase/client";
import type {
  JournalEntry,
  OnboardingData,
  SavedJourneyEntry,
  UserJourneyProgress,
  UserProfile,
  UserStreak,
} from "@/types/app";

type DbRecord = Record<string, string | number | null | undefined>;

function readString(value: DbRecord[string], fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function readNumber(value: DbRecord[string], fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function readNullableString(value: DbRecord[string]) {
  const stringValue = readString(value);
  return stringValue || null;
}

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayDateString() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}

function isMissingColumnError(error: unknown) {
  if (typeof error !== "object" || error === null) return false;

  const maybeError = error as { code?: unknown; message?: unknown };
  const message =
    typeof maybeError.message === "string" ? maybeError.message.toLowerCase() : "";

  return (
    maybeError.code === "42703" ||
    maybeError.code === "PGRST204" ||
    message.includes("column") ||
    message.includes("schema cache")
  );
}

function isAuthSessionMissingError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    (error as { message: string }).message
      .toLowerCase()
      .includes("auth session missing")
  );
}

export async function getCurrentUser() {
  const supabase = createClient();

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      if (isAuthSessionMissingError(sessionError)) {
        return null;
      }
      throw sessionError;
    }

    if (!session?.user) {
      return null;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      if (isAuthSessionMissingError(userError)) {
        return null;
      }
      throw userError;
    }

    return user ?? null;
  } catch (error) {
    if (isAuthSessionMissingError(error)) {
      return null;
    }
    throw error;
  }
}

export async function ensureProfile() {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const existing = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing.error) {
    throw existing.error;
  }

  if (existing.data) {
    return existing.data as UserProfile;
  }

  const fullName = user.user_metadata?.full_name as string | undefined;
  const firstName =
    (user.user_metadata?.given_name as string | undefined) ??
    fullName?.split(" ")[0] ??
    null;
  const lastName =
    (user.user_metadata?.family_name as string | undefined) ??
    (fullName ? fullName.split(" ").slice(1).join(" ") || null : null);

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email: user.email ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

export async function getProfile() {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data as UserProfile | null;
}

export async function saveOnboardingProfile(data: OnboardingData) {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be signed in to save onboarding.");
  }

  await ensureProfile();

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      first_name: data.firstName.trim() || null,
      last_name: data.lastName.trim() || null,
      email: user.email ?? null,
    },
    { onConflict: "id" }
  );

  if (profileError) {
    throw profileError;
  }

  const { error } = await supabase.from("user_onboarding").upsert(
    {
      user_id: user.id,
      intent: data.intent,
      language: data.language,
      rhythm: data.rhythm,
      pathway: data.pathway,
      completed_at: data.completedAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw error;
  }

  const { data: existingProgress, error: progressReadError } = await supabase
    .from("user_journey_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (progressReadError) {
    throw progressReadError;
  }

  if (!existingProgress) {
    const { error: progressError } = await supabase
      .from("user_journey_progress")
      .insert({
        user_id: user.id,
        pathway: data.pathway,
        step_index: 0,
        updated_at: new Date().toISOString(),
      });

    if (progressError) {
      throw progressError;
    }
  }
}

export async function getOnboardingProfile(): Promise<OnboardingData | null> {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const [
    { data: onboarding, error: onboardingError },
    { data: profile, error: profileError },
  ] = await Promise.all([
    supabase
      .from("user_onboarding")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
  ]);

  if (onboardingError) throw onboardingError;
  if (profileError) throw profileError;
  if (!onboarding) return null;

  return {
    firstName: profile?.first_name ?? "",
    lastName: profile?.last_name ?? "",
    intent: onboarding.intent ?? "",
    language: onboarding.language ?? "",
    rhythm: onboarding.rhythm ?? "",
    pathway: onboarding.pathway ?? "",
    completedAt: onboarding.completed_at ?? "",
  };
}

export async function getJourneyEntriesFromDb(): Promise<SavedJourneyEntry[]> {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("journey_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as DbRecord[]).map((entry) => ({
    id: readString(entry.id),
    createdAt: readString(entry.created_at),
    pathway: readString(entry.pathway),
    pathwayTitle: readString(entry.pathway_title),
    language: readString(entry.language),
    rhythm: readString(entry.rhythm),
    chapterId: readNumber(entry.chapter_id),
    chapterName: readString(entry.chapter_name),
    chapterArabicName: readString(entry.chapter_arabic_name),
    reflection: readString(entry.reflection),
    actionStep: readString(entry.action_step),
    source: readString(entry.source, "journey") as SavedJourneyEntry["source"],
    lifeStateKey: readNullableString(entry.life_state_key),
    lifeStateLabel: readNullableString(entry.life_state_label),
    verseKey: readNullableString(entry.verse_key),
    verseText: readNullableString(entry.verse_text),
    verseTranslation: readNullableString(entry.verse_translation),
    journalPrompt: readNullableString(entry.journal_prompt),
    journalNote: readNullableString(entry.journal_note),
  }));
}

export async function getUserStreak(): Promise<UserStreak | null> {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data as UserStreak | null;
}

export async function getUserJourneyProgress(): Promise<UserJourneyProgress | null> {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_journey_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data as UserJourneyProgress | null;
}

export async function advanceUserJourneyProgress(
  pathway: string,
  nextStepIndex: number
) {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return;

  const { error } = await supabase.from("user_journey_progress").upsert(
    {
      user_id: user.id,
      pathway,
      step_index: nextStepIndex,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) throw error;
}

async function updateUserStreakForToday() {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return;

  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const { data: streakRow, error: streakError } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (streakError) throw streakError;

  if (!streakRow) {
    const { error } = await supabase.from("user_streaks").insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_completed_date: today,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return;
  }

  if (streakRow.last_completed_date === today) {
    return;
  }

  const nextCurrent =
    streakRow.last_completed_date === yesterday
      ? streakRow.current_streak + 1
      : 1;

  const nextLongest = Math.max(nextCurrent, streakRow.longest_streak ?? 0);

  const { error } = await supabase
    .from("user_streaks")
    .update({
      current_streak: nextCurrent,
      longest_streak: nextLongest,
      last_completed_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function saveJourneyEntryToDb(
  entry: SavedJourneyEntry,
  nextStepIndex?: number
) {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be signed in to save a reflection.");
  }

  const entryDate = getTodayDateString();

  const basePayload = {
    id: readString(entry.id),
    user_id: user.id,
    pathway: readString(entry.pathway),
    pathway_title: entry.pathwayTitle,
    language: readString(entry.language),
    rhythm: readString(entry.rhythm),
    chapter_id: entry.chapterId,
    chapter_name: entry.chapterName,
    chapter_arabic_name: entry.chapterArabicName,
    reflection: readString(entry.reflection),
    action_step: entry.actionStep,
    entry_date: entryDate,
    created_at: entry.createdAt,
  };

  const v2Payload = {
    ...basePayload,
    source: readString(entry.source, "journey") as SavedJourneyEntry["source"],
    life_state_key: entry.lifeStateKey ?? null,
    life_state_label: entry.lifeStateLabel ?? null,
    verse_key: entry.verseKey ?? null,
    verse_text: entry.verseText ?? null,
    verse_translation: entry.verseTranslation ?? null,
    journal_prompt: entry.journalPrompt ?? null,
    journal_note: entry.journalNote ?? null,
  };

  const { error } = await supabase.from("journey_entries").insert(v2Payload);

  if (error) {
    if (!isMissingColumnError(error)) {
      throw error;
    }

    const { error: fallbackError } = await supabase
      .from("journey_entries")
      .insert(basePayload);

    if (fallbackError) throw fallbackError;
  }

  await updateUserStreakForToday();

  if (typeof nextStepIndex === "number") {
    await advanceUserJourneyProgress(entry.pathway, nextStepIndex);
  }
}

export async function getJournalEntriesFromDb(): Promise<JournalEntry[]> {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("ah_journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingColumnError(error)) return [];
    throw error;
  }

  return ((data ?? []) as DbRecord[]).map((entry) => ({
    id: readString(entry.id),
    createdAt: readString(entry.created_at),
    title: readString(entry.title, "Journal note"),
    note: readString(entry.note),
    mood: readNullableString(entry.mood),
    prompt: readNullableString(entry.prompt),
  }));
}

export async function saveJournalEntryToDb(entry: JournalEntry) {
  const supabase = createClient();
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be signed in to save a journal entry.");
  }

  const { error } = await supabase.from("ah_journal_entries").insert({
    id: readString(entry.id),
    user_id: user.id,
    title: entry.title,
    note: entry.note,
    mood: entry.mood ?? null,
    prompt: entry.prompt ?? null,
    created_at: entry.createdAt,
  });

  if (error) throw error;
}
