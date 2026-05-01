"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";
import {
  getCurrentUser,
  getJourneyEntriesFromDb,
  getProfile,
  getUserStreak,
} from "@/lib/db";
import type { SavedJourneyEntry, UserProfile, UserStreak } from "@/types/app";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [entries, setEntries] = useState<SavedJourneyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfilePage() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const [profileData, streakData, entryData] = await Promise.all([
          getProfile(),
          getUserStreak(),
          getJourneyEntriesFromDb(),
        ]);

        setProfile(profileData);
        setStreak(streakData);
        setEntries(entryData);
      } catch (error) {
        console.error("Failed to load profile page", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfilePage();
  }, [router]);

  const firstName = profile?.first_name ?? "User";
  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ");
  const latestEntry = entries[0];
  const totalEntries = entries.length;

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-8">
          <div className="pointer-events-none absolute right-4 top-2 text-[110px] leading-none text-[var(--accent-gold-soft)]">
            ۝
          </div>

          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
              Profile
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-4xl">
              {loading ? "Loading profile..." : `As-salaamu 'alaykum, ${firstName}`}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              A simple view of your account, your consistency, and your recent
              journey activity.
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.05)] transition hover:-translate-y-1 hover:border-[var(--brand-a)] hover:shadow-[0_24px_70px_rgba(30,45,56,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                Account
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-gold)] text-lg font-semibold text-white">
                  {(firstName.charAt(0) || "U").toUpperCase()}
                </div>

                <div>
                  <p className="text-xl font-semibold text-[var(--heading-accent)]">
                    {fullName || firstName}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {profile?.email ?? "No email available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-5 shadow-[0_18px_45px_rgba(30,45,56,0.05)] transition hover:-translate-y-1 hover:border-[var(--brand-a)] hover:shadow-[0_24px_60px_rgba(30,45,56,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                  Current streak
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--heading-accent)]">
                  {streak?.current_streak ?? 0}
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Your active rhythm of return.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-5 shadow-[0_18px_45px_rgba(30,45,56,0.05)] transition hover:-translate-y-1 hover:border-[var(--brand-a)] hover:shadow-[0_24px_60px_rgba(30,45,56,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                  Longest streak
                </p>
                <p className="mt-3 text-3xl font-semibold text-[var(--heading-accent)]">
                  {streak?.longest_streak ?? 0}
                </p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Your strongest consistency so far.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.05)] transition hover:-translate-y-1 hover:border-[var(--brand-a)] hover:shadow-[0_24px_70px_rgba(30,45,56,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                Journey summary
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <SummaryCard
                  label="Saved entries"
                  value={String(totalEntries)}
                  description="Private reflections saved over time."
                />
                <SummaryCard
                  label="Latest focus"
                  value={latestEntry?.chapterName ?? "—"}
                  description="Your most recent saved chapter."
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.05)] transition hover:-translate-y-1 hover:border-[var(--brand-a)] hover:shadow-[0_24px_70px_rgba(30,45,56,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                Recent reflection
              </p>

              {latestEntry ? (
                <>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--heading-accent)]">
                    {latestEntry.chapterName}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                    {latestEntry.reflection}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--heading-accent-soft)]">
                      {latestEntry.pathwayTitle}
                    </span>
                    <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--heading-accent-soft)]">
                      {latestEntry.language}
                    </span>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                  Your saved reflections will appear here as your journey grows.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.25rem] bg-[var(--surface-soft)] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--heading-accent-soft)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[var(--heading-accent)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
        {description}
      </p>
    </div>
  );
}