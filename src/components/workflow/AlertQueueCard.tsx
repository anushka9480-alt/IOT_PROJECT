import { Text, View } from 'react-native';

import type { CaregiverAlert } from '../../types/domain';
import { SectionCard } from '../common/SectionCard';

type AlertQueueCardProps = {
  alerts: CaregiverAlert[];
};

export function AlertQueueCard({ alerts }: AlertQueueCardProps) {
  return (
    <SectionCard
      title="Phase 6: Caregiver Notifications"
      description="Missed doses and high-risk scores queue caregiver alerts. The matching Prisma-backed backend endpoint is included in the workspace."
    >
      <View style={{ gap: 12 }}>
        {alerts.length === 0 ? (
          <Text style={{ color: '#40513B' }}>No caregiver alerts have been queued yet.</Text>
        ) : (
          alerts.map((alert) => (
            <View key={alert.id} style={{ borderRadius: 16, backgroundColor: '#FDEDEC', padding: 16 }}>
              <Text style={{ fontWeight: '600', color: '#A94438' }}>{alert.reason}</Text>
              <Text style={{ marginTop: 8, color: '#7A352C' }}>Channel: {alert.channel}</Text>
              <Text style={{ marginTop: 4, color: '#7A352C' }}>Queued at: {alert.createdAt}</Text>
            </View>
          ))
        )}
      </View>
    </SectionCard>
  );
}
