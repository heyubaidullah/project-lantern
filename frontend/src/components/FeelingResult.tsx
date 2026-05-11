import Link from "next/link";
import type { LifeStateConfig } from "@/lib/life-state-config";

type FeelingResultProps = {
  option: LifeStateConfig;
  reflection: string;
  isSaving: boolean;
  saveMessage: string;
  onReflectionChange: (value: string) => void;
  onSave: () => void;
};

export default function FeelingResult({
  option,
  reflection,
  isSaving,
  saveMessage,
  onReflectionChange,
  onSave,
}: FeelingResultProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.08)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--heading-accent-soft)]">
            A steady ayah for feeling {option.label.toLowerCase()}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)]">
            {option.surahName} • {option.verseKey}
          </h2>
          <p className="mt-6 text-3xl leading-relaxed text-[var(--text-strong)] sm:text-4xl">
            {option.arabic}
          </p>
          <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">
            “{option.translation}”
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-5 lg:min-w-[280px]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
            Small step
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--text-strong)]">
            {option.actionStep}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
            Reflect
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--heading-accent)]">
            {option.reflectionPrompt}
          </h3>
          <textarea
            value={reflection}
            onChange={(event) => onReflectionChange(event.target.value)}
            placeholder="Write a private note for yourself..."
            className="mt-5 min-h-[160px] w-full rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] px-5 py-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-a)] focus:ring-4 focus:ring-[rgba(111,175,207,0.10)]"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="rounded-full bg-[var(--button-primary-bg)] px-6 py-3 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save to journal"}
            </button>
            <Link
              href="/journal"
              className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-raised)] px-6 py-3 text-center text-sm font-medium text-[var(--heading-accent)] transition hover:bg-[var(--surface-soft)]"
            >
              Open journal
            </Link>
          </div>
          {saveMessage && (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                saveMessage.toLowerCase().includes("saved")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {saveMessage}
            </div>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-[var(--border-soft)] bg-[var(--surface-soft)] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
            Journal prompt
          </p>
          <p className="mt-3 text-base leading-8 text-[var(--text-strong)]">
            {option.journalPrompt}
          </p>
        </div>
      </div>
    </section>
  );
}
