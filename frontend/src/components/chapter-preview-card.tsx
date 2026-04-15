import type { Chapter } from "@/types/quran";

type ChapterPreviewCardProps = {
  chapter: Chapter;
};

export function ChapterPreviewCard({ chapter }: ChapterPreviewCardProps) {
  return (
    <article className="rounded-2xl border border-[#E3EEF1] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#5A6B75]">Surah {chapter.id}</p>
          <h3 className="mt-1 text-xl font-semibold text-[#1E2D38]">
            {chapter.name_simple}
          </h3>
          <p className="mt-1 text-[#5A6B75]">{chapter.translated_name.name}</p>
          <p className="mt-3 text-sm text-[#5A6B75]">
            {chapter.verses_count} verses
          </p>
        </div>

        <p className="text-2xl text-[#1E2D38]">{chapter.name_arabic}</p>
      </div>
    </article>
  );
}