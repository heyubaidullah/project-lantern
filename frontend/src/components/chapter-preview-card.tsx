import type { Chapter } from "@/types/quran";

export function ChapterPreviewCard({ chapter }: { chapter: Chapter }) {
  const revelationPlace =
    "revelation_place" in chapter && typeof chapter.revelation_place === "string"
      ? chapter.revelation_place
      : null;

  return (
    <a
      href={`https://quran.com/${chapter.id}`}
      target="_blank"
      rel="noreferrer"
      className="block rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-5 shadow-[0_18px_45px_rgba(30,45,56,0.05)] transition hover:-translate-y-0.5 hover:border-[var(--brand-a)] hover:shadow-[0_24px_60px_rgba(30,45,56,0.08)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Chapter {chapter.id}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--heading-accent)]">
            {chapter.name_simple}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {chapter.translated_name.name}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-semibold text-[var(--text-strong)]">
            {chapter.name_arabic}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[1rem] bg-[var(--surface-soft)] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Verses
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--text-strong)]">
            {chapter.verses_count}
          </p>
        </div>

        <div className="rounded-[1rem] bg-[var(--surface-soft)] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Place
          </p>
          <p className="mt-1 text-sm font-medium capitalize text-[var(--text-strong)]">
            {revelationPlace ?? "—"}
          </p>
        </div>
      </div>
    </a>
  );
}