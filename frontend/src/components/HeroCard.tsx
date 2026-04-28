import Link from "next/link";

export default function HeroCard() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] shadow-[0_30px_80px_rgba(30,45,56,0.08)]">
      <div className="pointer-events-none absolute right-[-18px] top-[-22px] text-[140px] leading-none text-[var(--accent-gold-soft)]">
        ۝
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
            One Ayah Forward
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--accent-gold)] sm:text-5xl">
            A calm daily journey with Al-Huda.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--text-muted)] sm:text-base">
            Read one meaningful passage, understand it with clarity, reflect on
            it privately, and carry one small action step into real life.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="rounded-full bg-[var(--accent-gold)] px-5 py-3 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90"
            >
              Discover Al-Huda
            </Link>
            <Link
              href="/progress"
              className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-raised)]"
            >
              View progress
            </Link>
          </div>
        </div>

        <div
          className="flex flex-col justify-center gap-4 border-t px-6 py-8 sm:px-8 lg:border-l lg:border-t-0"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <div className="rounded-[1.5rem] bg-[var(--surface-soft)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-a)]">
              Daily rhythm
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--accent-gold)]">
              Small, welcoming, consistent
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              Designed to help users return every day without feeling
              overwhelmed.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-[var(--surface-soft)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-a)]">
              Experience
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--accent-gold)]">
              Read, reflect, act
            </p>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              A guided path that turns one passage into one real-life step.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}