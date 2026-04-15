type ProgressCardProps = {
  label: string;
  value: string;
  description: string;
};

export function ProgressCard({
  label,
  value,
  description,
}: ProgressCardProps) {
  return (
    <article className="rounded-2xl border border-[#E3EEF1] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#5A6B75]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[#1E2D38]">{value}</p>
      <p className="mt-2 text-[#5A6B75]">{description}</p>
    </article>
  );
}