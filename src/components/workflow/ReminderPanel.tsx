import { Text, View } from 'react-native';

import type { MedicationLog, MedicationSchedule } from '../../types/domain';
import { formatTimeLabel } from '../../utils/date';
import { PrimaryButton } from '../common/PrimaryButton';
import { SectionCard } from '../common/SectionCard';

type ReminderPanelProps = {
  medications: MedicationSchedule[];
  latestLog: MedicationLog | null;
  onTriggerReminder: (medicationId: string) => Promise<void>;
  onMarkMissed: () => Promise<void>;
};

export function ReminderPanel({
  medications,
  latestLog,
  onTriggerReminder,
  onMarkMissed,
}: ReminderPanelProps) {
  return (
    <SectionCard
      title="Reminder Engine"
      description="Phase 2 Steps 6-7 and Phase 5 logic start here: trigger a reminder, play TTS, and open verification."
    >
      <View style={{ gap: 12 }}>
        {medications.length === 0 ? (
          <Text style={{ color: '#40513B' }}>Add a medication above to start the reminder flow.</Text>
        ) : (
          medications.map((medication) => (
            <View
              key={medication.id}
              style={{
                borderRadius: 16,
                backgroundColor: '#F6FAF4',
                padding: 16,
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#163020' }}>
                {medication.name}
              </Text>
              <Text style={{ color: '#40513B' }}>{medication.dosage}</Text>
              <Text style={{ color: '#4F6F52' }}>Reminder time: {medication.scheduleTime}</Text>
              <PrimaryButton onPress={() => void onTriggerReminder(medication.id)}>
                Trigger Reminder
              </PrimaryButton>
            </View>
          ))
        )}

        {latestLog ? (
          <View style={{ borderRadius: 16, backgroundColor: '#FFF9E8', padding: 16 }}>
            <Text style={{ fontWeight: '600', color: '#8B6A00' }}>
              Latest log: {latestLog.status.toUpperCase()}
            </Text>
            <Text style={{ marginTop: 8, color: '#7A6200' }}>
              Scheduled at {formatTimeLabel(latestLog.scheduledAt)}
            </Text>
            <Text style={{ marginTop: 8, color: '#7A6200' }}>
              Vision verified: {latestLog.visionVerified ? 'yes' : 'no'} | Voice verified:{' '}
              {latestLog.voiceVerified ? 'yes' : 'no'}
            </Text>
            <View style={{ marginTop: 12 }}>
              <PrimaryButton onPress={() => void onMarkMissed()} tone="danger">
                Mark Current Dose Missed
              </PrimaryButton>
            </View>
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}
