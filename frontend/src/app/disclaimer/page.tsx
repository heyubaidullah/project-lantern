import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Header />

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-6 shadow-[0_24px_70px_rgba(30,45,56,0.06)] sm:p-8">
          <div className="pointer-events-none absolute right-4 top-2 text-[110px] leading-none text-[var(--accent-gold-soft)]">
            ۝
          </div>

          <div className="relative z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--heading-accent-soft)]">
              Disclaimer
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--heading-accent)] sm:text-4xl">
              Product Disclaimer
            </h1>
            <div className="mt-5 space-y-4 text-sm leading-8 text-[var(--text-muted)]">
              <p>
                Al-Huda is intended to be a gentle learning and reflection
                companion. It is designed to help users engage with Quranic
                passages in a more welcoming, practical, and consistent way.
              </p>
              <p>
                The app <b><u>does not</u></b> replace qualified scholarship, formal study,
                personal counsel, or direct guidance from knowledgeable teachers
                and trusted institutions.
              </p>
              <p>
                Explanatory content, pathways, and reflection prompts are meant
                to support thoughtful engagement and daily consistency. Users
                seeking authoritative religious rulings or formal instruction
                should refer to qualified scholars and reputable institutions.
              </p>
              <p>
                Before any wider public release, we will update this disclaimer
                and review it as part of the product’s final public readiness
                process.
              </p>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}