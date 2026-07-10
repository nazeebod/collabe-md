import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
export type ThemeMode = "light" | "dark" | "auto";

const STORAGE_KEY = "collabe-md-theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light" || stored === "auto") {
    return stored;
  }
  return "auto";
}

function resolveTheme(mode: ThemeMode): Theme {
  return mode === "auto" ? getSystemTheme() : mode;
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(getStoredMode);
  const [theme, setResolvedTheme] = useState<Theme>(() => resolveTheme(getStoredMode()));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    setResolvedTheme(resolveTheme(mode));
  }, [mode]);

  useEffect(() => {
    if (mode !== "auto") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolvedTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const cycle = useCallback(() => {
    setMode((current) => (current === "light" ? "dark" : current === "dark" ? "auto" : "light"));
  }, []);

  return { theme, mode, setMode, cycle };
}
