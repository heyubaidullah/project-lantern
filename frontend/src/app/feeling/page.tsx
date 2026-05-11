"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppFooter from "@/components/AppFooter";
import FeelingCard from "@/components/FeelingCard";
import FeelingResult from "@/components/FeelingResult";
import Header from "@/components/Header";
import { lifeStateOptions, type LifeStateKey } from "@/lib/life-state-config";
import { getCurrentUser, saveJourneyEntryToDb } from "@/lib/db";
import type { SavedJourneyEntry } from "@/types/app";

export default function FeelingPage() {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<LifeStateKey>("anxious");
  const [reflection, setReflection] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const selectedOption = useMemo(
    () => lifeStateOptions.find((option) => option.key === selectedKey) ?? lifeStateOptions[0],
    [selectedKey]
  );

  async function saveFeelingReflection() {
    if (!reflection.trim()) {
      setSaveMessage("Please write a reflection before saving to your journal.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const user = await getCurrentUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const entry: SavedJourneyEntry = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        pathway: "life-state",
        pathwayTitle: "I’m Feeling",
        language: "English",
        rhythm: "In the moment",
        chapterId: Number(selectedOption.verseKey.split(":")[0]) || 0,
        chapterName: selectedOption.surahName,
        chapterArabicName: selectedOption.surahName,
        reflection: reflection.trim(),
        actionStep: selectedOption.actionStep,
        source: "feeling",
        lifeStateKey: selectedOption.key,
        lifeStateLabel: selectedOption.label,
        verseKey: selectedOption.verseKey,
        verseText: selectedOption.arabic,
        verseTranslation: selectedOption.translation,
        journalPrompt: selectedOption.journalPrompt,
        journalNote: reflection.trim(),
      };

      await saveJourneyEntryToDb(entry);
      setSaveMessage("Saved to your journal.");
      setReflection("");
    } catch {
      setSaveMessage("We couldn’t save this reflection right now. Please try again.");
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
          className="pointer-events-none absolute inset-x-0 top-0 h-[380px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(140,199,195,0.18), transparent 40%), radial-gradient(circle at top left, rgba(111,175,207,0.14), transparent 35%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
              I’m Feeling
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-5xl">
              Choose what your heart needs today.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              A separate life-state space for quickly finding a steady ayah,
              a gentle action, and a private journal prompt without changing
              your daily journey.
            </p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lifeStateOptions.map((option) => (
              <FeelingCard
                key={option.key}
                option={option}
                selected={selectedOption.key === option.key}
                onSelect={(key) => {
                  setSelectedKey(key);
                  setSaveMessage("");
                }}
              />
            ))}
          </section>

          <div className="mt-8">
            <FeelingResult
              option={selectedOption}
              reflection={reflection}
              isSaving={isSaving}
              saveMessage={saveMessage}
              onReflectionChange={setReflection}
              onSave={saveFeelingReflection}
            />
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
