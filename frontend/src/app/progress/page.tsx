"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";
import { getCurrentUser, getJourneyEntriesFromDb } from "@/lib/db";
import type { SavedJourneyEntry } from "@/types/app";

export default function ProgressPage() {
  const [entries, setEntries] = useState<SavedJourneyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadEntries() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

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
  }, [router]);

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
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(140,199,195,0.16), transparent 40%), radial-gradient(circle at top left, rgba(111,175,207,0.14), transparent 35%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Progress
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-4xl">
              Your journey so far
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              A calm view of your saved reflections, chosen action steps, and
              the pathways you’ve been moving through.
            </p>
          </div>

          {loading && (
            <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-8 shadow-sm">
              <p className="text-[var(--text-muted)]">Loading your saved progress...</p>
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
                  <h2 className="text-2xl font-semibold text-[var(--heading-accent)]">
                    Reflection History
                  </h2>
                  <p className="mt-2 text-[var(--text-muted)]">
                    Your recent saved entries, displayed in reverse chronological order.
                  </p>
                </div>

                {entries.length === 0 ? (
                  <div className="rounded-[2rem] border border-dashed border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 text-[var(--text-muted)] shadow-sm">
                    No saved history yet. Complete a journey and save your first
                    reflection to begin building your progress.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <article
                        key={entry.id}
                        className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.06)]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="max-w-3xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                                {entry.pathwayTitle}
                              </span>
                              <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                                {entry.chapterName}
                              </span>
                            </div>

                            <h3 className="mt-4 text-xl font-semibold tracking-tight text-[var(--heading-accent)]">
                              {entry.chapterName}
                            </h3>

                            <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                              Reflection
                            </p>
                            <p className="mt-2 text-base leading-8 text-[var(--text-strong)]">
                              {entry.reflection}
                            </p>

                            <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                              Chosen action
                            </p>
                            <p className="mt-2 text-base leading-8 text-[var(--text-strong)]">
                              {entry.actionStep}
                            </p>
                          </div>

                          <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-4 lg:min-w-[220px]">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                              Saved
                            </p>
                            <p className="mt-2 text-sm text-[var(--text-strong)]">
                              {formatSavedTime(entry.createdAt)}
                            </p>

                            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                              Rhythm
                            </p>
                            <p className="mt-2 text-sm text-[var(--text-strong)]">
                              {entry.rhythm}
                            </p>

                            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                              Language
                            </p>
                            <p className="mt-2 text-sm text-[var(--text-strong)]">
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

      <AppFooter />
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
    <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{description}</p>
    </div>
  );
}