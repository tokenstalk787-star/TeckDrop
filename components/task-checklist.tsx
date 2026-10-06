"use client";

import { useState } from "react";

type Task = {
  id: string;
  title: string;
  description?: string | null;
};

type Airdrop = {
  slug: string;
  tasks: Task[];
};

export function TaskChecklist({ airdrop }: { airdrop: Airdrop }) {
  const storageKey = `teckdrop:progress:${airdrop.slug}`;

  const [completed, setCompleted] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const saved = window.localStorage.getItem(storageKey);

      if (!saved) {
        return [];
      }

      const parsed: unknown = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (value): value is string => typeof value === "string",
      );
    } catch {
      return [];
    }
  });

  function toggle(id: string) {
    const next = completed.includes(id)
      ? completed.filter((taskId) => taskId !== id)
      : [...completed, id];

    setCompleted(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const progress = airdrop.tasks.length
    ? Math.round((completed.length / airdrop.tasks.length) * 100)
    : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Hunter Checklist</h2>

          <p className="text-sm text-zinc-400">
            Complete the tasks to track your progress.
          </p>
        </div>

        <span className="text-sm font-medium text-zinc-300">
          {progress}%
        </span>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {airdrop.tasks.map((task) => {
          const isCompleted = completed.includes(task.id);

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => toggle(task.id)}
              className="flex w-full items-start gap-3 rounded-xl border border-white/10 p-4 text-left transition hover:bg-white/[0.04]"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                  isCompleted
                    ? "border-white bg-white text-black"
                    : "border-white/20"
                }`}
              >
                {isCompleted ? "✓" : ""}
              </span>

              <span className="min-w-0">
                <span
                  className={`block font-medium ${
                    isCompleted
                      ? "text-zinc-500 line-through"
                      : "text-white"
                  }`}
                >
                  {task.title}
                </span>

                {task.description && (
                  <span className="mt-1 block text-sm text-zinc-400">
                    {task.description}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}