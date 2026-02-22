import { createSignal } from "solid-js";

export type Theme = "light" | "dark";

const STORAGE_KEY = "qemail_theme";

const getInitialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    // Respect system preference
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
  } catch {
    // SSR / no localStorage
  }
  return "light";
};

const applyTheme = (t: Theme) => {
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    // ignore
  }
};

const [theme, setThemeSignal] = createSignal<Theme>(getInitialTheme());

// Apply the initial theme immediately when module loads
applyTheme(theme());

export const toggleTheme = () => {
  const next: Theme = theme() === "light" ? "dark" : "light";
  setThemeSignal(next);
  applyTheme(next);
};

export const setTheme = (t: Theme) => {
  setThemeSignal(t);
  applyTheme(t);
};

export const themeStore = {
  theme,
  toggleTheme,
  setTheme,
};
