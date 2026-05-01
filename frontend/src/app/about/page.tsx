import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";

export default function AboutPage() {
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
              About
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-4xl">
              What Al-Huda is trying to do
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              Al-Huda is designed to make daily Quran engagement feel calm,
              welcoming, practical, and sustainable — especially for people who
              may feel overwhelmed by highly dense or formal religious tools.
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-6">
          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
              Product direction
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <AboutCard
                title="Welcoming"
                description="The experience should feel accessible whether someone is consistent, returning after a gap, or beginning gently."
              />
              <AboutCard
                title="Non-overwhelming"
                description="The goal is one meaningful step at a time, not making the user feel behind or unqualified."
              />
              <AboutCard
                title="Reflective"
                description="Reading is paired with understanding, private reflection, and a practical action step."
              />
              <AboutCard
                title="Personal"
                description="The app remembers the user’s journey, rhythm, pathway, and progress over time."
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
              Current experience
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <AboutCard
                title="Guided onboarding"
                description="Users choose language, rhythm, and a pathway that fits where they are."
              />
              <AboutCard
                title="Daily journey"
                description="Each day presents one selected passage, an explanation, a reflection prompt, and an action step."
              />
              <AboutCard
                title="Saved progress"
                description="Reflections and action steps are tied to the signed-in user and visible over time."
              />
              <AboutCard
                title="Streaks and continuity"
                description="The product encourages return through gentle consistency, not pressure."
              />
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

function AboutCard({
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