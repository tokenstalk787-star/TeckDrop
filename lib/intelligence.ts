export type IntelligenceFactors = {
  rewardPotential: number;
  effortScore: number;
  costScore: number;
  riskScore: number;
  longevityScore: number;
  verificationConfidence: number;
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateOpportunityScore(factors: IntelligenceFactors) {
  const score =
    factors.rewardPotential * 0.25 +
    factors.effortScore * 0.15 +
    factors.costScore * 0.15 +
    factors.riskScore * 0.20 +
    factors.longevityScore * 0.10 +
    factors.verificationConfidence * 0.15;
  return clamp(score);
}

export function getScoreLabel(score: number) {
  if (score >= 85) return "Exceptional";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Watch";
  if (score >= 40) return "Speculative";
  return "Low conviction";
}
