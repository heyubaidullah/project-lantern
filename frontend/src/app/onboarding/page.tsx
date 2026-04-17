"use client";

import { useMemo, useState } from "react";
import OnboardingProgress from "@/components/OnboardingProgress";
import OptionCard from "@/components/OptionCard";
import StepShell from "@/components/StepShell";

type IntentOption = {
  id: string;
  title: string;
  description: string;
};

type LanguageOption = {
  id: string;
  title: string;
  subtitle: string;
};

type RhythmOption = {
  id: string;
  title: string;
  description: string;
};

type PathwayOption = {
  id: string;
  title: string;
  description: string;
};

const intentOptions: IntentOption[] = [
  {
    id: "daily-habit",
    title: "Build a daily habit",
    description: "A steady, simple rhythm to return every day.",
  },
  {
    id: "reconnect",
    title: "Reconnect after a strong season",
    description: "Carry spiritual momentum into ordinary life.",
  },
  {
    id: "understand",
    title: "Understand more clearly",
    description: "Move beyond reading into meaning, reflection, and clarity.",
  },
  {
    id: "gentle-start",
    title: "Start gently",
    description: "A welcoming path for new, returning, or exploring learners.",
  },
];

const languageOptions: LanguageOption[] = [
  { id: "english", title: "English", subtitle: "Clear and familiar" },
  { id: "arabic", title: "Arabic", subtitle: "For readers comfortable with Arabic" },
  { id: "spanish", title: "Spanish", subtitle: "A more accessible starting point" },
  { id: "urdu", title: "Urdu", subtitle: "A familiar option for many readers" },
];

const rhythmOptions: RhythmOption[] = [
  {
    id: "2",
    title: "2 minutes",
    description: "The lightest, easiest starting point for busy days.",
  },
  {
    id: "5",
    title: "5 minutes",
    description: "A balanced rhythm for reading, meaning, and one reflection.",
  },
  {
    id: "10",
    title: "10 minutes",
    description: "A slightly deeper daily experience without becoming overwhelming.",
  },
];

const pathwayOptions: PathwayOption[] = [
  {
    id: "reconnect-after-ramadan",
    title: "Reconnect After Ramadan",
    description: "A gentle path back into consistency and spiritual continuity.",
  },
  {
    id: "start-understanding",
    title: "Start Understanding",
    description: "A beginner-friendly journey for meaning and clarity.",
  },
  {
    id: "mercy-and-hope",
    title: "Mercy and Hope",
    description: "A reflective pathway centered on comfort, healing, and return.",
  },
  {
    id: "beginners-7-day",
    title: "Beginner’s 7-Day Journey",
    description: "A soft introduction for new, returning, or exploring users.",
  },
];

const totalSteps = 4;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  const [intent, setIntent] = useState("");
  const [language, setLanguage] = useState("");
  const [rhythm, setRhythm] = useState("");
  const [pathway, setPathway] = useState("");

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(intent);
    if (step === 2) return Boolean(language);
    if (step === 3) return Boolean(rhythm);
    if (step === 4) return Boolean(pathway);
    return false;
  }, [step, intent, language, rhythm, pathway]);

  function nextStep() {
    if (step < totalSteps && canContinue) {
      setStep((prev) => prev + 1);
    }
  }

  function prevStep() {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  }

  function saveAndBeginJourney() {
    if (!canContinue) return;

    const onboardingData = {
      intent,
      language,
      rhythm,
      pathway,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem("lantern_onboarding", JSON.stringify(onboardingData));
    window.location.href = "/journey";
  }

  const summary = {
    intent: intentOptions.find((item) => item.id === intent)?.title ?? "—",
    language: languageOptions.find((item) => item.id === language)?.title ?? "—",
    rhythm: rhythmOptions.find((item) => item.id === rhythm)?.title ?? "—",
    pathway: pathwayOptions.find((item) => item.id === pathway)?.title ?? "—",
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#edf7fa_0%,#f7fbfc_45%,#f7fbfc_100%)]">
      <main className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_right,rgba(140,199,195,0.18),transparent_40%),radial-gradient(circle_at_top_left,rgba(111,175,207,0.14),transparent_35%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-5 py-10 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="flex flex-col justify-between rounded-[2rem] border border-[#d8e7ec] bg-[linear-gradient(135deg,#6FAFCF_0%,#7dbdca_42%,#8CC7C3_100%)] p-7 text-white shadow-[0_30px_80px_rgba(30,45,56,0.10)] sm:p-9">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
                  Project Lantern
                </p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  Begin gently.
                  <br />
                  Build a rhythm that lasts.
                </h1>
                <p className="mt-5 max-w-md text-sm leading-7 text-white/85 sm:text-base">
                  A few small choices will help shape a calmer, more personal daily
                  journey — one that feels welcoming enough to return to every day.
                </p>
              </div>

              <div className="mt-8">
                <OnboardingProgress currentStep={step} totalSteps={totalSteps} />
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                  What you’re setting up
                </p>

                <div className="mt-4 grid gap-3">
                  <SummaryRow label="Intent" value={summary.intent} />
                  <SummaryRow label="Language" value={summary.language} />
                  <SummaryRow label="Daily rhythm" value={summary.rhythm} />
                  <SummaryRow label="Pathway" value={summary.pathway} />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#d8e7ec] bg-white/95 p-6 shadow-[0_30px_80px_rgba(30,45,56,0.08)] backdrop-blur-sm sm:p-8">
              {step === 1 && (
                <StepShell
                  eyebrow="Step 1 of 4"
                  title="Why are you here today?"
                  description="Choose the intention that feels closest to where you are right now."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {intentOptions.map((option) => (
                      <OptionCard
                        key={option.id}
                        title={option.title}
                        description={option.description}
                        selected={intent === option.id}
                        onClick={() => setIntent(option.id)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell
                  eyebrow="Step 2 of 4"
                  title="Choose your preferred language"
                  description="We want the daily experience to feel clear, familiar, and approachable."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {languageOptions.map((option) => (
                      <OptionCard
                        key={option.id}
                        title={option.title}
                        description={option.subtitle}
                        selected={language === option.id}
                        onClick={() => setLanguage(option.id)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell
                  eyebrow="Step 3 of 4"
                  title="Choose a daily rhythm"
                  description="Start with a pace that feels sustainable. You can always adjust it later."
                >
                  <div className="grid gap-4">
                    {rhythmOptions.map((option) => (
                      <OptionCard
                        key={option.id}
                        title={option.title}
                        description={option.description}
                        selected={rhythm === option.id}
                        onClick={() => setRhythm(option.id)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 4 && (
                <StepShell
                  eyebrow="Step 4 of 4"
                  title="Choose your starting pathway"
                  description="Pick a guided path that gives your first days a gentle and meaningful direction."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {pathwayOptions.map((option) => (
                      <OptionCard
                        key={option.id}
                        title={option.title}
                        description={option.description}
                        selected={pathway === option.id}
                        onClick={() => setPathway(option.id)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              <div className="mt-8 flex flex-col gap-3 border-t border-[#E3EEF1] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="rounded-full border border-[#D6E8EF] bg-[#F7FBFC] px-5 py-3 text-sm font-medium text-[#1E2D38] transition hover:bg-[#EEF6F8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canContinue}
                    className="rounded-full bg-[#1E2D38] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveAndBeginJourney}
                    disabled={!canContinue}
                    className="rounded-full bg-[#1E2D38] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Begin journey
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
      <span className="text-sm text-white/75">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}