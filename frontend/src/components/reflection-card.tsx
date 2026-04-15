export function ReflectionCard() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E3EEF1] sm:p-8">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#6FAFCF]">
        Ayah to Life
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-[#1E2D38] sm:text-3xl">
        Reflect privately. Carry one action into your day.
      </h2>

      <p className="mt-3 max-w-3xl leading-7 text-[#5A6B75]">
        After each daily passage, the app helps the user pause, write one
        private reflection, and save one small practical action they want to
        carry into real life.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-[#EEF6F8] p-5">
          <p className="text-sm font-medium text-[#5A6B75]">
            Reflection prompt
          </p>
          <p className="mt-2 text-[#1E2D38]">
            What is one message from today’s passage that feels personally
            relevant to you?
          </p>
        </div>

        <div className="rounded-2xl bg-[#EEF6F8] p-5">
          <p className="text-sm font-medium text-[#5A6B75]">
            Action example
          </p>
          <p className="mt-2 text-[#1E2D38]">
            Reach out kindly to one family member today.
          </p>
        </div>
      </div>
    </section>
  );
}