import Link from "next/link";

export function ReflectionCard() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_20px_60px_rgba(30,45,56,0.06)] transition hover:shadow-[0_26px_75px_rgba(30,45,56,0.08)] sm:p-8">
      <div className="pointer-events-none absolute right-[-14px] top-[-18px] text-8xl leading-none text-[var(--accent-gold-soft)]">
        ۝
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
        Keep it light
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--heading-accent)]">
        One sincere return matters more than doing a lot once.
      </h2>
      <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--text-muted)]">
        Al-Huda is designed to be gentle, consistent, and practical. The goal
        is not volume. The goal is to return, understand a little more, and let
        one small action shape the day.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/journey"
          className="rounded-full bg-[var(--button-primary-bg)] px-5 py-3 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90"
        >
          Continue today
        </Link>
        <Link
          href="/progress"
          className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-3 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-raised)]"
        >
          View your progress
        </Link>
      </div>
    </section>
  );
}