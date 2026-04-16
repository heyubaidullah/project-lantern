import { ReactNode } from "react";

type StepShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function StepShell({
  eyebrow,
  title,
  description,
  children,
}: StepShellProps) {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5A6B75]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1E2D38] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5A6B75] sm:text-base">
        {description}
      </p>

      <div className="mt-8">{children}</div>
    </section>
  );
}