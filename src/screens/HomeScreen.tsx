import { ScrollView, Text, View } from 'react-native';

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
  const {
    medications,
    latestLog,
    riskScore,
    alertQueue,
    cameraState,
    voiceState,
    addMedication,
    triggerReminder,
    handleCapturedImage,
    handleRecordedAudio,
    markCurrentDoseMissed,
  } = useMedicineAssistant();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F5F6EF' }}
      contentContainerStyle={{ padding: 20, gap: 18 }}
    >
      <View
        style={{
          backgroundColor: '#163020',
          borderRadius: 24,
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 30, fontWeight: '700', color: '#F5F6EF' }}>{appCopy.title}</Text>
        <Text style={{ marginTop: 12, fontSize: 15, lineHeight: 23, color: '#D6E7D8' }}>
          {appCopy.subtitle}
        </Text>
        <Text style={{ marginTop: 12, fontSize: 13, lineHeight: 21, color: '#B6CDBD' }}>
          The app flow follows the to-do list: schedule medication, trigger reminder, verify with
          camera and voice, update log state, recalculate risk, and queue caregiver alerts.
        </Text>
      </View>

      <ScheduleScreen />
      <MedicationForm onSubmit={addMedication} />
      <ReminderPanel
        medications={medications}
        latestLog={latestLog}
        onTriggerReminder={triggerReminder}
        onMarkMissed={markCurrentDoseMissed}
      />
      <CameraVerificationScreen result={cameraState} onCapture={handleCapturedImage} />
      <VoiceVerificationScreen result={voiceState} onRecorded={handleRecordedAudio} />
      <VerificationSummaryCard
        latestLog={latestLog}
        cameraState={cameraState}
        voiceState={voiceState}
      />
      <RiskSummaryCard riskScore={riskScore} />
      <AlertQueueCard alerts={alertQueue} />
    </ScrollView>
  );
}
