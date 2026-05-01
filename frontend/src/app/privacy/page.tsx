import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Header />

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-8">
          <div className="pointer-events-none absolute right-4 top-2 text-[110px] leading-none text-[var(--accent-gold-soft)]">
            ۝
          </div>

          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
              Privacy
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-4xl">
              Privacy Notice
            </h1>
            <div className="mt-5 space-y-4 text-sm leading-8 text-[var(--text-muted)]">
              <p>
                Al-Huda stores a limited set of account-linked information to
                support the core user experience. This currently includes basic
                profile details, onboarding preferences, saved reflections,
                journey progress, and streak-related activity.
              </p>
              <p>
                The information stored is used to personalize the experience,
                restore progress across sessions, and help users return to their
                selected pathway without needing to start over.
              </p>
              <p>
                Authentication is handled through Supabase Auth. Users may sign
                in using supported providers such as Google or email-based magic
                links. Account-related data is associated with the signed-in
                user and access is restricted through database policies.
              </p>
              <p>
                Al-Huda is still evolving. Before any wider public launch, we
                will review this page and refine it into a final legal/privacy
                document appropriate for the intended audience and jurisdiction.
              </p>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}