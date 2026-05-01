"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function isActive(href: string) {
    return pathname === href;
  }

  const firstName = profile?.first_name ?? "User";
  const initial = firstName.charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-soft)] bg-[var(--header-bg)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-2xl px-2 py-1 transition hover:bg-[var(--surface-soft)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border-soft)] bg-[linear-gradient(135deg,var(--brand-a)_0%,var(--brand-b)_100%)] text-lg text-white shadow-sm transition group-hover:scale-[1.03]">
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
                      : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--heading-accent)]"
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
            <div className="hidden items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-2 shadow-sm md:flex">
              <span className="text-base">🔥</span>
              <div className="leading-tight">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--heading-accent-soft)]">
                  Streak
                </p>
                <p className="text-sm font-semibold text-[var(--accent-gold)]">
                  {streak?.current_streak ?? 0} day{(streak?.current_streak ?? 0) === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] px-2.5 py-2 transition hover:bg-[var(--surface-raised)]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-gold)] text-sm font-semibold text-white">
                  {initial}
                </div>
                <span className="hidden pr-1 text-sm font-medium text-[var(--text-strong)] md:inline">
                  {firstName}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 z-50 min-w-[190px] overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-raised)] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                  <div className="rounded-xl bg-[var(--surface-soft)] px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--heading-accent-soft)]">
                      Signed in as
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--text-strong)]">
                      {profile?.email ?? "Authenticated user"}
                    </p>
                  </div>

                  <Link
                    href="/progress"
                    className="mt-2 block rounded-xl px-3 py-2.5 text-sm text-[var(--text-strong)] transition hover:bg-[var(--surface-soft)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <Link
                    href="/about"
                    className="block rounded-xl px-3 py-2.5 text-sm text-[var(--text-strong)] transition hover:bg-[var(--surface-soft)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Settings
                  </Link>

                  <Link
                    href="/logout"
                    className="block rounded-xl px-3 py-2.5 text-sm text-[var(--text-strong)] transition hover:bg-[var(--surface-soft)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log out
                  </Link>
                </div>
              )}
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