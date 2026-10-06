import Link from "next/link";
import { ShieldCheck, Gauge, AlertTriangle, ListChecks } from "lucide-react";
import { getAirdrops } from "@/lib/airdrops";

const factors = [
  ["Reward potential", "25%", "How attractive the potential upside is relative to the opportunity."],
  ["Risk safety", "20%", "How safe the opportunity appears based on the current risk assessment."],
  ["Verification confidence", "15%", "How strong the evidence is behind the current verification status."],
  ["Effort efficiency", "15%", "How reasonable the required work is for a hunter."],
  ["Cost efficiency", "15%", "How favorable the expected cost is for the opportunity."],
  ["Longevity", "10%", "How durable and strategically useful the opportunity appears."],
];

export default async function IntelligencePage() {
  const items = await getAirdrops();
  const verified = items.filter((item) => item.verificationStatus === "VERIFIED").length;
  const average = items.length ? Math.round(items.reduce((sum, item) => sum + item.opportunityScore, 0) / items.length) : 0;

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-black">TeckDrop</Link>
          <Link href="/airdrops" className="text-sm text-slate-400 hover:text-white">Explore opportunities →</Link>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Intelligence center</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Know why an opportunity is worth your time.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
          TeckDrop separates evidence, effort, risk and opportunity quality instead of presenting every airdrop rumor as equal.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat icon={Gauge} label="Current average score" value={average} />
          <Stat icon={ShieldCheck} label="Verified opportunities" value={verified} />
          <Stat icon={ListChecks} label="Published opportunities" value={items.length} />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Opportunity score model</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {factors.map(([name, weight, description]) => (
              <article key={name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold">{name}</h3>
                  <span className="text-sm font-bold text-violet-300">{weight}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <Info icon={ShieldCheck} title="Verified" text="Evidence has been reviewed and the opportunity has a strong current source trail." />
          <Info icon={AlertTriangle} title="Warning" text="Risk or evidence concerns exist. Hunters should not treat the listing as confirmed." />
          <Info icon={ListChecks} title="Readiness" text="Guide readiness means your required TeckDrop tasks are complete; it is not a guarantee of on-chain eligibility." />
        </section>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: number }) {
  return <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Icon className="h-5 w-5 text-violet-400" /><p className="mt-4 text-3xl font-black">{value}</p><p className="mt-1 text-sm text-slate-500">{label}</p></article>;
}

function Info({ icon: Icon, title, text }: { icon: typeof Gauge; title: string; text: string }) {
  return <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Icon className="h-5 w-5 text-violet-400" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>;
}
