"use client";

import { useMemo } from "react";

export function DeadlineStatus({ deadline, snapshotDate }: { deadline: Date | string | null; snapshotDate: Date | string | null }) {
  const status = useMemo(() => {
    if (!deadline && !snapshotDate) return null;
    const now = Date.now();
    const deadlineMs = deadline ? new Date(deadline).getTime() : 0;
    const daysLeft = deadlineMs ? Math.ceil((deadlineMs - now) / 86400000) : null;
    return { daysLeft };
  }, [deadline, snapshotDate]);

  if (!status) return null;

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      {snapshotDate && (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-400">
          Snapshot: <strong className="text-slate-200">{new Date(snapshotDate).toLocaleDateString()}</strong>
        </div>
      )}
      {deadline && (
        <div className={`rounded-xl border p-3 text-xs ${status.daysLeft !== null && status.daysLeft <= 7 ? "border-amber-400/20 bg-amber-400/5 text-amber-200" : "border-white/10 bg-white/[0.03] text-slate-400"}`}>
          Deadline: <strong>{new Date(deadline).toLocaleDateString()}</strong>
          {status.daysLeft !== null && <span className="ml-2">({status.daysLeft < 0 ? "passed" : status.daysLeft === 0 ? "today" : status.daysLeft + "d left"})</span>}
        </div>
      )}
    </div>
  );
}
