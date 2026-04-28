"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import HeroCard from "@/components/HeroCard";
import { ChapterPreviewCard } from "@/components/chapter-preview-card";
import { PathwayCard } from "@/components/pathway-card";
import { ReflectionCard } from "@/components/reflection-card";
import { ProgressCard } from "@/components/progress-card";
import AppFooter from "@/components/AppFooter";
import { getJourneyEntriesFromDb } from "@/lib/db";
import type { SavedJourneyEntry } from "@/types/app";
import type { Chapter, ChaptersResponse } from "@/types/quran";

export default function HomePage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedEntries, setSavedEntries] = useState<SavedJourneyEntry[]>([]);
  const [visibleChapterCount, setVisibleChapterCount] = useState(6);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/qf/chapters`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }

        const data: ChaptersResponse = await response.json();
        setChapters(data.chapters);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    async function fetchSavedEntries() {
      try {
        const entries = await getJourneyEntriesFromDb();
        setSavedEntries(entries);
      } catch (err) {
        console.error("Failed to fetch saved journey entries", err);
        setSavedEntries([]);
      }
    }

    fetchChapters();
    fetchSavedEntries();
  }, []);

  const latestEntry = useMemo(() => savedEntries[0], [savedEntries]);
  const savedCount = savedEntries.length;
  const uniquePathways = new Set(
    savedEntries.map((entry) => entry.pathwayTitle)
  ).size;
  const visibleChapters = chapters.slice(0, visibleChapterCount);
  const hasMoreChapters = visibleChapterCount < chapters.length;

  function formatSavedTime(isoDate: string) {
    const date = new Date(isoDate);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function handleShowMore() {
    setVisibleChapterCount((prev) => Math.min(prev + 6, chapters.length));
  }

  function handleShowLess() {
    setVisibleChapterCount(6);
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
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(140,199,195,0.18), transparent 40%), radial-gradient(circle at top left, rgba(111,175,207,0.14), transparent 35%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:py-10">
          <HeroCard />

          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-[var(--heading-accent)]">
                Recent Reflection
              </h2>
              <p className="mt-2 text-[var(--text-muted)]">
                Your most recent saved step from the journey.
              </p>
            </div>

            {latestEntry ? (
              <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        {latestEntry.pathwayTitle}
                      </span>
                      <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        {latestEntry.chapterName}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--heading-accent)]">
                      {latestEntry.chapterName}
                    </h3>

                    <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                      Reflection
                    </p>
                    <p className="mt-2 text-base leading-8 text-[var(--text-strong)]">
                      {latestEntry.reflection}
                    </p>

                    <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                      Chosen action
                    </p>
                    <p className="mt-2 text-base leading-8 text-[var(--text-strong)]">
                      {latestEntry.actionStep}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-4 lg:min-w-[220px]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                      Saved
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-strong)]">
                      {formatSavedTime(latestEntry.createdAt)}
                    </p>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                      Rhythm
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-strong)]">
                      {latestEntry.rhythm}
                    </p>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                      Language
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-strong)]">
                      {latestEntry.language}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 text-[var(--text-muted)] shadow-sm">
                No reflection saved yet. Complete one journey and save your
                first entry.
              </div>
            )}
          </section>

          <section className="mt-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-[var(--heading-accent)]">
                  Chapter Preview
                </h2>
                <p className="mt-2 text-[var(--text-muted)]">
                  A first look at content flowing through the app.
                </p>
              </div>
            </div>

            {loading && <p className="text-[var(--text-muted)]">Loading chapters...</p>}

            {error && (
              <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
            )}

            {!loading && !error && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {visibleChapters.map((chapter) => (
                    <ChapterPreviewCard key={chapter.id} chapter={chapter} />
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {hasMoreChapters && (
                    <button
                      type="button"
                      onClick={handleShowMore}
                      className="rounded-full bg-[var(--button-primary-bg)] px-5 py-3 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90"
                    >
                      Show more chapters
                    </button>
                  )}

                  {visibleChapterCount > 6 && (
                    <button
                      type="button"
                      onClick={handleShowLess}
                      className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-raised)]"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </>
            )}
          </section>

          <section className="mt-12">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-[var(--heading-accent)]">
                Guided Pathways
              </h2>
              <p className="mt-2 text-[var(--text-muted)]">
                Structured journeys designed to keep the experience welcoming and
                non-overwhelming.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <PathwayCard
                title="Reconnect After Ramadan"
                description="A gentle path for users trying to carry their momentum into everyday life."
              />
              <PathwayCard
                title="Start Understanding"
                description="A beginner-friendly track for users who want more clarity in their own language."
              />
              <PathwayCard
                title="Mercy and Hope"
                description="A reflective pathway centered on comfort, healing, and returning with hope."
              />
            </div>
          </section>

          <section className="mt-12">
            <ReflectionCard />
          </section>

          <section className="mt-12">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-[var(--heading-accent)]">
                Progress Snapshot
              </h2>
              <p className="mt-2 text-[var(--text-muted)]">
                A simple view of consistency, saved notes, and pathway growth.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <ProgressCard
                label="Saved Entries"
                value={String(savedCount)}
                description="Private reflections and action steps saved over time."
              />
              <ProgressCard
                label="Pathways Used"
                value={String(uniquePathways)}
                description="Different guided pathways you have moved through."
              />
              <ProgressCard
                label="Latest Focus"
                value={latestEntry?.chapterName ?? "—"}
                description="Your most recently saved chapter from the journey."
              />
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}