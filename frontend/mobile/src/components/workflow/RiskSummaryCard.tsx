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
      description="The score rises when doses are missed or delayed, helping caregivers spot when the course needs intervention."
    >
      <View style={{ gap: 10 }}>
        <Text style={{ color: '#40513B' }}>Missed doses: {riskScore.missedDoses}</Text>
        <Text style={{ color: '#40513B' }}>Total delay minutes: {riskScore.totalDelayMinutes}</Text>
        <Text style={{ color: '#40513B' }}>History factor: {riskScore.historyFactor}</Text>
        <Text style={{ color: '#152033', fontSize: 18, fontWeight: '700' }}>
          Score: {riskScore.score.toFixed(2)} ({riskScore.level.toUpperCase()})
        </Text>
      </View>
    </SectionCard>
  );
}
