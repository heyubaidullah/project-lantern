type OptionCardProps = {
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function OptionCard({
  title,
  description,
  selected = false,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-[1.5rem] border p-5 text-left transition duration-200 ${
        selected
          ? "border-[#6FAFCF] bg-[linear-gradient(180deg,#f7fcff_0%,#eef8fb_100%)] shadow-[0_12px_30px_rgba(111,175,207,0.12)]"
          : "border-[#E3EEF1] bg-white hover:border-[#CFE2E8] hover:bg-[#FBFEFF] hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-[#1E2D38]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#5A6B75]">{description}</p>
        </div>

        <div
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
            selected
              ? "border-[#6FAFCF] bg-[#6FAFCF]"
              : "border-[#C9DCE3] bg-white group-hover:border-[#6FAFCF]"
          }`}
        >
          {selected && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );
}