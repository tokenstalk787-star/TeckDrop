import type { Metadata } from "next";
import { ArrowUpRight, Droplets, Flame, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { airdrops } from "@/data/airdrops";

export const metadata: Metadata = {
  title: "Daily Opportunities",
  description: "Daily airdrop and faucet opportunities tracked by TeckDrop.",
};

export default function DailyPage() {
  const items = airdrops.filter((x) => x.status !== "WARNING");
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-400"><Flame /></div>
          <div><p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Daily hunter feed</p><h1 className="mt-2 text-4xl font-black">What deserves attention today?</h1><p className="mt-3 text-slate-400">Prioritize opportunities by verification, score, risk, and the work required.</p></div>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between gap-4">
                <div><div className="flex items-center gap-2 text-xs text-slate-500"><Droplets className="h-3.5 w-3.5" />{item.ecosystem} · {item.tier}</div><h2 className="mt-2 text-xl font-bold">{item.name}</h2></div>
                <span className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-sm font-bold text-violet-300">{item.opportunityScore}/100</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{item.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500"><ShieldCheck className="h-3.5 w-3.5" />{item.verificationStatus}</span>
                <Link href={`/airdrop/${item.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-violet-300 hover:text-violet-200">View guide <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}