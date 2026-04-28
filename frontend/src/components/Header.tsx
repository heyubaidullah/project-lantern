"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Today", href: "/journey" },
  { label: "Progress", href: "/progress" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--header-bg)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-2xl px-2 py-1 transition hover:bg-[var(--surface-soft)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[linear-gradient(135deg,var(--brand-a)_0%,var(--brand-b)_100%)] text-lg text-white shadow-sm">
              ۝
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                One Ayah Forward
              </p>
              <p className="truncate text-lg font-semibold tracking-tight text-[var(--text-strong)]">
                Al-Huda
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] shadow-sm"
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/journey"
            className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90"
          >
            Begin today
          </Link>
        </div>
      </div>
    </header>
  );
}