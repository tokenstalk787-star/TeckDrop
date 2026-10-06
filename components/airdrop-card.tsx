import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldAlert } from "lucide-react";
import type { Airdrop } from "@/data/airdrops";

export function AirdropCard({airdrop}:{airdrop:Airdrop}){
  const verified=airdrop.verificationStatus==="VERIFIED";
  return <article className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-400/30 hover:bg-white/[0.05]">
    <div className="flex items-start justify-between gap-4">
      <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold">{airdrop.name}</h2>
        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${verified?"bg-emerald-400/10 text-emerald-300":"bg-amber-400/10 text-amber-300"}`}>{verified?"Verified":"Unverified"}</span>
      </div><p className="mt-2 text-sm text-slate-400">{airdrop.description}</p></div>
      <div className="shrink-0 text-right"><div className="text-2xl font-black text-violet-300">{airdrop.opportunityScore}</div><div className="text-[10px] uppercase tracking-wider text-slate-500">Score</div></div>
    </div>
    <div className="mt-5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
      <span className="rounded-lg bg-white/5 px-3 py-2 text-slate-300">{airdrop.ecosystem}</span><span className="rounded-lg bg-white/5 px-3 py-2 text-slate-300">{airdrop.tier}</span><span className="rounded-lg bg-white/5 px-3 py-2 text-slate-300">{airdrop.difficulty}</span><span className="rounded-lg bg-white/5 px-3 py-2 text-slate-300">{airdrop.riskLevel} risk</span>
    </div>
    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
      <div className="flex items-center gap-2 text-xs text-slate-400">{verified?<CheckCircle2 className="h-4 w-4 text-emerald-400"/>:<ShieldAlert className="h-4 w-4 text-amber-400"/>}Est. cost: ${airdrop.estimatedCostUsd}</div>
      <Link href={`/airdrop/${airdrop.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-300 hover:text-violet-200">View guide <ArrowUpRight className="h-4 w-4"/></Link>
    </div>
  </article>;
}