import type { Metadata } from "next";
import { CalendarDays, Clock3, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { airdrops } from "@/data/airdrops";

export const metadata: Metadata = {
  title: "Airdrop Calendar",
  description: "Track airdrop snapshots, deadlines, and important dates.",
};

export default function CalendarPage() {
  const dated = airdrops;
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-500/10 text-violet-400"><CalendarDays /></div><div><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Timing intelligence</p><h1 className="mt-2 text-4xl font-black">Airdrop Calendar</h1></div></div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"><span>Opportunity</span><span>Status</span><span>Score</span></div>
          {dated.map((item) => (
            <div key={item.slug} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-white/5 px-5 py-5 last:border-0">
              <div><h2 className="font-semibold">{item.name}</h2><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />Dates will appear after official confirmation</p></div>
              <span className="flex items-center gap-1.5 text-xs text-slate-400"><ShieldCheck className="h-3.5 w-3.5" />{item.status}</span>
              <span className="font-bold text-violet-300">{item.opportunityScore}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-600">TeckDrop will only publish snapshot/deadline dates after they are supported by an official source. Demo records intentionally have no fabricated dates.</p>
      </section>
    </main>
  );
}