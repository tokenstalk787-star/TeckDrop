import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "EVM", slug: "evm", description: "Ethereum Virtual Machine ecosystems." },
    { name: "Solana", slug: "solana", description: "Solana ecosystem opportunities." },
    { name: "DeFi", slug: "defi", description: "DeFi protocols and campaigns." },
    { name: "Infrastructure", slug: "infrastructure", description: "Developer and blockchain infrastructure." },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const demo = await prisma.airdrop.upsert({
    where: { slug: "demo-verified-opportunity" },
    update: {},
    create: {
      name: "Demo Verified Opportunity",
      slug: "demo-verified-opportunity",
      description: "Demo record for local development. Replace with an officially verified opportunity before production.",
      shortDescription: "Safe placeholder for development.",
      ecosystem: "EVM",
      tier: "Tier 1",
      status: "ACTIVE",
      verificationStatus: "VERIFIED",
      opportunityScore: 89,
      rewardPotential:95, effortScore:65, costScore:90, riskScore:95, longevityScore:85, verificationConfidence:95, verificationNotes:"Development placeholder only; production records must cite official evidence.",
      difficulty: "MEDIUM",
      riskLevel: "LOW",
      estimatedCostUsd: 2,
      lastVerifiedAt: new Date(),
      tasks: {
        create: [
          { title: "Visit the official project", description: "Review the current official campaign.", order: 1, required: true, difficulty: "EASY", estimatedMinutes: 3 },
          { title: "Complete the campaign task", description: "Complete only tasks confirmed by the official source.", order: 2, required: true, difficulty: "MEDIUM", estimatedMinutes: 10 },
          { title: "Save proof of completion", description: "Keep transaction hashes or screenshots when appropriate.", order: 3, required: false, difficulty: "EASY", estimatedMinutes: 5 },
        ],
      },
    },
  });

  const evm = await prisma.category.findUniqueOrThrow({ where: { slug: "evm" } });
  await prisma.airdropCategory.upsert({
    where: { airdropId_categoryId: { airdropId: demo.id, categoryId: evm.id } },
    update: {},
    create: { airdropId: demo.id, categoryId: evm.id },
  });

  console.log("TeckDrop seed complete:", demo.slug);
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());