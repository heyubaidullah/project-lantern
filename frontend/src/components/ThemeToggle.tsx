"use client";

import { useEffect, useRef, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  type ThemeMode,
} from "@/lib/theme";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.2" />
      <path d="M12 19.8V22" />
      <path d="M2 12h2.2" />
      <path d="M19.8 12H22" />
      <path d="m4.9 4.9 1.5 1.5" />
      <path d="m17.6 17.6 1.5 1.5" />
      <path d="m17.6 6.4 1.5-1.5" />
      <path d="m4.9 19.1 1.5-1.5" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

const options: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: "system", label: "System", icon: <MonitorIcon /> },
  { value: "light", label: "Light", icon: <SunIcon /> },
  { value: "dark", label: "Dark", icon: <MoonIcon /> },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    setTheme(storedTheme);
    applyTheme(storedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      const currentTheme = getStoredTheme();
      if (currentTheme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [mounted]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleChange(nextTheme: ThemeMode) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    setOpen(false);
  }

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  const activeOption =
    options.find((option) => option.value === theme) ?? options[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--text-strong)] transition hover:bg-[var(--surface-raised)]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${activeOption.label}`}
        title={`Theme: ${activeOption.label}${theme === "system" ? ` (${resolvedTheme})` : ""}`}
      >
        <SunIcon />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 min-w-[170px] overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-raised)] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
          {options.map((option) => {
            const isActive = option.value === theme;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange(option.value)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[var(--surface-soft)] text-[var(--text-strong)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>

                {isActive && (
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    {option.value === "system" ? resolvedTheme : "on"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}