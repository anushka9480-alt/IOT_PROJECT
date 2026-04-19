import { Text, View } from 'react-native';

import type { MedicationInsight, MedicationLog, VerificationState } from '../../types/domain';
import { SectionCard } from '../common/SectionCard';

type VerificationSummaryCardProps = {
  latestLog: MedicationLog | null;
  cameraState: VerificationState;
  voiceState: VerificationState;
  insight: MedicationInsight | null;
};

export function VerificationSummaryCard({
  latestLog,
  cameraState,
  voiceState,
  insight,
}: VerificationSummaryCardProps) {
  return (
    <SectionCard
      title="AI Verification Summary"
      description="The photo scan identifies the medicine and the voice step confirms intake. When both succeed for the current dose, the log becomes taken."
    >
      <View style={{ gap: 10 }}>
        <Text style={{ color: '#40513B' }}>Photo scan: {cameraState.status}</Text>
        <Text style={{ color: '#40513B' }}>Voice confirmation: {voiceState.status}</Text>
        <Text style={{ color: '#40513B' }}>
          Latest medication status: {latestLog ? latestLog.status : 'none'}
        </Text>
        {insight?.detected ? (
          <Text style={{ color: '#40513B' }}>
            Identified medicine: {insight.name} ({insight.confidence} confidence)
          </Text>
        ) : null}
        <Text style={{ color: '#4F6F52', lineHeight: 21 }}>
          Risk is recalculated when the current dose is marked missed. Active medicine courses can
          be ended individually or together from the dashboard.
        </Text>
      </View>
    </SectionCard>
  );
}
