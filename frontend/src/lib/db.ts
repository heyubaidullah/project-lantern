import { createClient } from "@/lib/supabase/client";
import type {
  OnboardingData,
  SavedJourneyEntry,
  UserJourneyProgress,
  UserProfile,
  UserStreak,
} from "@/types/app";

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function getYesterdayDateString() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
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

  return (data ?? []).map((entry) => ({
    id: entry.id,
    createdAt: entry.created_at,
    pathway: entry.pathway,
    pathwayTitle: entry.pathway_title,
    language: entry.language,
    rhythm: entry.rhythm,
    chapterId: entry.chapter_id,
    chapterName: entry.chapter_name,
    chapterArabicName: entry.chapter_arabic_name,
    reflection: entry.reflection,
    actionStep: entry.action_step,
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

  const { error } = await supabase.from("journey_entries").insert({
    id: entry.id,
    user_id: user.id,
    pathway: entry.pathway,
    pathway_title: entry.pathwayTitle,
    language: entry.language,
    rhythm: entry.rhythm,
    chapter_id: entry.chapterId,
    chapter_name: entry.chapterName,
    chapter_arabic_name: entry.chapterArabicName,
    reflection: entry.reflection,
    action_step: entry.actionStep,
    entry_date: entryDate,
    created_at: entry.createdAt,
  });

  if (error) throw error;

  await updateUserStreakForToday();

  if (typeof nextStepIndex === "number") {
    await advanceUserJourneyProgress(entry.pathway, nextStepIndex);
  }
}