export type RiskLevel = 'low' | 'medium' | 'high';

export type RiskScoreInput = {
  missedDoses: number;
  delayMinutes: number;
  historyFactor: number;
  weight1?: number;
  weight2?: number;
  weight3?: number;
};

export type RiskScoreResult = {
  score: number;
  level: RiskLevel;
};

export function deriveHistoryFactor(missedCount: number) {
  if (missedCount >= 4) {
    return 6;
  }

  if (missedCount >= 2) {
    return 3;
  }

  return missedCount;
}

export function calculateRiskScore(input: RiskScoreInput): RiskScoreResult {
  const weight1 = input.weight1 ?? 1;
  const weight2 = input.weight2 ?? 1;
  const weight3 = input.weight3 ?? 1;

  const score =
    input.missedDoses * weight1 +
    input.delayMinutes * weight2 +
    input.historyFactor * weight3;

  let level: RiskLevel = 'low';

  if (score >= 15) {
    level = 'high';
  } else if (score >= 7) {
    level = 'medium';
  }

  return {
    score,
    level,
  };
}
