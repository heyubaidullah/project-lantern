const resources = [
  {
    title: "Yaqeen Institute",
    description:
      "Thoughtful, accessible Islamic content for reflection, belief, and practice.",
    href: "https://www.youtube.com/watch?v=Zcj1dm2evuY",
    videoId: "Zcj1dm2evuY",
    tag: "Reflection",
  },
  {
    title: "Qalam Institute",
    description:
      "Grounded learning and practical reminders for everyday spiritual growth.",
    href: "https://youtu.be/GbJyArdKX2M?si=RYwmggy6RX_x3fZf",
    videoId: "GbJyArdKX2M",
    tag: "Learning",
  },
  {
    title: "Roots Academy",
    description:
      "Engaging classes and youth-friendly learning that feels accessible and real.",
    href: "https://www.youtube.com/watch?v=5U7O4C_1kzM",
    videoId: "5U7O4C_1kzM",
    tag: "Study",
  },
];

export default function HelpfulResourcesSection() {
  return (
    <section className="mt-12">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-[var(--heading-accent)]">
          Keep Learning
        </h2>
        <p className="mt-2 text-[var(--text-muted)]">
          A few trusted places to keep growing gently beyond today’s reflection.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {resources.map((resource) => (
          <a
            key={resource.title}
            href={resource.href}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-[1.75rem] border border-[var(--border-soft)] bg-[var(--surface-raised)] shadow-[0_18px_45px_rgba(30,45,56,0.05)] transition hover:-translate-y-1 hover:border-[var(--brand-a)] hover:shadow-[0_24px_60px_rgba(30,45,56,0.08)]"
          >
            <div className="aspect-video w-full overflow-hidden bg-[var(--surface-soft)]">
              <img
                src={`https://img.youtube.com/vi/${resource.videoId}/hqdefault.jpg`}
                alt={resource.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--heading-accent-soft)]">
                  {resource.tag}
                </span>
                <span className="text-[var(--accent-gold)] transition group-hover:translate-x-0.5">
                  ↗
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold tracking-tight text-[var(--heading-accent)]">
                {resource.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
                {resource.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}