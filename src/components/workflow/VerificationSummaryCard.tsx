import { Text, View } from 'react-native';

import type { MedicationLog, VerificationState } from '../../types/domain';
import { SectionCard } from '../common/SectionCard';

type VerificationSummaryCardProps = {
  latestLog: MedicationLog | null;
  cameraState: VerificationState;
  voiceState: VerificationState;
};

export function VerificationSummaryCard({
  latestLog,
  cameraState,
  voiceState,
}: VerificationSummaryCardProps) {
  return (
    <SectionCard
      title="Phase 5: Core Logic"
      description="A log is marked taken only when both Gemini verifications succeed. Otherwise it stays pending until the dose is marked missed."
    >
      <View style={{ gap: 10 }}>
        <Text style={{ color: '#40513B' }}>Camera verification: {cameraState.status}</Text>
        <Text style={{ color: '#40513B' }}>Voice verification: {voiceState.status}</Text>
        <Text style={{ color: '#40513B' }}>
          Latest medication status: {latestLog ? latestLog.status : 'none'}
        </Text>
        <Text style={{ color: '#4F6F52', lineHeight: 21 }}>
          Risk is recalculated when the current dose is marked missed. A high-risk result queues
          caregiver alerts.
        </Text>
      </View>
    </SectionCard>
  );
}
