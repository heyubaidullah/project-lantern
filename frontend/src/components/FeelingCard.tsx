import type { LifeStateConfig } from "@/lib/life-state-config";

type FeelingCardProps = {
  option: LifeStateConfig;
  selected: boolean;
  onSelect: (key: LifeStateConfig["key"]) => void;
};

export default function FeelingCard({ option, selected, onSelect }: FeelingCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.key)}
      className={`group rounded-[1.75rem] border p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(30,45,56,0.08)] ${
        selected
          ? "border-[var(--brand-a)] bg-[var(--surface-raised)] ring-4 ring-[rgba(111,175,207,0.14)]"
          : "border-[var(--border-soft)] bg-[var(--surface-raised)] hover:border-[var(--brand-a)]"
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-2xl">
          {option.emoji}
        </div>
        <span
          className={`mt-1 h-4 w-4 rounded-full border ${
            selected
              ? "border-[var(--brand-a)] bg-[var(--brand-a)]"
              : "border-[var(--border-soft)] bg-[var(--surface-raised)] group-hover:border-[var(--brand-a)]"
          }`}
          aria-hidden="true"
        />
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-tight text-[var(--heading-accent)]">
        {option.label}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
        {option.shortDescription}
      </p>
    </button>
  );
}
