"use client";

import { useEffect, useState } from "react";
import { HomeHeader } from "@/components/home-header";
import { TodayJourneyCard } from "@/components/today-journey-card";
import { ChapterPreviewCard } from "@/components/chapter-preview-card";
import type { Chapter, ChaptersResponse } from "@/types/quran";

export default function HomePage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    fetchChapters();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7FBFC] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <HomeHeader />

        <TodayJourneyCard />

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-[#1E2D38]">
              Quran Preview
            </h2>
            <p className="mt-2 text-[#5A6B75]">
              A first look at Quran content flowing through the app.
            </p>
          </div>

          {loading && <p className="text-[#5A6B75]">Loading chapters...</p>}

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
          )}

          {!loading && !error && (
            <div className="grid gap-4 md:grid-cols-2">
              {chapters.map((chapter) => (
                <ChapterPreviewCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}