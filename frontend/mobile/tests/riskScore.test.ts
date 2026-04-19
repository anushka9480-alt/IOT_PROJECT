import { describe, expect, it } from 'vitest';

import { calculateRiskScore, deriveHistoryFactor } from '../src/services/riskScore';

describe('risk scoring', () => {
  it('returns low risk for a small score', () => {
    const result = calculateRiskScore({
      missedDoses: 1,
      delayMinutes: 10,
      historyFactor: 1,
      weight1: 1,
      weight2: 0.1,
      weight3: 1.5,
    });

    expect(result.level).toBe('low');
  });

  it('returns high risk after repeated missed doses', () => {
    const historyFactor = deriveHistoryFactor(4);
    const result = calculateRiskScore({
      missedDoses: 4,
      delayMinutes: 120,
      historyFactor,
      weight1: 1,
      weight2: 0.1,
      weight3: 1.5,
    });

    expect(result.level).toBe('high');
  });
});
