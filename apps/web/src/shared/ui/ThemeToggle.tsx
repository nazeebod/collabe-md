import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const NEXT_LABEL: Record<"light" | "dark" | "auto", string> = {
  light: "Switch to dark mode",
  dark: "Switch to auto mode",
  auto: "Switch to light mode",
};

export function ThemeToggle() {
  const { mode, cycle } = useTheme();

  return (
    <button
      type="button"
      onClick={cycle}
      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      title={NEXT_LABEL[mode]}
      aria-label={NEXT_LABEL[mode]}
      data-testid="theme-toggle"
    >
      {mode === "light" && <Sun className="h-4 w-4" />}
      {mode === "dark" && <Moon className="h-4 w-4" />}
      {mode === "auto" && <Monitor className="h-4 w-4" />}
    </button>
  );
}
