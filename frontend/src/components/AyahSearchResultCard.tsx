import type { AyahSearchResult } from "@/types/quran";

type AyahSearchResultCardProps = {
  result: AyahSearchResult;
  isSaving: boolean;
  saveMessage?: string;
  onSave: (result: AyahSearchResult) => void;
};

export default function AyahSearchResultCard({
  result,
  isSaving,
  saveMessage,
  onSave,
}: AyahSearchResultCardProps) {
  const reference = result.reference || result.verseKey || "Ayah result";

  return (
    <article className="rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--heading-accent-soft)]">
            {result.chapterName || "Quran"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--heading-accent)]">
            {reference}
          </h2>
        </div>

        {result.quranComUrl && (
          <a
            href={result.quranComUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-2 text-center text-sm font-medium text-[var(--heading-accent)] transition hover:bg-[var(--surface-raised)]"
          >
            Open on Quran.com
          </a>
        )}
      </div>

      {result.arabic ? (
        <p className="mt-6 text-right text-3xl leading-relaxed text-[var(--text-strong)] sm:text-4xl">
          {result.arabic}
        </p>
      ) : (
        <p className="mt-6 rounded-2xl bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text-muted)]">
          Arabic text is unavailable for this result right now.
        </p>
      )}

      {result.translation ? (
        <p className="mt-5 text-base leading-8 text-[var(--text-muted)] sm:text-lg">
          “{result.translation}”
        </p>
      ) : (
        <p className="mt-5 text-sm text-[var(--text-muted)]">
          Translation is unavailable for this result right now.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => onSave(result)}
          disabled={isSaving}
          className="rounded-full bg-[var(--button-primary-bg)] px-5 py-3 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save to Journal"}
        </button>

        {saveMessage && (
          <p className="text-sm text-[var(--text-muted)]" role="status">
            {saveMessage}
          </p>
        )}
      </div>
    </article>
  );
}
