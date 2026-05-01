import Link from "next/link";

export function PathwayCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-5 shadow-[0_18px_45px_rgba(30,45,56,0.05)] transition hover:-translate-y-1 hover:border-[var(--brand-a)] hover:shadow-[0_24px_60px_rgba(30,45,56,0.08)]">
      <div className="pointer-events-none absolute bottom-[-18px] right-[-8px] text-6xl leading-none text-[var(--accent-gold-soft)]">
        ۝
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-2xl shadow-sm">
          {icon}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
          Guided pathway
        </p>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-[var(--heading-accent)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
        {description}
      </p>

      <Link
        href="/onboarding"
        className="mt-5 inline-flex rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-raised)]"
      >
        Explore
      </Link>
    </article>
  );
}