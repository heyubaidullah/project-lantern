"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { getJourneyEntriesFromDb } from "@/lib/db";
import type { SavedJourneyEntry } from "@/types/app";

export default function ProgressPage() {
  const [entries, setEntries] = useState<SavedJourneyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEntries() {
      try {
        const data = await getJourneyEntriesFromDb();
        setEntries(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load progress history."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEntries();
  }, []);

  const totalEntries = entries.length;
  const totalPathways = useMemo(
    () => new Set(entries.map((entry) => entry.pathwayTitle)).size,
    [entries]
  );
  const latestEntry = entries[0];

  function formatSavedTime(isoDate: string) {
    const date = new Date(isoDate);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#edf7fa_0%,#f7fbfc_45%,#f7fbfc_100%)]">
      <Header />

      <main className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(circle_at_top_right,rgba(140,199,195,0.16),transparent_40%),radial-gradient(circle_at_top_left,rgba(111,175,207,0.14),transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5A6B75]">
              Progress
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1E2D38] sm:text-4xl">
              Your journey so far
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5A6B75] sm:text-base">
              A calm view of your saved reflections, chosen action steps, and
              the pathways you’ve been moving through.
            </p>
          </div>

          {loading && (
            <div className="rounded-[2rem] border border-[#d8e7ec] bg-white p-8 shadow-sm">
              <p className="text-[#5A6B75]">Loading your saved progress...</p>
            </div>
          )}

          {error && (
            <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                <StatCard
                  label="Saved Entries"
                  value={String(totalEntries)}
                  description="Reflections and action steps saved over time."
                />
                <StatCard
                  label="Pathways Used"
                  value={String(totalPathways)}
                  description="Different guided tracks you have moved through."
                />
                <StatCard
                  label="Latest Save"
                  value={latestEntry ? formatSavedTime(latestEntry.createdAt) : "—"}
                  description="The most recent point at which you saved a journey."
                />
              </section>

              <section className="mt-10">
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold text-[#1E2D38]">
                    Reflection History
                  </h2>
                  <p className="mt-2 text-[#5A6B75]">
                    Your recent saved entries, displayed in reverse chronological order.
                  </p>
                </div>

                {entries.length === 0 ? (
                  <div className="rounded-[2rem] border border-dashed border-[#D6E8EF] bg-white p-6 text-[#5A6B75] shadow-sm">
                    No saved history yet. Complete a journey and save your first
                    reflection to begin building your progress.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <article
                        key={entry.id}
                        className="rounded-[2rem] border border-[#d8e7ec] bg-white p-6 shadow-[0_20px_60px_rgba(30,45,56,0.06)]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="max-w-3xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[#EEF6F8] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#5A6B75]">
                                {entry.pathwayTitle}
                              </span>
                              <span className="rounded-full bg-[#EEF6F8] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#5A6B75]">
                                {entry.chapterName}
                              </span>
                            </div>

                            <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1E2D38]">
                              {entry.chapterName}
                            </h3>

                            <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-[#5A6B75]">
                              Reflection
                            </p>
                            <p className="mt-2 text-base leading-8 text-[#1E2D38]">
                              {entry.reflection}
                            </p>

                            <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-[#5A6B75]">
                              Chosen action
                            </p>
                            <p className="mt-2 text-base leading-8 text-[#1E2D38]">
                              {entry.actionStep}
                            </p>
                          </div>

                          <div className="rounded-[1.5rem] border border-[#E3EEF1] bg-[#FBFEFF] px-5 py-4 lg:min-w-[220px]">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5A6B75]">
                              Saved
                            </p>
                            <p className="mt-2 text-sm text-[#1E2D38]">
                              {formatSavedTime(entry.createdAt)}
                            </p>

                            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A6B75]">
                              Rhythm
                            </p>
                            <p className="mt-2 text-sm text-[#1E2D38]">
                              {entry.rhythm}
                            </p>

                            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5A6B75]">
                              Language
                            </p>
                            <p className="mt-2 text-sm text-[#1E2D38]">
                              {entry.language}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#d8e7ec] bg-white p-6 shadow-[0_20px_60px_rgba(30,45,56,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5A6B75]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#1E2D38]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[#5A6B75]">{description}</p>
    </div>
  );
}