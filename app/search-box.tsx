"use client";

import { useEffect, useRef } from "react";
import { SearchIcon } from "./icons";

export function SearchBox({ initial }: { initial: string }) {
  const ref = useRef<HTMLInputElement>(null);

  // "/" jumps to search, like in most note apps.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, [contenteditable=true]")) return;
      e.preventDefault();
      ref.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form action="/" role="search" className="relative">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
      <label className="sr-only" htmlFor="q">
        Search your notes
      </label>
      <input
        id="q"
        ref={ref}
        name="q"
        type="search"
        defaultValue={initial}
        placeholder="Search your notes"
        className="h-12 w-full rounded-2xl border border-line bg-surface pl-11 pr-12 text-[15px] text-ink shadow-[var(--shadow-sm)] placeholder:text-ink-faint/70 transition-colors focus:border-accent focus:outline-none"
      />
      <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden h-6 -translate-y-1/2 items-center rounded-md border border-line bg-sunken px-1.5 font-sans text-xs text-ink-faint sm:inline-flex">
        /
      </kbd>
    </form>
  );
}
