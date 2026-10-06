import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminAnalyticsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [total, verified, active, upcoming, warning, highRisk, deadlines, scores] = await Promise.all([
    prisma.airdrop.count(),
    prisma.airdrop.count({ where: { verificationStatus: "VERIFIED" } }),
    prisma.airdrop.count({ where: { status: "ACTIVE" } }),
    prisma.airdrop.count({ where: { status: "UPCOMING" } }),
    prisma.airdrop.count({ where: { OR: [{ status: "WARNING" }, { verificationStatus: "WARNING" }, { riskLevel: "HIGH" }, { riskLevel: "CRITICAL" }] } }),
    prisma.airdrop.count({ where: { OR: [{ riskLevel: "HIGH" }, { riskLevel: "CRITICAL" }] } }),
    prisma.airdrop.count({ where: { deadline: { not: null } } }),
    prisma.airdrop.aggregate({ _avg: { opportunityScore: true }, _max: { opportunityScore: true }, _min: { opportunityScore: true } }),
  ]);

  const metrics = [
    ["Total opportunities", total],
    ["Verified", verified],
    ["Active", active],
    ["Upcoming", upcoming],
    ["Risk/watch items", warning],
    ["High/Critical risk", highRisk],
    ["With deadline", deadlines],
    ["Average score", Math.round(scores._avg.opportunityScore || 0)],
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">Intelligence operations</p>
      <h1 className="mt-3 text-4xl font-black">Content & intelligence analytics</h1>
      <p className="mt-2 text-slate-500">Health metrics for the TeckDrop opportunity database.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-3xl font-black">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </article>
        ))}
      </div>
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-bold">Score range</h2>
        <p className="mt-2 text-sm text-slate-500">
          Current database score range: {Math.round(scores._min.opportunityScore || 0)}–{Math.round(scores._max.opportunityScore || 0)}.
          Scores are calculated from the intelligence factors stored with each opportunity.
        </p>
      </section>
    </main>
  );
}
