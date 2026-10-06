"use client";

import { useState } from "react";

function readWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem("teckdrop:watchlist") || "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function WatchlistToggle({ slug }: { slug: string }) {
  const [tracked, setTracked] = useState(() => readWatchlist().includes(slug));

  function toggle() {
    const current = readWatchlist();
    const next = tracked ? current.filter((item) => item !== slug) : [...new Set([...current, slug])];
    window.localStorage.setItem("teckdrop:watchlist", JSON.stringify(next));
    setTracked(!tracked);
    window.dispatchEvent(new Event("teckdrop:watchlist"));
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={tracked} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${tracked ? "border-violet-400/30 bg-violet-400/10 text-violet-200" : "border-white/10 text-slate-300 hover:bg-white/5"}`}>
      {tracked ? "✓ Tracked" : "Track"}
    </button>
  );
}
