import Header from "@/components/Header";
import AppFooter from "@/components/AppFooter";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top, var(--bg-page-alt) 0%, var(--bg-page) 45%, var(--bg-page) 100%)",
      }}
    >
      <Header />

      <main className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px]"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(140,199,195,0.16), transparent 40%), radial-gradient(circle at top left, rgba(111,175,207,0.14), transparent 35%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] p-8 shadow-[0_24px_70px_rgba(30,45,56,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
              About
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-4xl">
              About Al-Huda
            </h1>
            <p className="mt-5 text-sm leading-8 text-[var(--text-muted)] sm:text-base">
              Al-Huda is designed to help users build a lasting and practical
              daily relationship with the Quran. The experience is intentionally
              calm, welcoming, and non-overwhelming: read one passage, reflect
              privately, and carry one small action step into the day.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-[var(--surface-soft)] p-5">
                <h2 className="text-lg font-semibold text-[var(--text-strong)]">
                  What it focuses on
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                  Consistency, understanding, reflection, and simple real-life
                  application through guided daily pathways.
                </p>
              </div>

              <div className="rounded-[1.5rem] bg-[var(--surface-soft)] p-5">
                <h2 className="text-lg font-semibold text-[var(--text-strong)]">
                  Built with intention
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                  Built under Project Lantern with a focus on respectful design,
                  gentle habit building, and meaningful daily engagement.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}