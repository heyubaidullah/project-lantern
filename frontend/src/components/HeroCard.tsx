const steps = [
  {
    title: "Read",
    description: "A short passage that feels approachable, even on a busy day.",
  },
  {
    title: "Understand",
    description: "Clear meaning in your language, without overwhelm.",
  },
  {
    title: "Reflect",
    description: "A private pause to notice what the ayah stirs within you.",
  },
  {
    title: "Act",
    description: "One small step you can carry into the rest of your day.",
  },
];

export default function HeroCard() {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-8 pb-6 sm:pt-12">
      <div className="overflow-hidden rounded-[2rem] border border-[#d8e7ec] bg-white/90 shadow-[0_30px_80px_rgba(30,45,56,0.08)] backdrop-blur-sm">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden border-b border-[#d8e7ec] bg-[linear-gradient(135deg,#6FAFCF_0%,#7dbdca_42%,#8CC7C3_100%)] px-6 py-8 sm:px-10 sm:py-12 lg:border-b-0 lg:border-r">
            <div className="absolute right-[-30px] top-[-20px] h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-40px] left-[-20px] h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10 max-w-xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
                Today’s Journey
              </p>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                Come back gently.
                <br />
                Start with one ayah.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/85 sm:text-base">
                Al-Huda is designed to make daily Quran engagement feel calm,
                welcoming, and doable — especially after Ramadan, during busy
                weeks, or at the beginning of a new journey.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1E2D38] transition hover:translate-y-[-1px] hover:shadow-md">
                  Start today’s journey
                </button>
                <button className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/15">
                  Explore pathways
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white/85">
                  Post-Ramadan consistency
                </span>
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white/85">
                  Non-Arabic speakers
                </span>
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs text-white/85">
                  Reverts & returning learners
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#fcfeff] px-6 py-8 sm:px-8 sm:py-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5A6B75]">
                  How it works
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#1E2D38]">
                  A daily rhythm
                </h3>
              </div>

              <div className="hidden rounded-full bg-[#EEF6F8] px-3 py-1 text-xs font-medium text-[#5A6B75] sm:block">
                2–10 min
              </div>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-[#E3EEF1] bg-white px-4 py-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF6F8] text-sm font-semibold text-[#6FAFCF]">
                      {index + 1}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#1E2D38]">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-[#5A6B75]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-[#D6E8EF] bg-[#F7FBFC] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5A6B75]">
                Gentle reminder
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5A6B75]">
                This is not about doing a lot. It is about returning often,
                sincerely, and with a heart that wants to stay connected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}