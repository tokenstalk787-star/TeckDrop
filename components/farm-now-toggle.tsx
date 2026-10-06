"use client";

import { useState } from "react";

const KEY = "teckdrop:farming";

export function FarmNowToggle({ slug }: { slug: string }) {
  const [active, setActive] = useState(() => typeof window !== "undefined" && window.localStorage.getItem(KEY) === slug);

  function toggle() {
    const next = active ? "" : slug;
    if (next) window.localStorage.setItem(KEY, next);
    else window.localStorage.removeItem(KEY);
    setActive(!active);
    window.dispatchEvent(new Event("teckdrop:farming"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${active ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-white/10 text-slate-300 hover:bg-white/5"}`}
    >
      {active ? "✓ Farming now" : "Farm now"}
    </button>
  );
}
