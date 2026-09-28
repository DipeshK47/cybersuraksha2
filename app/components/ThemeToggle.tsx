"use client";

import { Moon, Sun } from "lucide-react";

const storageKey = "cybersuraksha-theme";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    window.localStorage.setItem(storageKey, nextTheme);
  }

  return (
    <button
      aria-label="Toggle light and dark mode"
      className="themeToggle"
      onClick={toggleTheme}
      title="Toggle light and dark mode"
      type="button"
    >
      <span className="themeToggleLight" aria-hidden="true">
        <Moon />
      </span>
      <span className="themeToggleDark" aria-hidden="true">
        <Sun />
      </span>
    </button>
  );
}
