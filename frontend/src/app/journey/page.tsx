"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import {
  getOnboardingProfile,
  saveJourneyEntryToDb,
} from "@/lib/db";
import type { OnboardingData, SavedJourneyEntry } from "@/types/app";
import type { Chapter, ChaptersResponse } from "@/types/quran";
import {
  defaultPathwayContent,
  pathwayContentMap,
} from "@/lib/pathway-content";

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

export default function JourneyPage() {
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

  useEffect(() => {
    async function loadJourneyContext() {
      try {
        const profile = await getOnboardingProfile();
        if (profile) {
          setOnboardingData(profile);

          const pathwayConfig = pathwayMeta[profile.pathway];
          if (pathwayConfig?.actions?.[0]) {
            setSelectedAction(pathwayConfig.actions[0]);
          }
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
  }, []);

  const pathwayConfig = onboardingData?.pathway
  ? pathwayMeta[onboardingData.pathway]
  : null;
  
  const contentConfig =
  onboardingData?.pathway && pathwayContentMap[onboardingData.pathway]
  ? pathwayContentMap[onboardingData.pathway]
  : defaultPathwayContent;
  
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

  async function saveTodayReflection() {
    if (!chapter) return;
    if (!reflection.trim()) {
      setSaveMessage("Please write a reflection before saving.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

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
      await saveJourneyEntryToDb(entry);
      setLastSavedAt(entry.createdAt);
      setSaveMessage("Today’s reflection was saved successfully.");
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#edf7fa_0%,#f7fbfc_45%,#f7fbfc_100%)]">
      <Header />

      <main className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_top_right,rgba(140,199,195,0.16),transparent_40%),radial-gradient(circle_at_top_left,rgba(111,175,207,0.14),transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5A6B75]">
              Today’s Journey
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1E2D38] sm:text-4xl">
              {pathwayTitle}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5A6B75] sm:text-base">
              {pathwayDescription}
            </p>
          </div>

          {loading && (
            <div className="rounded-[2rem] border border-[#d8e7ec] bg-white p-8 shadow-sm">
              <p className="text-[#5A6B75]">Preparing today’s journey...</p>
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
                <div className="overflow-hidden rounded-[2rem] border border-[#d8e7ec] bg-white shadow-[0_24px_70px_rgba(30,45,56,0.08)]">
                  <div className="border-b border-[#E3EEF1] bg-[linear-gradient(135deg,#6FAFCF_0%,#7dbdca_42%,#8CC7C3_100%)] px-6 py-6 text-white sm:px-8">
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
                    <div className="rounded-[1.5rem] bg-[#F7FBFC] p-5">
                      <p className="text-sm font-medium text-[#5A6B75]">
                        Today’s selected passage
                      </p>
                      <p className="mt-3 text-2xl leading-relaxed text-[#1E2D38] sm:text-3xl">
                        {contentConfig.verseArabic}
                      </p>
                      <p className="mt-4 text-base leading-8 text-[#5A6B75]">
                        “{contentConfig.translation}”
                      </p>
                    </div>

                    <div className="mt-6 rounded-[1.5rem] border border-[#E3EEF1] bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6B75]">
                        Understand
                      </p>
                      <p className="mt-3 leading-7 text-[#5A6B75]">
                        {contentConfig.explanation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[#d8e7ec] bg-white p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6B75]">
                    Reflect
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1E2D38]">
                    {reflectionPrompt}
                  </h3>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Write a private reflection for yourself..."
                    className="mt-5 min-h-[160px] w-full rounded-[1.5rem] border border-[#D6E8EF] bg-[#FBFEFF] px-5 py-4 text-sm text-[#1E2D38] outline-none transition placeholder:text-[#8BA0AA] focus:border-[#6FAFCF] focus:ring-4 focus:ring-[#6FAFCF]/10"
                  />

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={saveTodayReflection}
                      disabled={isSaving}
                      className="rounded-full bg-[#1E2D38] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : "Save today’s reflection"}
                    </button>

                    {lastSavedAt && (
                      <p className="text-sm text-[#5A6B75]">Saved just now</p>
                    )}
                  </div>

                  {saveMessage && (
                    <div
                      className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                        saveMessage.includes("successfully")
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
                <div className="rounded-[2rem] border border-[#d8e7ec] bg-white p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6B75]">
                    Act
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#1E2D38]">
                    Choose one small step
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#5A6B75]">
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
                              ? "border-[#6FAFCF] bg-[linear-gradient(180deg,#f7fcff_0%,#eef8fb_100%)] shadow-sm"
                              : "border-[#E3EEF1] bg-white hover:border-[#CFE2E8] hover:bg-[#FBFEFF]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                isSelected
                                  ? "border-[#6FAFCF] bg-[#6FAFCF]"
                                  : "border-[#C9DCE3] bg-white"
                              }`}
                            >
                              {isSelected && (
                                <div className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>

                            <p className="text-sm leading-6 text-[#1E2D38]">
                              {option}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[#d8e7ec] bg-white p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6B75]">
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

                <div className="rounded-[2rem] border border-dashed border-[#D6E8EF] bg-[#F7FBFC] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6B75]">
                    Gentle note
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#5A6B75]">
                    Returning with sincerity matters more than doing a lot. Let
                    this be a calm beginning, not a heavy burden.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-[#E3EEF1] bg-[#FBFEFF] px-4 py-4">
      <span className="text-sm text-[#5A6B75]">{label}</span>
      <span className="text-sm font-medium text-[#1E2D38]">{value}</span>
    </div>
  );
}