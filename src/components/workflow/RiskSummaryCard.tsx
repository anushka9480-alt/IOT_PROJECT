import { Text, View } from 'react-native';

import type { RiskScoreSnapshot } from '../../types/domain';
import { SectionCard } from '../common/SectionCard';

type RiskSummaryCardProps = {
  riskScore: RiskScoreSnapshot;
};

export function RiskSummaryCard({ riskScore }: RiskSummaryCardProps) {
  return (
    <SectionCard
      title="Risk Score"
      description="Phase 5 uses the formula from the design doc: (Missed Doses × Weight1) + (Delay Time × Weight2) + (History Factor × Weight3)."
    >
      <View style={{ gap: 10 }}>
        <Text style={{ color: '#40513B' }}>Missed doses: {riskScore.missedDoses}</Text>
        <Text style={{ color: '#40513B' }}>Total delay minutes: {riskScore.totalDelayMinutes}</Text>
        <Text style={{ color: '#40513B' }}>History factor: {riskScore.historyFactor}</Text>
        <Text style={{ color: '#163020', fontSize: 18, fontWeight: '700' }}>
          Score: {riskScore.score.toFixed(2)} ({riskScore.level.toUpperCase()})
        </Text>
      </View>
    </SectionCard>
  );
}
