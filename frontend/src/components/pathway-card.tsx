import Link from "next/link";

export function PathwayCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-5 shadow-[0_18px_45px_rgba(30,45,56,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Guided pathway
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-[var(--text-strong)]">
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