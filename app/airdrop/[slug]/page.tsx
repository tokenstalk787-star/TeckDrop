import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getAirdrop } from "@/data/airdrops";
import { TaskChecklist } from "@/components/task-checklist";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getAirdrop(slug);
  return item
    ? { title: item.name, description: item.description }
    : { title: "Airdrop not found" };
}

export default async function AirdropDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getAirdrop(slug);
  if (!item) notFound();

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold">TeckDrop</Link>
          <Link href="/airdrops" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All opportunities
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />{item.verificationStatus}
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">{item.status}</span>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{item.name}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-400">{item.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[item.ecosystem, item.tier, item.difficulty, `${item.riskLevel} risk`].map((x) => (
                <span key={x} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300">{x}</span>
              ))}
            </div>
            <div className="mt-8"><TaskChecklist airdrop={item} /></div>
          </div>
          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-widest text-slate-500">Opportunity score</p>
            <div className="mt-2 text-5xl font-black text-violet-300">{item.opportunityScore}<span className="text-lg text-slate-600">/100</span></div>
            <div className="mt-5 border-t border-white/10 pt-5 text-sm text-slate-400">Estimated cost <strong className="text-slate-200">${item.estimatedCostUsd}</strong></div>
            <div className="mt-3 text-sm text-slate-400">Tasks <strong className="text-slate-200">{item.tasks.length}</strong></div>
            <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-200">Always verify links through official project channels before signing transactions or connecting a wallet.</div>
          </aside>
        </div>
      </section>
    </main>
  );
}