"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Airdrop } from "@/data/airdrops";

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

function getProgress(item: Airdrop) {
  const completed = readList("teckdrop:progress:" + item.slug);
  const total = item.tasks.length;
  const done = item.tasks.filter((task) => completed.includes(task.id)).length;
  const required = item.tasks.filter((task) => task.required !== false);
  const requiredDone = required.filter((task) => completed.includes(task.id)).length;
  return {
    percent: total ? Math.round((done / total) * 100) : 0,
    requiredPercent: required.length ? Math.round((requiredDone / required.length) * 100) : 0,
    done,
    total,
  };
}

export function HunterDashboard({ airdrops }: { airdrops: Airdrop[] }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [version, setVersion] = useState(0);
  const [view, setView] = useState<"ALL" | "ACTIVE" | "TODO" | "COMPLETED">("ALL");
  const [sort, setSort] = useState<"PRIORITY" | "SCORE" | "PROGRESS">("PRIORITY");

  useEffect(() => {
    const load = () => setSlugs(readList("teckdrop:watchlist"));
    const refreshProgress = () => setVersion((value) => value + 1);
    load();
    window.addEventListener("teckdrop:watchlist", load);
    window.addEventListener("teckdrop:progress", refreshProgress);
    return () => {
      window.removeEventListener("teckdrop:watchlist", load);
      window.removeEventListener("teckdrop:progress", refreshProgress);
    };
  }, []);

  const tracked = useMemo(() => airdrops.filter((item) => slugs.includes(item.slug)), [airdrops, slugs]);
  const ranked = useMemo(() => {
    void version;
    return [...tracked].map((item) => {
      const progress = getProgress(item);
      const statusBoost = item.status === "ACTIVE" ? 12 : item.status === "UPCOMING" ? 5 : -20;
      const riskPenalty = item.riskLevel === "HIGH" ? 12 : item.riskLevel === "MEDIUM" ? 5 : 0;
      const unfinishedBoost = progress.percent < 100 ? 8 : -20;
      const priority = Math.max(0, Math.min(100, item.opportunityScore + statusBoost + unfinishedBoost - riskPenalty));
      const reason = item.status === "ACTIVE" && progress.percent < 100 ? "Active + unfinished tasks" : item.status === "ACTIVE" ? "Active opportunity" : progress.percent < 100 ? "Finish before the campaign becomes active" : "Guide completed";
      return { item, progress, priority, reason };
    }).sort((a, b) => b.priority - a.priority);
  }, [tracked, version]);

  const visible = useMemo(() => {\n    const filtered = ranked.filter(({ item, progress }) => view === "ALL" || (view === "ACTIVE" && item.status === "ACTIVE") || (view === "TODO" && progress.percent < 100) || (view === "COMPLETED" && progress.percent === 100));\n    return [...filtered].sort((a, b) => sort === "SCORE" ? b.item.opportunityScore - a.item.opportunityScore : sort === "PROGRESS" ? b.progress.percent - a.progress.percent : b.priority - a.priority);\n  }, [ranked, sort, view]);\n\n  const summary = useMemo(() => {
    void version;
    const completedGuides = tracked.filter((item) => getProgress(item).percent === 100).length;
    const activeTracked = tracked.filter((item) => item.status === "ACTIVE").length;
    const averageScore = tracked.length ? Math.round(tracked.reduce((sum, item) => sum + item.opportunityScore, 0) / tracked.length) : 0;
    return { completedGuides, activeTracked, averageScore };
  }, [tracked, version]);

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Tracked" value={tracked.length} />
        <Stat label="Active tracked" value={summary.activeTracked} />
        <Stat label="Avg opportunity score" value={summary.averageScore} />
      </div>

      {ranked.length > 0 && (
        <section className="mt-8 rounded-2xl border border-violet-400/20 bg-violet-400/[0.05] p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">Hunter priority</p>
              <h2 className="mt-1 text-xl font-bold">What should I farm today?</h2>
              <p className="mt-1 text-sm text-slate-400">Priority combines opportunity score, campaign status, risk and unfinished work.</p>
            </div>
            <Link href={"/airdrop/" + ranked[0].item.slug} className="rounded-xl bg-violet-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-violet-400">Start top priority</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {ranked.slice(0, 3).map(({ item, progress, priority, reason }, index) => (
              <Link key={item.slug} href={"/airdrop/" + item.slug} className="rounded-xl border border-white/10 bg-black/10 p-4 transition hover:border-violet-400/30">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-300">#{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-xs font-bold text-violet-300">Priority {priority}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{reason} · {progress.percent}% complete</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">My tracked opportunities</h2>
            <p className="mt-1 text-sm text-slate-500">Prioritize active, high-score opportunities and finish required tasks first.</p>
          </div>
          <span className="text-xs text-slate-500">{summary.completedGuides} completed</span>
        </div>

        {tracked.length ? (
          <div className="mt-4 flex flex-wrap gap-2">\n            {(["ALL", "ACTIVE", "TODO", "COMPLETED"] as const).map((option) => <button key={option} type="button" onClick={() => setView(option)} className={\`rounded-lg border px-3 py-2 text-xs font-semibold transition ${view === option ? "border-violet-400/30 bg-violet-400/10 text-violet-200" : "border-white/10 text-slate-500 hover:text-slate-300"}\`}>{option === "ALL" ? "All" : option === "TODO" ? "To do" : option === "COMPLETED" ? "Completed" : "Active"}</button>)}\n            <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="ml-auto rounded-lg border border-white/10 bg-[#0b1017] px-3 py-2 text-xs text-slate-400">\n              <option value="PRIORITY">Sort: Priority</option><option value="SCORE">Sort: Score</option><option value="PROGRESS">Sort: Progress</option>\n            </select>\n          </div>\n          <div className="mt-4 space-y-3">
            {[...tracked].sort((a, b) => b.opportunityScore - a.opportunityScore).map((item) => {
              const progress = getProgress(item);
              return (
                <article key={item.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={"/airdrop/" + item.slug} className="font-semibold hover:text-violet-300">{item.name}</Link>
                        <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-slate-500">{item.status}</span>
                        <span className="text-xs font-bold text-violet-300">Score {item.opportunityScore}</span><span className="text-[10px] text-slate-600">Priority {priority}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{item.ecosystem} · {item.difficulty} · {item.riskLevel} risk</p>
                    </div>
                    <div className="w-full lg:max-w-sm">
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>{progress.done}/{progress.total} tasks</span>
                        <span>{progress.percent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-violet-400 transition-all" style={{ width: progress.percent + "%" }} />
                      </div>
                      <p className="mt-2 text-[11px] text-slate-600">Required tasks: {progress.requiredPercent}%</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-slate-500">You are not tracking any opportunities yet.</p>
            <Link href="/airdrops" className="mt-3 inline-block text-sm font-semibold text-violet-300 hover:text-violet-200">Open directory →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-3xl font-black">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></article>;
}
