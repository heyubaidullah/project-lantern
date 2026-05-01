import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-8 shadow-[0_24px_70px_rgba(30,45,56,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
            Privacy
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)]">
            Privacy Notice
          </h1>
          <p className="mt-5 text-sm leading-8 text-[var(--text-muted)]">
            This product currently stores account-linked onboarding choices,
            reflections, progress, and streak information to support the user
            experience. This page is a placeholder and should be updated before
            public launch with the final privacy policy.
          </p>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}