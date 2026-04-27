export type ThemeMode = "system" | "light" | "dark";

const THEME_STORAGE_KEY = "lantern_theme";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
}

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function initializeTheme() {
  if (typeof window === "undefined") return;

  const storedTheme = getStoredTheme();
  applyTheme(storedTheme);
}