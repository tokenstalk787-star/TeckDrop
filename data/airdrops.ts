export type VerificationStatus = "VERIFIED" | "UNVERIFIED" | "WARNING";
export type Airdrop = {
  slug: string; name: string; ecosystem: string; tier: string;
  status: "ACTIVE" | "UPCOMING" | "WARNING";
  verificationStatus: VerificationStatus; opportunityScore: number;
  difficulty: "EASY" | "MEDIUM" | "HARD"; riskLevel: "LOW" | "MEDIUM" | "HIGH";
  estimatedCostUsd: number; description: string;
  rewardPotential: number; effortScore: number; costScore: number; riskScore: number; longevityScore: number; verificationConfidence: number; verificationNotes: string | null;
  snapshotDate: Date | null; deadline: Date | null; websiteUrl: string | null; twitterUrl: string | null; discordUrl: string | null;
  tasks: { id: string; title: string; description: string; estimatedMinutes: number; required: boolean }[];
};
export const airdrops: Airdrop[] = [
  {
    slug:"demo-verified-opportunity", name:"Demo Verified Opportunity", ecosystem:"EVM", tier:"Tier 1",
    status:"ACTIVE", verificationStatus:"VERIFIED", opportunityScore:91, difficulty:"MEDIUM", riskLevel:"LOW", estimatedCostUsd:2,
    description:"A demonstration opportunity used by TeckDrop while the live intelligence database is being built.",
    tasks:[
      {id:"demo-1",title:"Visit the official project",description:"Open the verified official project link and review the current campaign.",estimatedMinutes:3,required:true},
      {id:"demo-2",title:"Complete the campaign task",description:"Complete the task exactly as described by the official campaign.",estimatedMinutes:10,required:true},
      {id:"demo-3",title:"Save proof of completion",description:"Keep a transaction hash or screenshot when the campaign requires proof.",estimatedMinutes:5,required:false}
    ]
  },
  {
    slug:"demo-upcoming-opportunity", name:"Demo Upcoming Opportunity", ecosystem:"Solana", tier:"Tier 2",
    status:"UPCOMING", verificationStatus:"UNVERIFIED", opportunityScore:76, difficulty:"EASY", riskLevel:"MEDIUM", estimatedCostUsd:0,
    description:"A placeholder opportunity demonstrating how TeckDrop will handle upcoming campaigns.",
    tasks:[
      {id:"demo-4",title:"Monitor official announcements",description:"Check official channels before taking any action.",estimatedMinutes:5,required:true},
      {id:"demo-5",title:"Prepare a wallet",description:"Use a dedicated wallet only when the official campaign requires one.",estimatedMinutes:5,required:false}
    ]
  }
];
export function getAirdrop(slug:string){ return airdrops.find((item)=>item.slug===slug); }