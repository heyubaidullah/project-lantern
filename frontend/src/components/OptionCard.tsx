export default function OptionCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
        selected
          ? "border-[var(--brand-a)] bg-[var(--surface-soft)] shadow-sm"
          : "border-[var(--border-soft)] bg-[var(--surface-raised)] hover:bg-[var(--surface-soft)]"
      }`}
    >
      <h3 className="text-base font-semibold text-[var(--text-strong)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
        {description}
      </p>
    </button>
  );
}