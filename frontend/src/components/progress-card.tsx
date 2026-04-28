export function ProgressCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-5 shadow-[0_18px_45px_rgba(30,45,56,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
        {description}
      </p>
    </article>
  );
}