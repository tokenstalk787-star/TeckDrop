"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Airdrop } from "@/data/airdrops";

type View = "ALL" | "ACTIVE" | "TODO" | "COMPLETED";
type Sort = "PRIORITY" | "SCORE" | "PROGRESS";

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

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readActivity() {
  if (typeof window === "undefined") return { lastActive: "", streak: 0 };
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem("teckdrop:hunter-activity") || "{}");
    if (!parsed || typeof parsed !== "object") return { lastActive: "", streak: 0 };
    const value = parsed as { lastActive?: unknown; streak?: unknown };
    return {
      lastActive: typeof value.lastActive === "string" ? value.lastActive : "",
      streak: typeof value.streak === "number" ? value.streak : 0,
    };
  } catch {
    return { lastActive: "", streak: 0 };
  }
}

function updateActivity() {
  const today = getTodayKey();
  const activity = readActivity();
  if (activity.lastActive === today) return activity;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const streak = activity.lastActive === yesterdayKey ? activity.streak + 1 : 1;
  const next = { lastActive: today, streak };
  window.localStorage.setItem("teckdrop:hunter-activity", JSON.stringify(next));
  return next;
}

export function HunterDashboard({ airdrops }: { airdrops: Airdrop[] }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [version, setVersion] = useState(0);
  const [view, setView] = useState<View>("ALL");
  const [sort, setSort] = useState<Sort>("PRIORITY");
  const [activity, setActivity] = useState({ lastActive: "", streak: 0 });

  useEffect(() => {
    const load = () => setSlugs(readList("teckdrop:watchlist"));
    const refreshProgress = () => setVersion((value) => value + 1);
    load();
    setActivity(updateActivity());
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
    return [...tracked]
      .map((item) => {
        const progress = getProgress(item);
        const statusBoost = item.status === "ACTIVE" ? 12 : item.status === "UPCOMING" ? 5 : -20;
        const riskPenalty = item.riskLevel === "HIGH" ? 12 : item.riskLevel === "MEDIUM" ? 5 : 0;
        const unfinishedBoost = progress.percent < 100 ? 8 : -20;
        const priority = Math.max(0, Math.min(100, item.opportunityScore + statusBoost + unfinishedBoost - riskPenalty));
        const reason =
          item.status === "ACTIVE" && progress.percent < 100
            ? "Active + unfinished tasks"
            : item.status === "ACTIVE"
              ? "Active opportunity"
              : progress.percent < 100
                ? "Finish before the campaign becomes active"
                : "Guide completed";
        return { item, progress, priority, reason };
      })
      .sort((a, b) => b.priority - a.priority);
  }, [tracked, version]);

  const visible = useMemo(() => {
    const filtered = ranked.filter(
      ({ item, progress }) =>
        view === "ALL" ||
        (view === "ACTIVE" && item.status === "ACTIVE") ||
        (view === "TODO" && progress.percent < 100) ||
        (view === "COMPLETED" && progress.percent === 100),
    );

    return [...filtered].sort((a, b) =>
      sort === "SCORE"
        ? b.item.opportunityScore - a.item.opportunityScore
        : sort === "PROGRESS"
          ? b.progress.percent - a.progress.percent
          : b.priority - a.priority,
    );
  }, [ranked, sort, view]);

  const summary = useMemo(() => {
    void version;
    const progress = tracked.map(getProgress);
    const completedGuides = progress.filter((item) => item.percent === 100).length;
    const activeTracked = tracked.filter((item) => item.status === "ACTIVE").length;
    const averageScore = tracked.length
      ? Math.round(tracked.reduce((sum, item) => sum + item.opportunityScore, 0) / tracked.length)
      : 0;
    const tasksDone = progress.reduce((sum, item) => sum + item.done, 0);
    const tasksTotal = progress.reduce((sum, item) => sum + item.total, 0);
    const tasksLeft = Math.max(0, tasksTotal - tasksDone);
    const minutesLeft = tracked.reduce(
      (sum, item) =>
        sum +
        item.tasks
          .filter((task) => !readList("teckdrop:progress:" + item.slug).includes(task.id))
          .reduce((taskSum, task) => taskSum + (task.estimatedMinutes || 0), 0),
      0,
    );
    return { completedGuides, activeTracked, averageScore, tasksDone, tasksTotal, tasksLeft, minutesLeft };
  }, [tracked, version]);

  const topPriority = ranked[0];

  return (
    <div className="mt-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Tracked" value={tracked.length} />
        <Stat label="Active tracked" value={summary.activeTracked} />
        <Stat label="Tasks left" value={summary.tasksLeft} />
        <Stat label="Time left" value={summary.minutesLeft ? summary.minutesLeft + "m" : "Done"} />
      </div>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">Daily hunting summary</p>
            <h2 className="mt-1 text-xl font-bold">Your mission for today</h2>
            <p className="mt-1 text-sm text-slate-400">
              {summary.tasksLeft
                ? `You have ${summary.tasksLeft} task${summary.tasksLeft === 1 ? "" : "s"} left across your tracked opportunities.`
                : "Your tracked guides are fully completed."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MiniStat label="Streak" value={activity.streak + " day" + (activity.streak === 1 ? "" : "s")} />
            <MiniStat label="Done" value={summary.tasksDone + "/" + summary.tasksTotal} />
            <MiniStat label="Avg score" value={String(summary.averageScore)} />
          </div>
        </div>
      </section>

      {topPriority && (
        <section className="mt-8 rounded-2xl border border-violet-400/20 bg-violet-400/[0.05] p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">Hunter priority</p>
              <h2 className="mt-1 text-xl font-bold">What should I farm today?</h2>
              <p className="mt-1 text-sm text-slate-400">
                {topPriority.item.name} · Priority {topPriority.priority} · {topPriority.reason}
              </p>
            </div>
            <Link
              href={"/airdrop/" + topPriority.item.slug}
              className="rounded-xl bg-violet-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-violet-400"
            >
              Start top priority
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {ranked.slice(0, 3).map(({ item, progress, priority, reason }, index) => (
              <Link
                key={item.slug}
                href={"/airdrop/" + item.slug}
                className="rounded-xl border border-white/10 bg-black/10 p-4 transition hover:border-violet-400/30"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-300">
                    #{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white">{item.name}</span>
                      <span className="text-xs font-bold text-violet-300">Priority {priority}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {reason} · {progress.percent}% complete
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">My tracked opportunities</h2>
            <p className="mt-1 text-sm text-slate-500">Filter and sort your farming queue.</p>
          </div>
          <span className="text-xs text-slate-500">{summary.completedGuides} completed</span>
        </div>

        {tracked.length ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["ALL", "ACTIVE", "TODO", "COMPLETED"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setView(option)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${view === option ? "border-violet-400/30 bg-violet-400/10 text-violet-200" : "border-white/10 text-slate-500 hover:text-slate-300"}`}
                >
                  {option === "ALL" ? "All" : option === "TODO" ? "To do" : option === "COMPLETED" ? "Completed" : "Active"}
                </button>
              ))}
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="ml-auto rounded-lg border border-white/10 bg-[#0b1017] px-3 py-2 text-xs text-slate-400"
              >
                <option value="PRIORITY">Sort: Priority</option>
                <option value="SCORE">Sort: Score</option>
                <option value="PROGRESS">Sort: Progress</option>
              </select>
            </div>

            <div className="mt-4 space-y-3">
              {visible.length ? (
                visible.map(({ item, progress, priority }) => (
                  <article key={item.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={"/airdrop/" + item.slug} className="font-semibold hover:text-violet-300">
                            {item.name}
                          </Link>
                          <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-slate-500">{item.status}</span>
                          <span className="text-xs font-bold text-violet-300">Score {item.opportunityScore}</span>
                          <span className="text-[10px] text-slate-600">Priority {priority}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.ecosystem} · {item.difficulty} · {item.riskLevel} risk
                        </p>
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
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
                  No opportunities match this view.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-slate-500">You are not tracking any opportunities yet.</p>
            <Link href="/airdrops" className="mt-3 inline-block text-sm font-semibold text-violet-300 hover:text-violet-200">
              Open directory →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-3">
      <p className="text-base font-bold text-white">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}
