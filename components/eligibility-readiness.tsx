"use client";

import { useMemo, useState } from "react";

type Task = { id: string; title: string; required: boolean };

export function EligibilityReadiness({ slug, tasks }: { slug: string; tasks: Task[] }) {
  const [completed] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const value: unknown = JSON.parse(window.localStorage.getItem("teckdrop:progress:" + slug) || "[]");
      return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
    } catch {
      return [];
    }
  });

  const required = useMemo(() => tasks.filter((task) => task.required), [tasks]);
  const done = required.filter((task) => completed.includes(task.id)).length;
  const percent = required.length ? Math.round((done / required.length) * 100) : 0;
  const ready = required.length > 0 && done === required.length;

  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Hunter readiness</p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">{ready ? "Guide requirements completed" : "Complete the required guide tasks"}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {done}/{required.length} required tasks complete · {percent}% readiness
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ready ? "bg-emerald-400/10 text-emerald-300" : "bg-amber-400/10 text-amber-300"}`}>
          {ready ? "Ready" : "In progress"}
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: percent + "%" }} />
      </div>
      <p className="mt-3 text-[11px] leading-5 text-slate-600">
        This is TeckDrop guide readiness, not an on-chain eligibility guarantee. Final eligibility can depend on snapshots, wallet activity, sybil rules, geography, or other project-specific criteria.
      </p>
    </section>
  );
}
