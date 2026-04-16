type OnboardingProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export default function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Progress
        </p>
        <p className="text-sm text-white/80">
          {currentStep} / {totalSteps}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;

          return (
            <div
              key={stepNumber}
              className={`h-2 rounded-full transition ${
                isActive ? "bg-white" : "bg-white/20"
              }`}
            />
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-4 gap-3">
        {["Intent", "Language", "Rhythm", "Pathway"].map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;

          return (
            <div key={label} className="text-center">
              <div
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  isActive
                    ? "border-white bg-white text-[#1E2D38]"
                    : "border-white/30 bg-white/10 text-white/70"
                }`}
              >
                {stepNumber}
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/75">
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}