"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { getCurrentUser, getProfile, getUserStreak } from "@/lib/db";
import type { UserProfile, UserStreak } from "@/types/app";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Today", href: "/journey" },
  { label: "Progress", href: "/progress" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);

  useEffect(() => {
    async function loadAuthState() {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(Boolean(user));

        if (user) {
          const [profileData, streakData] = await Promise.all([
            getProfile(),
            getUserStreak(),
          ]);

          setProfile(profileData);
          setStreak(streakData);
        }
      } catch (error) {
        console.error("Failed to load auth state", error);
      }
    }

    loadAuthState();
  }, []);

  function isActive(href: string) {
    return pathname === href;
  }

  const firstName = profile?.first_name ?? "User";

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
          {isAuthenticated && (
            <div className="hidden rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--text-strong)] md:flex">
              🔥 {streak?.current_streak ?? 0}
            </div>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-[var(--text-muted)] md:inline">
                {firstName}
              </span>
              <Link
                href="/logout"
                className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-raised)]"
              >
                Log out
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[var(--button-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--button-primary-text)] transition hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}