"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AppFooter from "@/components/AppFooter";
import AyahSearchResultCard from "@/components/AyahSearchResultCard";
import Header from "@/components/Header";
import { searchAyahs } from "@/lib/ayah-search";
import { getCurrentUser, saveJourneyEntryToDb } from "@/lib/db";
import type { SavedJourneyEntry } from "@/types/app";
import type { AyahSearchResult } from "@/types/quran";

const examplePrompts = [
  "I feel anxious",
  "What does the Quran say about patience?",
  "I am struggling with salah",
  "What does the Quran say about parents?",
];

export default function AyahFinderPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState<AyahSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [savingVerseKey, setSavingVerseKey] = useState<string | null>(null);
  const [saveMessages, setSaveMessages] = useState<Record<string, string>>({});

  async function handleSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setError("Please enter a question, topic, or situation to search.");
      return;
    }

    setIsLoading(true);
    setError("");
    setHasSearched(true);
    setSubmittedQuery(trimmedQuery);
    setResults([]);

    try {
      const data = await searchAyahs(trimmedQuery);
      setResults(data.results ?? []);
    } catch {
      setError("We couldn’t find ayahs right now. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  }

  function applyExamplePrompt(prompt: string) {
    setQuery(prompt);
    setError("");
  }

  async function saveResultToJournal(result: AyahSearchResult) {
    const saveKey = result.verseKey || result.reference || crypto.randomUUID();
    setSavingVerseKey(saveKey);
    setSaveMessages((prev) => ({ ...prev, [saveKey]: "" }));

    try {
      const user = await getCurrentUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const entry: SavedJourneyEntry = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        pathway: "ayah-finder",
        pathwayTitle: "Find an Ayah",
        language: "English",
        rhythm: "Search",
        chapterId: result.chapterId ?? 0,
        chapterName: result.chapterName ?? "Quran",
        chapterArabicName: result.chapterName ?? "Quran",
        reflection: `Saved from Ayah Finder search: ${submittedQuery || query.trim()}`,
        actionStep: "",
        source: "ayah-finder",
        verseKey: result.verseKey,
        verseText: result.arabic,
        verseTranslation: result.translation,
        journalPrompt: submittedQuery || query.trim(),
        journalNote: null,
      };

      await saveJourneyEntryToDb(entry);
      setSaveMessages((prev) => ({ ...prev, [saveKey]: "Saved to your journal." }));
    } catch {
      setSaveMessages((prev) => ({
        ...prev,
        [saveKey]: "We couldn’t save this ayah right now. Please try again.",
      }));
    } finally {
      setSavingVerseKey(null);
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
          <section className="overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.08)] sm:p-8">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
                Quran-first search
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-5xl">
                Find an Ayah
              </h1>
              <p className="mt-4 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                Type a question, topic, or situation and explore relevant ayahs from the Quran.
              </p>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-4 text-sm leading-7 text-[var(--text-muted)]">
              Al-Huda shows relevant ayahs to support Quran-first exploration. For personal rulings or complex situations, please consult a qualified scholar.
            </div>

            <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 lg:flex-row">
              <label htmlFor="ayah-search" className="sr-only">
                Search for an ayah
              </label>
              <input
                id="ayah-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by question, topic, or situation..."
                className="min-h-14 flex-1 rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 text-base text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-a)] focus:ring-4 focus:ring-[rgba(111,175,207,0.10)]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full bg-[var(--button-primary-bg)] px-7 py-4 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Searching..." : "Find ayahs"}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => applyExamplePrompt(prompt)}
                  className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-raised)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--heading-accent)]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8 space-y-4" aria-live="polite">
            {isLoading && (
              <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 text-sm text-[var(--text-muted)]">
                Searching for relevant ayahs...
              </div>
            )}

            {error && (
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
                {error}
              </div>
            )}

            {!isLoading && !error && hasSearched && results.length === 0 && (
              <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 text-sm text-[var(--text-muted)]">
                No ayahs were found for “{submittedQuery}.” Try a shorter topic or a different phrase.
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                    Results
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--heading-accent)]">
                    Relevant ayahs for “{submittedQuery}”
                  </h2>
                </div>

                {results.map((result) => {
                  const saveKey = result.verseKey || result.reference;

                  return (
                    <AyahSearchResultCard
                      key={saveKey}
                      result={result}
                      isSaving={savingVerseKey === saveKey}
                      saveMessage={saveMessages[saveKey]}
                      onSave={saveResultToJournal}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
