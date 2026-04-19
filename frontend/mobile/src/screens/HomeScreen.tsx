import { ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { MedicationForm } from '../components/medication/MedicationForm';
import { AlertQueueCard } from '../components/workflow/AlertQueueCard';
import { ReminderPanel } from '../components/workflow/ReminderPanel';
import { RiskSummaryCard } from '../components/workflow/RiskSummaryCard';
import { VerificationSummaryCard } from '../components/workflow/VerificationSummaryCard';
import { appCopy } from '../lib/constants';
import { useMedicineAssistant } from '../state/MedicineAssistantProvider';
import { CameraVerificationScreen } from './CameraVerificationScreen';
import { ScheduleScreen } from './ScheduleScreen';
import { VoiceVerificationScreen } from './VoiceVerificationScreen';

export function HomeScreen() {
  const { width } = useWindowDimensions();
  const padding = width < 380 ? 14 : width < 480 ? 18 : 24;
  const {
    activeMedications,
    medications,
    identifiedMedication,
    latestLog,
    riskScore,
    alertQueue,
    cameraState,
    voiceState,
    addMedication,
    addIdentifiedMedicationToCourse,
    triggerReminder,
    handleCapturedImage,
    handleRecordedAudio,
    markCurrentDoseMissed,
    removeMedication,
    endMedicationCourse,
    endAllCourses,
    clearIdentifiedMedication,
  } = useMedicineAssistant();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#F5F7FB',
      }}
      contentContainerStyle={{ padding, gap: 18, paddingBottom: 28 }}
    >
      <View
        style={{
          backgroundColor: '#152033',
          borderRadius: 30,
          padding: padding + 2,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -80,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: 999,
            backgroundColor: '#2F80ED',
            opacity: 0.22,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -60,
            left: -20,
            width: 150,
            height: 150,
            borderRadius: 999,
            backgroundColor: '#00A86B',
            opacity: 0.16,
          }}
        />
        <Text style={{ fontSize: width < 380 ? 27 : 32, fontWeight: '800', color: '#F8FBFF' }}>
          {appCopy.title}
        </Text>
        <Text style={{ marginTop: 12, fontSize: 15, lineHeight: 23, color: '#D6E4FF' }}>
          {appCopy.subtitle}
        </Text>

        <View
          style={{
            marginTop: 18,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {[
            `${activeMedications.length} active courses`,
            `${alertQueue.length} caregiver alerts`,
            cameraState.verified ? 'AI scan ready' : 'Ready to scan',
          ].map((badge) => (
            <View
              key={badge}
              style={{
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.12)',
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: '#F8FBFF', fontWeight: '600' }}>{badge}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScheduleScreen />
      <CameraVerificationScreen
        result={cameraState}
        insight={identifiedMedication}
        onCapture={handleCapturedImage}
        onAddToCourse={addIdentifiedMedicationToCourse}
        onClearInsight={clearIdentifiedMedication}
      />
      <MedicationForm onSubmit={addMedication} suggestion={identifiedMedication} />
      <ReminderPanel
        medications={medications}
        latestLog={latestLog}
        onTriggerReminder={triggerReminder}
        onMarkMissed={markCurrentDoseMissed}
        onRemoveMedication={removeMedication}
        onEndMedicationCourse={endMedicationCourse}
        onEndAllCourses={endAllCourses}
      />
      <VoiceVerificationScreen result={voiceState} onRecorded={handleRecordedAudio} />
      <VerificationSummaryCard
        latestLog={latestLog}
        cameraState={cameraState}
        voiceState={voiceState}
        insight={identifiedMedication}
      />
      <RiskSummaryCard riskScore={riskScore} />
      <AlertQueueCard alerts={alertQueue} />
    </ScrollView>
  );
}
