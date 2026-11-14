"use client";

import { useEffect, useState } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";

type Mode = "light" | "dark" | "system";

// Runs before paint (inlined in layout.tsx), so the page never flashes
// the wrong theme.
export const THEME_SCRIPT = `try{var t=localStorage.getItem("sn-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const NEXT: Record<Mode, Mode> = { system: "dark", dark: "light", light: "system" };
const LABEL: Record<Mode, string> = {
  system: "Theme: system. Switch to dark",
  dark: "Theme: dark. Switch to light",
  light: "Theme: light. Switch to system",
};

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sn-theme");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once on mount
      setMode(saved === "light" || saved === "dark" ? saved : "system");
    } catch {
      setMode("system");
    }
  }, []);

  function cycle() {
    if (!mode) return;
    const next = NEXT[mode];
    setMode(next);
    const root = document.documentElement;
    root.classList.add("theme-changing");
    setTimeout(() => root.classList.remove("theme-changing"), 300);
    try {
      if (next === "system") {
        localStorage.removeItem("sn-theme");
        delete root.dataset.theme;
      } else {
        localStorage.setItem("sn-theme", next);
        root.dataset.theme = next;
      }
    } catch {
      // Private windows can refuse storage; the click still changes this tab.
      if (next === "system") delete root.dataset.theme;
      else root.dataset.theme = next;
    }
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={mode ? LABEL[mode] : "Theme"}
      title={mode ? LABEL[mode] : "Theme"}
      className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink-soft transition-colors hover:bg-sunken hover:text-ink"
    >
      {mode === "dark" ? <MoonIcon /> : mode === "light" ? <SunIcon /> : <MonitorIcon />}
    </button>
  );
}
