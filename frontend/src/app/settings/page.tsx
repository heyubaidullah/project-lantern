"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";
import { getCurrentUser, getOnboardingProfile, getProfile } from "@/lib/db";
import type { OnboardingData, UserProfile } from "@/types/app";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);

  useEffect(() => {
    async function loadSettingsPage() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const [profileData, onboardingData] = await Promise.all([
          getProfile(),
          getOnboardingProfile(),
        ]);

        setProfile(profileData);
        setOnboarding(onboardingData);
      } catch (error) {
        console.error("Failed to load settings page", error);
      }
    }

    loadSettingsPage();
  }, [router]);

  const firstName = profile?.first_name ?? "User";

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Header />

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-8">
          <div className="pointer-events-none absolute right-4 top-2 text-[110px] leading-none text-[var(--accent-gold-soft)]">
            ۝
          </div>

          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
              Settings
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-4xl">
              Settings for {firstName}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              A simple view of the preferences shaping your current experience.
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6">
          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.05)] transition hover:-translate-y-1 hover:border-[var(--brand-a)] hover:shadow-[0_24px_70px_rgba(30,45,56,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
              Current experience
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <SettingCard
                label="Language"
                value={onboarding?.language ?? "Not set"}
              />
              <SettingCard
                label="Rhythm"
                value={onboarding?.rhythm ? `${onboarding.rhythm} minutes` : "Not set"}
              />
              <SettingCard
                label="Pathway"
                value={onboarding?.pathway ?? "Not set"}
              />
              <SettingCard
                label="Theme"
                value="Managed from the header toggle"
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.05)] transition hover:-translate-y-1 hover:border-[var(--brand-a)] hover:shadow-[0_24px_70px_rgba(30,45,56,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
              Looking ahead
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FutureCard
                title="Reminder preferences"
                description="Choose when and how you want gentle reminders."
              />
              <FutureCard
                title="Journey adjustments"
                description="Refine your rhythm, pathway, and reflection style over time."
              />
              <FutureCard
                title="Account preferences"
                description="Manage profile details and sign-in experience."
              />
              <FutureCard
                title="Circles and companions"
                description="Shared motivation and group-based consistency features."
              />
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

function SettingCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] bg-[var(--surface-soft)] px-4 py-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--heading-accent-soft)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--text-strong)]">
        {value}
      </p>
    </div>
  );
}

function FutureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4">
      <p className="text-sm font-semibold text-[var(--heading-accent)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
        {description}
      </p>
    </div>
  );
}