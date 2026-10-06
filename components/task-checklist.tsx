"use client";

import { useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  taskUrl?: string | null;
  estimatedMinutes?: number;
  required?: boolean;
};

type Airdrop = {
  slug: string;
  tasks: Task[];
};

function readProgress(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function TaskChecklist({ airdrop }: { airdrop: Airdrop }) {
  const storageKey = `teckdrop:progress:${airdrop.slug}`;
  const [completed, setCompleted] = useState<string[]>(() => readProgress(storageKey));

  const stats = useMemo(() => {
    const total = airdrop.tasks.length;
    const required = airdrop.tasks.filter((task) => task.required !== false);
    const completedRequired = required.filter((task) => completed.includes(task.id)).length;
    const completedTasks = airdrop.tasks.filter((task) => completed.includes(task.id)).length;
    const minutesLeft = airdrop.tasks
      .filter((task) => !completed.includes(task.id))
      .reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0);
    return {
      total,
      completedTasks,
      required: required.length,
      completedRequired,
      progress: total ? Math.round((completedTasks / total) * 100) : 0,
      requiredProgress: required.length ? Math.round((completedRequired / required.length) * 100) : 0,
      minutesLeft,
    };
  }, [airdrop.tasks, completed]);

  function persist(next: string[]) {
    setCompleted(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event("teckdrop:progress"));
  }

  function toggle(id: string) {
    persist(completed.includes(id) ? completed.filter((taskId) => taskId !== id) : [...completed, id]);
  }

  function reset() {
    persist([]);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Hunter Checklist</h2>
          <p className="mt-1 text-sm text-zinc-400">Track exactly what you have completed. Progress is saved in this browser.</p>
        </div>
        <button type="button" onClick={reset} disabled={!completed.length} className="text-xs font-medium text-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
          Reset progress
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Progress" value={`${stats.progress}%`} />
        <MiniStat label="Required" value={`${stats.completedRequired}/${stats.required}`} />
        <MiniStat label="Tasks" value={`${stats.completedTasks}/${stats.total}`} />
        <MiniStat label="Time left" value={stats.minutesLeft ? `${stats.minutesLeft}m` : "Done"} />
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-violet-400 transition-all" style={{ width: `${stats.progress}%` }} />
      </div>

      <div className="mt-5 space-y-3">
        {airdrop.tasks.map((task, index) => {
          const isCompleted = completed.includes(task.id);
          return (
            <button key={task.id} type="button" onClick={() => toggle(task.id)} className="flex w-full items-start gap-3 rounded-xl border border-white/10 p-4 text-left transition hover:bg-white/[0.04]">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${isCompleted ? "border-violet-400 bg-violet-400 text-black" : "border-white/20"}`}>
                {isCompleted ? "✓" : index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block font-medium ${isCompleted ? "text-zinc-500 line-through" : "text-white"}`}>{task.title}</span>
                {task.description && <span className="mt-1 block text-sm text-zinc-400">{task.description}</span>}\n                {task.taskUrl && <a href={task.taskUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="mt-2 inline-block text-xs font-semibold text-violet-300 hover:text-violet-200">Open official task ↗</a>}
              </span>
              <span className="shrink-0 text-right text-[11px] text-zinc-500">
                <span className="block">{task.estimatedMinutes || 0} min</span>
                <span className="mt-1 block">{task.required === false ? "Optional" : "Required"}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-white/[0.04] p-3"><p className="text-base font-bold text-white">{value}</p><p className="mt-1 text-[11px] text-zinc-500">{label}</p></div>;
}
