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

  useEffect(() => {
    const load = () => setSlugs(readList("teckdrop:watchlist"));
    load();
    window.addEventListener("teckdrop:watchlist", load);
    window.addEventListener("teckdrop:progress", () => setVersion((value) => value + 1));
    return () => {
      window.removeEventListener("teckdrop:watchlist", load);
      window.removeEventListener("teckdrop:progress", () => setVersion((value) => value + 1));
    };
  }, []);

  const tracked = useMemo(() => airdrops.filter((item) => slugs.includes(item.slug)), [airdrops, slugs]);
  const summary = useMemo(() => {
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

      <div className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">My tracked opportunities</h2>
            <p className="mt-1 text-sm text-slate-500">Prioritize active, high-score opportunities and finish required tasks first.</p>
          </div>
          <span className="text-xs text-slate-500">{summary.completedGuides} completed</span>
        </div>

        {tracked.length ? (
          <div className="mt-4 space-y-3">
            {[...tracked].sort((a, b) => b.opportunityScore - a.opportunityScore).map((item) => {
              const progress = getProgress(item);
              return (
                <article key={item.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={"/airdrop/" + item.slug} className="font-semibold hover:text-violet-300">{item.name}</Link>
                        <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-slate-500">{item.status}</span>
                        <span className="text-xs font-bold text-violet-300">Score {item.opportunityScore}</span>
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
