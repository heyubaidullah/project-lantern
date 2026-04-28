import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Today", href: "/journey" },
  { label: "Progress", href: "/progress" },
  { label: "About", href: "/about" },
];

const externalLinks = [
  { label: "Quran.com", href: "https://quran.com" },
  { label: "Sunnah.com", href: "https://sunnah.com" },
];

export default function AppFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--border-soft)] bg-[var(--footer-bg)] text-[var(--footer-text)]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-a)_0%,var(--brand-b)_100%)] text-lg text-white shadow-sm">
                ۝
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--footer-muted)]">
                  One Ayah Forward
                </p>
                <p className="text-lg font-semibold tracking-tight text-white">
                  Al-Huda
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--footer-muted)]">
              A calm and practical companion for building a lasting daily
              relationship with the Quran, one small step at a time.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
              Navigate
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[var(--footer-muted)] transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
              References
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {externalLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[var(--footer-muted)] transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5">
          <p className="text-xs leading-6 text-[var(--footer-muted)]">
            Al-Huda | Built at{" "}
            <a
              href="https://www.dynelabs.org"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              Dyne Labs
            </a>{" "}
            © 2026
          </p>
        </div>
      </div>
    </footer>
  );
}