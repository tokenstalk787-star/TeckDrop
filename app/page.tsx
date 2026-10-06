import Link from "next/link";
import { ArrowRight, CalendarClock, CheckCircle2, Search, ShieldCheck, Target } from "lucide-react";
import { SiteHeader } from "@/components/site-header";\nimport { getAirdrops } from "@/lib/airdrops";

const features = [
  { icon: Search, title: "Discover", text: "Find promising airdrops and opportunities in one focused dashboard." },
  { icon: ShieldCheck, title: "Verify", text: "Separate verified opportunities from rumors, warnings, and unconfirmed claims." },
  { icon: Target, title: "Track", text: "Turn complicated farming guides into clear, actionable task checklists." },
  { icon: CalendarClock, title: "Never miss", text: "Keep snapshots, deadlines, and important dates visible before they pass." },
];

export default async function HomePage() {\n  const airdrops = await getAirdrops();\n  const verified = airdrops.filter((item) => item.verificationStatus === "VERIFIED").length;\n  const active = airdrops.filter((item) => item.status === "ACTIVE").length;\n  const averageScore = airdrops.length ? Math.round(airdrops.reduce((sum, item) => sum + item.opportunityScore, 0) / airdrops.length) : 0;
  return <main className="min-h-screen">
    <SiteHeader />
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
      <div className="max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-sm text-violet-200"><CheckCircle2 className="h-4 w-4" />Built for serious hunters</div>
        <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">Find. Verify. Track. <span className="text-violet-400">Farm.</span></h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">TeckDrop turns scattered airdrop information into verified opportunities, practical task guides, and a system that helps you know what to do next.</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/airdrops" className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400">Explore opportunities <ArrowRight className="h-4 w-4" /></Link>
          <Link href="/dashboard" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-200 transition hover:bg-white/10">Open dashboard</Link>
        </div>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">\n        <HomeStat label="Published opportunities" value={airdrops.length} />\n        <HomeStat label="Verified" value={verified} />\n        <HomeStat label="Active" value={active} />\n        <HomeStat label="Average intelligence score" value={averageScore} />\n      </div>\n      <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><Icon className="h-6 w-6 text-violet-400" /><h2 className="mt-5 text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}
      </div>
    </section>
  </main>;
}