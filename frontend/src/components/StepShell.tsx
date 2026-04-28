export default function StepShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
        {description}
      </p>

      <div className="mt-8">{children}</div>
    </section>
  );
}