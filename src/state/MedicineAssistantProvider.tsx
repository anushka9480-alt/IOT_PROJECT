import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { analyzeMedicationAudio, analyzeMedicationImage } from '../services/gemini';
import { determineLogStatus } from '../services/evaluation';
import { fileUriToBase64 } from '../services/fileEncoding';
import {
  queueCaregiverAlert,
  saveLogRecord,
  saveMedicationRecord,
  saveRiskScore,
  saveUserRecord,
} from '../services/repository';
import { scheduleMedicationReminder } from '../services/reminders';
import { calculateRiskScore, deriveHistoryFactor } from '../services/riskScore';
import { speakMedicationReminder } from '../services/tts';
import type {
  CaregiverAlert,
  MedicationLog,
  MedicationSchedule,
  RiskScoreSnapshot,
  UserProfile,
  VerificationState,
} from '../types/domain';
import type { MedicationFormValues } from '../types/medication';

type MedicineAssistantContextValue = {
  user: UserProfile;
  medications: MedicationSchedule[];
  logs: MedicationLog[];
  latestLog: MedicationLog | null;
  riskScore: RiskScoreSnapshot;
  alertQueue: CaregiverAlert[];
  cameraState: VerificationState;
  voiceState: VerificationState;
  addMedication: (values: MedicationFormValues) => Promise<void>;
  triggerReminder: (medicationId: string) => Promise<void>;
  handleCapturedImage: (input: { base64: string; mimeType: string }) => Promise<void>;
  handleRecordedAudio: (input: { uri: string; mimeType: string }) => Promise<void>;
  markCurrentDoseMissed: () => Promise<void>;
};

const initialUser: UserProfile = {
  id: 'user-001',
  fullName: 'Asha Patel',
  age: 72,
  caregiverName: 'Ravi Patel',
  caregiverPhone: '+91-90000-00000',
  caregiverEmail: 'caregiver@example.com',
};

const initialRiskScore: RiskScoreSnapshot = {
  missedDoses: 0,
  totalDelayMinutes: 0,
  historyFactor: 0,
  score: 0,
  level: 'low',
};

const idleVerificationState: VerificationState = {
  status: 'idle',
  message: 'Waiting for verification input.',
  verified: false,
};

const MedicineAssistantContext = createContext<MedicineAssistantContextValue | null>(null);

function buildIdentifier(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function MedicineAssistantProvider({ children }: PropsWithChildren) {
  const [medications, setMedications] = useState<MedicationSchedule[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScoreSnapshot>(initialRiskScore);
  const [alertQueue, setAlertQueue] = useState<CaregiverAlert[]>([]);
  const [cameraState, setCameraState] = useState<VerificationState>(idleVerificationState);
  const [voiceState, setVoiceState] = useState<VerificationState>(idleVerificationState);

  useEffect(() => {
    void saveUserRecord(initialUser);
  }, []);

  const latestLog = logs.length > 0 ? logs[0] : null;

  async function addMedication(values: MedicationFormValues) {
    const medication: MedicationSchedule = {
      id: buildIdentifier('med'),
      userId: initialUser.id,
      ...values,
    };

    setMedications((current) => [medication, ...current]);
    await saveMedicationRecord(medication);
  }

  async function triggerReminder(medicationId: string) {
    const medication = medications.find((entry) => entry.id === medicationId);

    if (!medication) {
      return;
    }

    const scheduledAt = new Date().toISOString();
    const reminderMessage = `It is time to take ${medication.name} ${medication.dosage}.`;
    const log: MedicationLog = {
      id: buildIdentifier('log'),
      medicationId: medication.id,
      userId: initialUser.id,
      scheduledAt,
      takenAt: null,
      status: 'pending',
      visionVerified: false,
      voiceVerified: false,
      delayMinutes: 0,
    };

    setLogs((current) => [log, ...current]);
    setCameraState({
      status: 'idle',
      message: 'Reminder triggered. Capture the pill image next.',
      verified: false,
    });
    setVoiceState({
      status: 'idle',
      message: 'Record the spoken confirmation next.',
      verified: false,
    });

    speakMedicationReminder(reminderMessage);
    await scheduleMedicationReminder({
      medicationId: medication.id,
      medicationName: medication.name,
      dosage: medication.dosage,
      scheduledAt,
    });
    await saveLogRecord(log);
  }

  async function updateLatestLog(partial: Partial<MedicationLog>) {
    if (!latestLog) {
      return;
    }

    const merged = { ...latestLog, ...partial };
    const status = determineLogStatus({
      visionVerified: merged.visionVerified,
      voiceVerified: merged.voiceVerified,
    });
    const finalizedLog: MedicationLog = {
      ...merged,
      status,
      takenAt: status === 'taken' ? new Date().toISOString() : merged.takenAt,
    };

    setLogs((current) => current.map((log, index) => (index === 0 ? finalizedLog : log)));
    await saveLogRecord(finalizedLog);
  }

  async function handleCapturedImage(input: { base64: string; mimeType: string }) {
    setCameraState({
      status: 'processing',
      message: 'Analyzing the pill image with Gemini...',
      verified: false,
    });

    const result = await analyzeMedicationImage(input);
    const verified = result.pill_detected && result.intake_verified;

    setCameraState({
      status: verified ? 'success' : 'failed',
      message: verified
        ? 'Gemini detected a pill image and verified likely intake.'
        : 'Gemini did not verify intake from the image.',
      verified,
    });

    await updateLatestLog({
      visionVerified: verified,
    });
  }

  async function handleRecordedAudio(input: { uri: string; mimeType: string }) {
    setVoiceState({
      status: 'processing',
      message: 'Analyzing the confirmation audio with Gemini...',
      verified: false,
    });

    const base64 = await fileUriToBase64(input.uri);
    const result = await analyzeMedicationAudio({
      base64,
      mimeType: input.mimeType,
    });

    setVoiceState({
      status: result.confirmed_intake ? 'success' : 'failed',
      message: result.confirmed_intake
        ? 'Gemini confirmed the spoken medication acknowledgment.'
        : 'Gemini did not confirm medication intake from the recording.',
      verified: result.confirmed_intake,
    });

    await updateLatestLog({
      voiceVerified: result.confirmed_intake,
    });
  }

  async function markCurrentDoseMissed() {
    if (!latestLog) {
      return;
    }

    const missedDoses = riskScore.missedDoses + 1;
    const totalDelayMinutes = riskScore.totalDelayMinutes + 30;
    const historyFactor = deriveHistoryFactor(missedDoses);
    const calculated = calculateRiskScore({
      missedDoses,
      delayMinutes: totalDelayMinutes,
      historyFactor,
      weight1: 1,
      weight2: 0.1,
      weight3: 1.5,
    });

    const nextRiskScore: RiskScoreSnapshot = {
      missedDoses,
      totalDelayMinutes,
      historyFactor,
      score: calculated.score,
      level: calculated.level,
    };

    const updatedLog: MedicationLog = {
      ...latestLog,
      status: 'missed',
      delayMinutes: 30,
    };

    const nextAlerts: CaregiverAlert[] = [
      {
        id: buildIdentifier('alert'),
        reason:
          nextRiskScore.level === 'high'
            ? 'High adherence risk reached after missed dose.'
            : 'Dose marked missed by the reminder workflow.',
        channel: nextRiskScore.level === 'high' ? 'push' : 'sms',
        createdAt: new Date().toLocaleString(),
      },
      ...alertQueue,
    ];

    setLogs((current) => current.map((log, index) => (index === 0 ? updatedLog : log)));
    setRiskScore(nextRiskScore);
    setAlertQueue(nextAlerts);

    await saveLogRecord(updatedLog);
    await saveRiskScore(initialUser, nextRiskScore);
    await queueCaregiverAlert({
      patientName: initialUser.fullName,
      caregiverName: initialUser.caregiverName,
      caregiverPhone: initialUser.caregiverPhone,
      caregiverEmail: initialUser.caregiverEmail,
      riskLevel: nextRiskScore.level,
      logStatus: updatedLog.status,
      reason: nextAlerts[0].reason,
    });
  }

  return (
    <MedicineAssistantContext.Provider
      value={{
        user: initialUser,
        medications,
        logs,
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
      }}
    >
      {children}
    </MedicineAssistantContext.Provider>
  );
}

export function useMedicineAssistant() {
  const value = useContext(MedicineAssistantContext);

  if (!value) {
    throw new Error('useMedicineAssistant must be used within MedicineAssistantProvider.');
  }

  return value;
}
