import type { Metadata } from "next";
import { CheckCircle2, Clock3, ShieldCheck, Target } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { airdrops } from "@/data/airdrops";

export const metadata: Metadata = {
  title: "Hunter Dashboard",
  description: "Your TeckDrop airdrop hunting overview.",
};

export default function DashboardPage() {
  const verified = airdrops.filter((x) => x.verificationStatus === "VERIFIED").length;
  const active = airdrops.filter((x) => x.status === "ACTIVE").length;
  const totalTasks = airdrops.reduce((sum, x) => sum + x.tasks.length, 0);

  const stats = [
    { label: "Tracked opportunities", value: airdrops.length, icon: Target },
    { label: "Verified", value: verified, icon: ShieldCheck },
    { label: "Active", value: active, icon: Clock3 },
    { label: "Available tasks", value: totalTasks, icon: CheckCircle2 },
  ];

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Hunter OS</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Your dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-400">A simple command center for the opportunities you want to investigate and farm.</p>
          </div>
          <Link href="/airdrops" className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-400">Browse directory</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Icon className="h-5 w-5 text-violet-400" />
              <p className="mt-5 text-3xl font-black">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">Start here</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Open an opportunity, review its verification and risk level, then use the task checklist. Progress is currently stored locally in your browser.</p>
          <Link href="/airdrops" className="mt-5 inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5">Open opportunities →</Link>
        </div>
      </section>
    </main>
  );
}