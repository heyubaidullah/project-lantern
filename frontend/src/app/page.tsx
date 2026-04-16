"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import HeroCard from "@/components/HeroCard";
import { ChapterPreviewCard } from "@/components/chapter-preview-card";
import { PathwayCard } from "@/components/pathway-card";
import { ReflectionCard } from "@/components/reflection-card";
import { ProgressCard } from "@/components/progress-card";
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#edf7fa_0%,#f7fbfc_45%,#f7fbfc_100%)]">
      <Header />

      <main className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_right,rgba(140,199,195,0.18),transparent_40%),radial-gradient(circle_at_top_left,rgba(111,175,207,0.14),transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 sm:py-10">
          <HeroCard />

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

          <section className="mt-12">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-[#1E2D38]">
                Guided Pathways
              </h2>
              <p className="mt-2 text-[#5A6B75]">
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
              <h2 className="text-2xl font-semibold text-[#1E2D38]">
                Progress Snapshot
              </h2>
              <p className="mt-2 text-[#5A6B75]">
                A simple view of consistency, notes, and pathway growth.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <ProgressCard
                label="Consistency"
                value="5 days"
                description="A gentle measure of returning to the journey regularly."
              />
              <ProgressCard
                label="Reflections"
                value="12 notes"
                description="Private thoughts and action steps saved over time."
              />
              <ProgressCard
                label="Pathway"
                value="2 of 7"
                description="Visible progress through a guided learning journey."
              />
            </div>
          </section>

          <footer className="mt-14 border-t border-[#E3EEF1] pt-6">
            <p className="max-w-3xl text-sm leading-6 text-[#5A6B75]">
              Built to make daily engagement feel calm, welcoming, and practical
              — one small step at a time.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}