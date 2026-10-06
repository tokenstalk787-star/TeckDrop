"use client";

import { getScoreLabel } from "@/lib/intelligence";

type Props = {
  score: number;
  rewardPotential: number;
  effortScore: number;
  costScore: number;
  riskScore: number;
  longevityScore: number;
  verificationConfidence: number;
};

const factors: Array<{ key: keyof Omit<Props,"score">; label: string }> = [
  { key: "rewardPotential", label: "Reward potential" },
  { key: "effortScore", label: "Effort efficiency" },
  { key: "costScore", label: "Cost efficiency" },
  { key: "riskScore", label: "Risk safety" },
  { key: "longevityScore", label: "Longevity" },
  { key: "verificationConfidence", label: "Verification confidence" },
];

export function IntelligenceBreakdown(props: Props) {
  return (
    <section className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-400/[0.04] p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">Intelligence engine</p>
          <h2 className="mt-1 text-lg font-bold">Why this opportunity scores {props.score}/100</h2>
        </div>
        <span className="text-xs font-semibold text-violet-300">{getScoreLabel(props.score)}</span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {factors.map(({ key, label }) => {
          const value = props[key];
          return (
            <div key={key} className="rounded-xl border border-white/10 bg-black/10 p-3">
              <div className="flex justify-between gap-3 text-xs">
                <span className="text-slate-400">{label}</span>
                <span className="font-bold text-slate-200">{value}/100</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-violet-400" style={{ width: value + "%" }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
