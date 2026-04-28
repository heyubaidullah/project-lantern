export default function OnboardingProgress({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
          Progress
        </p>
        <p className="text-xs text-white/80">
          {currentStep} / {totalSteps}
        </p>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index + 1 <= currentStep;

          return (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full ${
                isActive ? "bg-white" : "bg-white/20"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}