"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppFooter from "@/components/AppFooter";
import Header from "@/components/Header";
import {
  getCurrentUser,
  getJournalEntriesFromDb,
  getJourneyEntriesFromDb,
  saveJournalEntryToDb,
} from "@/lib/db";
import type { JournalEntry, SavedJourneyEntry } from "@/types/app";

export default function JournalPage() {
  const router = useRouter();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [journeyEntries, setJourneyEntries] = useState<SavedJourneyEntry[]>([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadJournal = useCallback(async function loadJournal() {
    try {
      const user = await getCurrentUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const [standaloneEntries, savedJourneyEntries] = await Promise.all([
        getJournalEntriesFromDb(),
        getJourneyEntriesFromDb(),
      ]);

      setJournalEntries(standaloneEntries);
      setJourneyEntries(savedJourneyEntries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your journal.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadJournal();
  }, [loadJournal]);

  const allEntries = useMemo(() => {
    const standalone = journalEntries.map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt,
      title: entry.title,
      body: entry.note,
      meta: entry.mood || "Journal note",
      prompt: entry.prompt,
      action: null as string | null,
      source: "journal",
    }));

    const savedReflections = journeyEntries.map((entry) => ({
      id: entry.id,
      createdAt: entry.createdAt,
      title:
        entry.source === "feeling" && entry.lifeStateLabel
          ? `Feeling ${entry.lifeStateLabel}`
          : entry.pathwayTitle,
      body: entry.journalNote || entry.reflection,
      meta: entry.verseKey
        ? `${entry.chapterName} • ${entry.verseKey}`
        : entry.chapterName,
      prompt: entry.journalPrompt,
      action: entry.actionStep,
      source: entry.source ?? "journey",
    }));

    return [...standalone, ...savedReflections].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [journalEntries, journeyEntries]);

  function formatSavedTime(isoDate: string) {
    const date = new Date(isoDate);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  async function saveJournalNote() {
    if (!note.trim()) {
      setMessage("Please write a note before saving.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: title.trim() || "Journal note",
      note: note.trim(),
      mood: mood.trim() || null,
      prompt: "What do you want to remember from this moment?",
    };

    try {
      await saveJournalEntryToDb(entry);
      setJournalEntries((prev) => [entry, ...prev]);
      setTitle("");
      setNote("");
      setMood("");
      setMessage("Journal note saved.");
    } catch {
      setMessage("We couldn’t save your note right now. Please try again.");
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
          className="pointer-events-none absolute inset-x-0 top-0 h-[340px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(140,199,195,0.16), transparent 40%), radial-gradient(circle at top left, rgba(111,175,207,0.14), transparent 35%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
                Journal
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-5xl">
                Keep a gentle record of what Allah is teaching you.
              </h1>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                Save standalone notes here, and revisit reflections saved from
                Today’s Journey or I’m Feeling.
              </p>
            </div>

            <Link
              href="/feeling"
              className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-raised)] px-6 py-3 text-center text-sm font-medium text-[var(--heading-accent)] transition hover:bg-[var(--surface-soft)]"
            >
              Find an ayah by feeling
            </Link>
          </div>

          {loading && (
            <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-8 shadow-sm">
              <p className="text-[var(--text-muted)]">Loading your journal...</p>
            </div>
          )}

          {error && (
            <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--heading-accent-soft)]">
                  New note
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--heading-accent)]">
                  What do you want to remember?
                </h2>

                <label className="mt-6 block text-sm font-medium text-[var(--text-strong)]">
                  Title
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="A short title"
                    className="mt-2 w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-a)] focus:ring-4 focus:ring-[rgba(111,175,207,0.10)]"
                  />
                </label>

                <label className="mt-4 block text-sm font-medium text-[var(--text-strong)]">
                  Mood or tag
                  <input
                    value={mood}
                    onChange={(event) => setMood(event.target.value)}
                    placeholder="Calm, hopeful, unsure..."
                    className="mt-2 w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-a)] focus:ring-4 focus:ring-[rgba(111,175,207,0.10)]"
                  />
                </label>

                <label className="mt-4 block text-sm font-medium text-[var(--text-strong)]">
                  Note
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Write privately and simply..."
                    className="mt-2 min-h-[190px] w-full rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-a)] focus:ring-4 focus:ring-[rgba(111,175,207,0.10)]"
                  />
                </label>

                <button
                  type="button"
                  onClick={saveJournalNote}
                  disabled={isSaving}
                  className="mt-5 rounded-full bg-[var(--button-primary-bg)] px-6 py-3 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Saving..." : "Save journal note"}
                </button>

                {message && (
                  <div
                    className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                      message.toLowerCase().includes("saved")
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-5">
                  <h2 className="text-2xl font-semibold text-[var(--heading-accent)]">
                    Journal history
                  </h2>
                  <p className="mt-2 text-[var(--text-muted)]">
                    Standalone notes and saved reflections in one place.
                  </p>
                </div>

                {allEntries.length === 0 ? (
                  <div className="rounded-[2rem] border border-dashed border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 text-[var(--text-muted)] shadow-sm">
                    No journal entries yet. Save a note here or add one from the
                    I’m Feeling page.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allEntries.map((entry) => (
                      <article
                        key={`${entry.source}-${entry.id}`}
                        className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.06)]"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                            {entry.source}
                          </span>
                          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
                            {entry.meta}
                          </span>
                        </div>

                        <h3 className="mt-4 text-xl font-semibold tracking-tight text-[var(--heading-accent)]">
                          {entry.title}
                        </h3>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                          {formatSavedTime(entry.createdAt)}
                        </p>

                        {entry.prompt && (
                          <p className="mt-4 rounded-2xl bg-[var(--surface-soft)] px-4 py-3 text-sm leading-7 text-[var(--text-muted)]">
                            {entry.prompt}
                          </p>
                        )}

                        <p className="mt-4 whitespace-pre-line text-base leading-8 text-[var(--text-strong)]">
                          {entry.body}
                        </p>

                        {entry.action && (
                          <p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">
                            <span className="font-semibold text-[var(--heading-accent)]">
                              Small step:
                            </span>{" "}
                            {entry.action}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
