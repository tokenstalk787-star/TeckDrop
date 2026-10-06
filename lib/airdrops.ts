import { prisma } from "@/lib/prisma";
import type { Airdrop as PublicAirdrop } from "@/data/airdrops";
import { calculateOpportunityScore } from "@/lib/intelligence";

function toNumber(value: unknown) {
  return value == null ? 0 : Number(value);
}

export function mapAirdrop(item: {
  slug: string; name: string; ecosystem: string | null; tier: string | null;
  status: "ACTIVE" | "UPCOMING" | "ENDED" | "WARNING" | "RUMOR";
  verificationStatus: "VERIFIED" | "UNVERIFIED" | "COMMUNITY_REPORTED" | "WARNING";
  opportunityScore: number; difficulty: "EASY" | "MEDIUM" | "HARD";
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; estimatedCostUsd: unknown; description: string;
  rewardPotential: number; effortScore: number; costScore: number; riskScore: number; longevityScore: number; verificationConfidence: number; verificationNotes: string | null;
  snapshotDate: Date | null; deadline: Date | null; websiteUrl: string | null; twitterUrl: string | null; discordUrl: string | null;
  tasks: Array<{ id:string; title:string; description:string|null; taskUrl:string|null; estimatedMinutes:number|null; required:boolean }>;
}): PublicAirdrop {
  const verificationStatus = item.verificationStatus === "COMMUNITY_REPORTED" ? "WARNING" : item.verificationStatus;
  const status = item.status === "ENDED" || item.status === "RUMOR" ? "WARNING" : item.status;
  return {
    slug:item.slug, name:item.name, ecosystem:item.ecosystem || "Other", tier:item.tier || "Unranked",
    status, verificationStatus, opportunityScore:calculateOpportunityScore({rewardPotential:item.rewardPotential,effortScore:item.effortScore,costScore:item.costScore,riskScore:item.riskScore,longevityScore:item.longevityScore,verificationConfidence:item.verificationConfidence}), difficulty:item.difficulty,
    riskLevel:item.riskLevel === "CRITICAL" ? "HIGH" : item.riskLevel,
    estimatedCostUsd:toNumber(item.estimatedCostUsd), description:item.description,
    tasks:item.tasks.map(task=>({id:task.id,title:task.title,description:task.description||"",taskUrl:task.taskUrl||null,estimatedMinutes:task.estimatedMinutes||0,required:task.required}))
  };
}

export async function getAirdrops() {
  const rows = await prisma.airdrop.findMany({ include:{tasks:{orderBy:{order:"asc"}}}, orderBy:[{opportunityScore:"desc"},{updatedAt:"desc"}] });
  return rows.map(mapAirdrop);
}

export async function getAirdropBySlug(slug:string) {
  const row = await prisma.airdrop.findUnique({ where:{slug}, include:{tasks:{orderBy:{order:"asc"}}} });
  return row ? mapAirdrop(row) : undefined;
}

export async function getAdminAirdrops() {
  return prisma.airdrop.findMany({
    include:{tasks:{orderBy:{order:"asc"}},categories:{include:{category:true}}},
    orderBy:{updatedAt:"desc"}
  });
}
