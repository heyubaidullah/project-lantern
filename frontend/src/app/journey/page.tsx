"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  getCurrentUser,
  getOnboardingProfile,
  getUserJourneyProgress,
  saveJourneyEntryToDb,
} from "@/lib/db";
import type { OnboardingData, SavedJourneyEntry } from "@/types/app";
import type { Chapter, ChaptersResponse } from "@/types/quran";
import { defaultPathwayContent, pathwayStepsMap } from "@/lib/pathway-content";
import AppFooter from "@/components/AppFooter";

const pathwayMeta: Record<
  string,
  {
    title: string;
    description: string;
    reflectionPrompt: string;
    actions: string[];
  }
> = {
  "reconnect-after-ramadan": {
    title: "Reconnect After Ramadan",
    description: "A gentle path back into consistency and continuity.",
    reflectionPrompt:
      "What is one way you want to carry the spirit of a strong season into ordinary life?",
    actions: [
      "Set aside one calm moment today to return sincerely.",
      "Pause before one task today and begin with gratitude.",
      "Protect one small habit you want to keep going.",
    ],
  },
  "start-understanding": {
    title: "Start Understanding",
    description: "A beginner-friendly journey for meaning, context, and clarity.",
    reflectionPrompt:
      "What part of this passage feels clearer to you today than before?",
    actions: [
      "Read the translation slowly one extra time before moving on.",
      "Write one sentence in your own words about what you understood.",
      "Share one insight with someone close to you today.",
    ],
  },
  "mercy-and-hope": {
    title: "Mercy and Hope",
    description: "A reflective pathway centered on comfort, healing, and return.",
    reflectionPrompt:
      "What in this passage gives you hope or reassurance today?",
    actions: [
      "Make one quiet dua today with hope and trust.",
      "Speak more gently to yourself in one difficult moment.",
      "Remember one blessing you may have overlooked today.",
    ],
  },
  "beginners-7-day": {
    title: "Beginner’s 7-Day Journey",
    description: "A soft introduction for new, returning, or exploring users.",
    reflectionPrompt:
      "What is one idea from today’s passage that feels new, comforting, or important?",
    actions: [
      "Take one minute today to sit quietly with what you read.",
      "Write one question you want to understand better later.",
      "Return tomorrow even if only for a very short reading.",
    ],
  },
};

const languageMeta: Record<string, string> = {
  english: "English",
  arabic: "Arabic",
  spanish: "Spanish",
  urdu: "Urdu",
};

const rhythmMeta: Record<string, string> = {
  "2": "2 minutes",
  "5": "5 minutes",
  "10": "10 minutes",
};

type VerseApiResponse = {
  verse?: {
    verse_key?: string;
    text_uthmani?: string;
  };
};

type TranslationApiResponse = {
  translations?: Array<{
    resource_id?: number;
    resource_name?: string;
    language_name?: string;
    verse_key?: string;
    text?: string;
  }>;
};

export default function JourneyPage() {
  const router = useRouter();

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reflection, setReflection] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [verseArabic, setVerseArabic] = useState("");
  const [verseTranslation, setVerseTranslation] = useState("");
  const [verseLoading, setVerseLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const pathwayConfig = onboardingData?.pathway
    ? pathwayMeta[onboardingData.pathway]
    : null;

  const pathwaySteps =
    onboardingData?.pathway && pathwayStepsMap[onboardingData.pathway]
      ? pathwayStepsMap[onboardingData.pathway]
      : [defaultPathwayContent];

  const boundedStepIndex = Math.min(
    currentStepIndex,
    Math.max(pathwaySteps.length - 1, 0)
  );

  const contentConfig = pathwaySteps[boundedStepIndex] ?? defaultPathwayContent;

  useEffect(() => {
    async function loadJourneyContext() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const profile = await getOnboardingProfile();

        if (!profile) {
          router.replace("/onboarding");
          return;
        }

        setOnboardingData(profile);

        const progress = await getUserJourneyProgress();
        if (progress && progress.pathway === profile.pathway) {
          setCurrentStepIndex(progress.step_index ?? 0);
        } else {
          setCurrentStepIndex(0);
        }

        const selectedPathway = pathwayMeta[profile.pathway];
        if (selectedPathway?.actions?.[0]) {
          setSelectedAction(selectedPathway.actions[0]);
        }
      } catch (err) {
        console.error("Failed to load onboarding profile", err);
      }
    }

    async function fetchChapters() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/qf/chapters`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch today’s journey");
        }

        const data: ChaptersResponse = await response.json();
        setChapters(data.chapters);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadJourneyContext();
    fetchChapters();
  }, [router]);

  useEffect(() => {
    async function fetchVerseAndTranslation() {
      if (!contentConfig.verseKey) return;

      setVerseLoading(true);

      try {
        const [verseResponse, translationResponse] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/qf/verse/${contentConfig.verseKey}`
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/qf/translation/85/${contentConfig.verseKey}`
          ),
        ]);

        if (!verseResponse.ok) {
          throw new Error("Failed to fetch verse content");
        }

        if (!translationResponse.ok) {
          throw new Error("Failed to fetch verse translation");
        }

        const verseData: VerseApiResponse = await verseResponse.json();
        const translationData: TranslationApiResponse =
          await translationResponse.json();

        const verse = verseData.verse;
        const translation = translationData.translations?.[0];

        setVerseArabic(verse?.text_uthmani ?? "");
        setVerseTranslation(translation?.text ?? "");
      } catch (err) {
        console.error("Failed to fetch verse or translation", err);
        setVerseArabic("");
        setVerseTranslation("");
      } finally {
        setVerseLoading(false);
      }
    }

    fetchVerseAndTranslation();
  }, [contentConfig.verseKey]);

  const chapter = useMemo(() => {
    if (!chapters.length) return undefined;
    return (
      chapters.find((item) => item.id === contentConfig.chapterId) ?? chapters[0]
    );
  }, [chapters, contentConfig.chapterId]);

  const actionOptions =
    pathwayConfig?.actions ?? [
      "Reach out kindly to one family member today.",
      "Pause before reacting in one difficult moment.",
      "Take one quiet minute before your next task.",
    ];

  const reflectionPrompt =
    pathwayConfig?.reflectionPrompt ??
    "What feels personally relevant from this passage today?";

  const pathwayTitle = pathwayConfig?.title ?? "Your chosen pathway";
  const pathwayDescription =
    pathwayConfig?.description ??
    "A guided daily path to help you return consistently.";

  const selectedLanguage =
    onboardingData?.language ? languageMeta[onboardingData.language] : "English";
  const selectedRhythm =
    onboardingData?.rhythm ? rhythmMeta[onboardingData.rhythm] : "5 minutes";

  const isLastStep = boundedStepIndex >= pathwaySteps.length - 1;

  async function saveTodayReflection() {
    if (!chapter) return;
    if (!reflection.trim()) {
      setSaveMessage("Please write a reflection before saving.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    const nextStepIndex = Math.min(
      boundedStepIndex + 1,
      Math.max(pathwaySteps.length - 1, 0)
    );

    const entry: SavedJourneyEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      pathway: onboardingData?.pathway ?? "default",
      pathwayTitle,
      language: selectedLanguage,
      rhythm: selectedRhythm,
      chapterId: chapter.id,
      chapterName: chapter.name_simple,
      chapterArabicName: chapter.name_arabic,
      reflection: reflection.trim(),
      actionStep: selectedAction,
    };

    try {
      await saveJourneyEntryToDb(entry, nextStepIndex);
      setLastSavedAt(entry.createdAt);
      setSaveMessage(
        isLastStep
          ? "Today’s reflection was saved. You’ve completed the current journey."
          : "Today’s reflection was saved. Your journey will continue from the next step."
      );
    } catch (err) {
      setSaveMessage(
        err instanceof Error
          ? err.message
          : "Failed to save today’s reflection."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top, var(--bg-page-alt) 0%, var(--bg-page) 45%, var(--bg-page) 100%)",
      }}
    >
      <Header />

      <main className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[360px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(140,199,195,0.16), transparent 40%), radial-gradient(circle at top left, rgba(111,175,207,0.14), transparent 35%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Today’s Journey
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-4xl">
              {pathwayTitle}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              {pathwayDescription} Return gently, one meaningful step at a time.
            </p>
            <p className="mt-4 inline-flex rounded-full bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--text-strong)]">
              Step {boundedStepIndex + 1} of {pathwaySteps.length}
            </p>
          </div>

          {loading && (
            <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-8 shadow-sm">
              <p className="text-[var(--text-muted)]">Preparing today’s journey...</p>
            </div>
          )}

          {error && (
            <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && chapter && (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="space-y-6">
                <div className="overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] shadow-[0_24px_70px_rgba(30,45,56,0.08)]">
                  <div
                    className="border-b px-6 py-6 text-white sm:px-8"
                    style={{
                      borderColor: "var(--border-soft)",
                      background:
                        "linear-gradient(135deg, var(--brand-a) 0%, #7dbdca 42%, var(--brand-b) 100%)",
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                      Read
                    </p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h2 className="text-3xl font-semibold tracking-tight">
                          {chapter.name_simple}
                        </h2>
                        <p className="mt-1 text-sm text-white/85">
                          {chapter.translated_name.name}
                        </p>
                      </div>
                      <p className="text-3xl sm:text-4xl">{chapter.name_arabic}</p>
                    </div>
                  </div>

                  <div className="px-6 py-6 sm:px-8">
                    <div className="rounded-[1.5rem] bg-[var(--surface-soft)] p-5">
                      <p className="text-sm font-medium text-[var(--text-muted)]">
                        Today’s selected passage
                      </p>

                      {verseLoading ? (
                        <p className="mt-4 text-sm text-[var(--text-muted)]">
                          Loading verse...
                        </p>
                      ) : (
                        <>
                          <p className="mt-3 text-2xl leading-relaxed text-[var(--text-strong)] sm:text-3xl">
                            {verseArabic || "Verse unavailable"}
                          </p>
                          <p className="mt-4 text-base leading-8 text-[var(--text-muted)]">
                            “{verseTranslation || "Translation unavailable"}”
                          </p>
                        </>
                      )}
                    </div>

                    <div className="mt-6 rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        Understand
                      </p>
                      <p className="mt-3 leading-7 text-[var(--text-muted)]">
                        {contentConfig.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Reflect
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--heading-accent)]">
                    {reflectionPrompt}
                  </h3>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Write a private reflection for yourself..."
                    className="mt-5 min-h-[160px] w-full rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-a)] focus:ring-4 focus:ring-[rgba(111,175,207,0.10)]"
                  />

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={saveTodayReflection}
                      disabled={isSaving}
                      className="rounded-full bg-[var(--button-primary-bg)] px-6 py-3 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : "Save today’s reflection"}
                    </button>

                    {lastSavedAt && (
                      <p className="text-sm text-[var(--text-muted)]">Saved just now</p>
                    )}
                  </div>

                  {saveMessage && (
                    <div
                      className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                        saveMessage.includes("saved")
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {saveMessage}
                    </div>
                  )}
                </div>
              </section>

              <aside className="space-y-6">
                <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Act
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--heading-accent)]">
                    Choose one small step
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                    Let today’s passage become something you carry into real life.
                  </p>

                  <div className="mt-6 space-y-3">
                    {actionOptions.map((option) => {
                      const isSelected = selectedAction === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedAction(option)}
                          className={`w-full rounded-[1.25rem] border px-4 py-4 text-left transition ${
                            isSelected
                              ? "border-[var(--brand-a)] bg-[var(--surface-soft)] shadow-sm"
                              : "border-[var(--border-soft)] bg-[var(--surface-raised)] hover:bg-[var(--surface-soft)]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                isSelected
                                  ? "border-[var(--brand-a)] bg-[var(--brand-a)]"
                                  : "border-[var(--border-soft)] bg-[var(--surface-raised)]"
                              }`}
                            >
                              {isSelected && (
                                <div className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>

                            <p className="text-sm leading-6 text-[var(--text-strong)]">
                              {option}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Journey Snapshot
                  </p>

                  <div className="mt-5 grid gap-4">
                    <SnapshotRow label="Language" value={selectedLanguage} />
                    <SnapshotRow label="Rhythm" value={selectedRhythm} />
                    <SnapshotRow label="Pathway" value={pathwayTitle} />
                    <SnapshotRow
                      label="Today’s focus"
                      value={chapter.name_simple}
                    />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-dashed border-[var(--border-soft)] bg-[var(--surface-soft)] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Gentle note
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                    Returning with sincerity matters more than doing a lot. Let
                    this be a calm beginning, not a heavy burden.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
        <AppFooter />
      </main>
    </div>
  );

}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4">
      <span className="text-sm text-[var(--text-muted)]">{label}</span>
      <span className="text-sm font-medium text-[var(--text-strong)]">
        {value}
      </span>
    </div>
  );
}