type PathwayCardProps = {
  title: string;
  description: string;
};

export function PathwayCard({ title, description }: PathwayCardProps) {
  return (
    <article className="rounded-2xl border border-[#E3EEF1] bg-white p-5 shadow-sm">
      <div className="inline-flex rounded-full bg-[#EEF6F8] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[#5A6B75]">
        Pathway
      </div>

      <h3 className="mt-4 text-xl font-semibold text-[#1E2D38]">{title}</h3>

      <p className="mt-2 leading-7 text-[#5A6B75]">{description}</p>
    </article>
  );
}