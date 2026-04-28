export function TodayJourneyCard() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E3EEF1] sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#6FAFCF]">
            Today’s Journey
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[#1E2D38] sm:text-3xl">
            One small step. One meaningful connection.
          </h2>

          <p className="mt-3 text-[#5A6B75] leading-7">
            Read a short passage, understand it in your language, reflect
            privately, and save one practical action for your day.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#5A6B75]">
            <span className="rounded-full bg-[#EEF6F8] px-3 py-2">
              Read
            </span>
            <span className="rounded-full bg-[#EEF6F8] px-3 py-2">
              Understand
            </span>
            <span className="rounded-full bg-[#EEF6F8] px-3 py-2">
              Reflect
            </span>
            <span className="rounded-full bg-[#EEF6F8] px-3 py-2">
              Act
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-[#6FAFCF] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
            Start today’s journey
          </button>
          <button className="rounded-full border border-[#D7E6EA] bg-[#F7FBFC] px-5 py-3 text-sm font-medium text-[#1E2D38] transition hover:bg-[#EEF6F8]">
            Explore pathways
          </button>
        </div>
      </div>
    </section>
  );
}