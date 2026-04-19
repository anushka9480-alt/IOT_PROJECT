import { Text, View } from 'react-native';

import type { MedicationLog, MedicationSchedule } from '../../types/domain';
import { formatDateLabel, formatTimeLabel } from '../../utils/date';
import { PrimaryButton } from '../common/PrimaryButton';
import { SectionCard } from '../common/SectionCard';

type ReminderPanelProps = {
  medications: MedicationSchedule[];
  latestLog: MedicationLog | null;
  onTriggerReminder: (medicationId: string) => Promise<void>;
  onMarkMissed: () => Promise<void>;
  onRemoveMedication: (medicationId: string) => Promise<void>;
  onEndMedicationCourse: (medicationId: string) => Promise<void>;
  onEndAllCourses: () => Promise<void>;
};

export function ReminderPanel({
  medications,
  latestLog,
  onTriggerReminder,
  onMarkMissed,
  onRemoveMedication,
  onEndMedicationCourse,
  onEndAllCourses,
}: ReminderPanelProps) {
  const activeMedications = medications.filter((medication) => medication.active);
  const archivedMedications = medications.filter((medication) => !medication.active);

  return (
    <SectionCard
      title="Course Dashboard"
      description="Repeated reminders run for each active medicine until its course end date. You can remove one medicine or end the whole course at any time."
    >
      <View style={{ gap: 14 }}>
        {activeMedications.length === 0 ? (
          <Text style={{ color: '#5B667A' }}>
            Scan or add a medicine above to create an active course.
          </Text>
        ) : (
          activeMedications.map((medication) => (
            <View
              key={medication.id}
              style={{
                borderRadius: 20,
                backgroundColor: '#F8FBFF',
                padding: 16,
                gap: 10,
                borderWidth: 1,
                borderColor: '#D8E1EF',
              }}
            >
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#152033' }}>
                  {medication.name}
                </Text>
                <Text style={{ color: '#4C5A70' }}>
                  {medication.dosage} • {medication.whenToTake || medication.frequency}
                </Text>
                <Text style={{ color: '#5B667A' }}>{medication.purpose}</Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  `Reminder ${medication.scheduleTime}`,
                  `Ends ${formatDateLabel(medication.courseEndDate)}`,
                  medication.source === 'camera' ? 'AI identified' : 'Manual entry',
                ].map((badge) => (
                  <View
                    key={badge}
                    style={{
                      borderRadius: 999,
                      backgroundColor: '#EAF1FF',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                    }}
                  >
                    <Text style={{ color: '#284165', fontWeight: '600' }}>{badge}</Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <PrimaryButton onPress={() => void onTriggerReminder(medication.id)}>
                    Trigger Reminder
                  </PrimaryButton>
                </View>
                <View style={{ flex: 1 }}>
                  <PrimaryButton onPress={() => void onEndMedicationCourse(medication.id)} tone="secondary">
                    End Course
                  </PrimaryButton>
                </View>
              </View>

              <PrimaryButton onPress={() => void onRemoveMedication(medication.id)} tone="danger">
                Remove From Course
              </PrimaryButton>
            </View>
          ))
        )}

        {activeMedications.length > 0 ? (
          <PrimaryButton onPress={() => void onEndAllCourses()} tone="secondary">
            End Whole Course
          </PrimaryButton>
        ) : null}

        {latestLog ? (
          <View
            style={{
              borderRadius: 18,
              backgroundColor: '#FFF6DF',
              padding: 16,
              borderWidth: 1,
              borderColor: '#F1D38A',
              gap: 8,
            }}
          >
            <Text style={{ fontWeight: '700', color: '#8B6A00' }}>
              Latest dose: {latestLog.status.toUpperCase()}
            </Text>
            <Text style={{ color: '#7A6200' }}>
              Scheduled at {formatTimeLabel(latestLog.scheduledAt)}
            </Text>
            <Text style={{ color: '#7A6200' }}>
              Photo verified: {latestLog.visionVerified ? 'yes' : 'no'} • Voice verified:{' '}
              {latestLog.voiceVerified ? 'yes' : 'no'}
            </Text>
            <PrimaryButton onPress={() => void onMarkMissed()} tone="danger">
              Mark Current Dose Missed
            </PrimaryButton>
          </View>
        ) : null}

        {archivedMedications.length > 0 ? (
          <View style={{ gap: 10 }}>
            <Text style={{ color: '#152033', fontWeight: '700' }}>Ended courses</Text>
            {archivedMedications.map((medication) => (
              <View
                key={medication.id}
                style={{
                  borderRadius: 16,
                  backgroundColor: '#F3F5F9',
                  padding: 14,
                }}
              >
                <Text style={{ color: '#41506A', fontWeight: '700' }}>{medication.name}</Text>
                <Text style={{ color: '#6A7486', marginTop: 4 }}>
                  Ended on {formatDateLabel(medication.courseEndDate)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}
