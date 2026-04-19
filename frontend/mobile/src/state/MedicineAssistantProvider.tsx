import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { analyzeMedicationAudio, analyzeMedicationImage } from '../services/gemini';
import { determineLogStatus } from '../services/evaluation';
import { fileUriToBase64 } from '../services/fileEncoding';
import {
  deleteMedicationRecord,
  queueCaregiverAlert,
  saveLogRecord,
  saveMedicationRecord,
  saveRiskScore,
  saveUserRecord,
} from '../services/repository';
import {
  cancelMedicationReminders,
  scheduleMedicationCourse,
  scheduleMedicationReminder,
} from '../services/reminders';
import { calculateRiskScore, deriveHistoryFactor } from '../services/riskScore';
import { speakMedicationReminder } from '../services/tts';
import type {
  CaregiverAlert,
  MedicationInsight,
  MedicationLog,
  MedicationSchedule,
  RiskScoreSnapshot,
  UserProfile,
  VerificationState,
} from '../types/domain';
import type { MedicationFormValues } from '../types/medication';
import { addDaysToDate, todayDateString } from '../utils/date';

type MedicineAssistantContextValue = {
  user: UserProfile;
  medications: MedicationSchedule[];
  activeMedications: MedicationSchedule[];
  identifiedMedication: MedicationInsight | null;
  logs: MedicationLog[];
  latestLog: MedicationLog | null;
  riskScore: RiskScoreSnapshot;
  alertQueue: CaregiverAlert[];
  cameraState: VerificationState;
  voiceState: VerificationState;
  addMedication: (values: MedicationFormValues, source?: 'manual' | 'camera') => Promise<void>;
  addIdentifiedMedicationToCourse: () => Promise<void>;
  triggerReminder: (medicationId: string) => Promise<void>;
  handleCapturedImage: (input: { base64: string; mimeType: string }) => Promise<void>;
  handleRecordedAudio: (input: { uri: string; mimeType: string }) => Promise<void>;
  markCurrentDoseMissed: () => Promise<void>;
  removeMedication: (medicationId: string) => Promise<void>;
  endMedicationCourse: (medicationId: string) => Promise<void>;
  endAllCourses: () => Promise<void>;
  clearIdentifiedMedication: () => void;
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

function normalizeMedicationValues(values: MedicationFormValues): MedicationFormValues {
  const startDate = values.courseStartDate || todayDateString();
  const endDate = values.courseEndDate || startDate;

  return {
    name: values.name.trim(),
    dosage: values.dosage.trim(),
    scheduleTime: values.scheduleTime || '08:00',
    purpose: values.purpose.trim(),
    potency: values.potency.trim(),
    whenToTake: values.whenToTake.trim(),
    frequency: values.frequency.trim(),
    courseStartDate: startDate,
    courseEndDate: endDate >= startDate ? endDate : startDate,
  };
}

export function MedicineAssistantProvider({ children }: PropsWithChildren) {
  const [medications, setMedications] = useState<MedicationSchedule[]>([]);
  const [identifiedMedication, setIdentifiedMedication] = useState<MedicationInsight | null>(null);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [riskScore, setRiskScore] = useState<RiskScoreSnapshot>(initialRiskScore);
  const [alertQueue, setAlertQueue] = useState<CaregiverAlert[]>([]);
  const [cameraState, setCameraState] = useState<VerificationState>(idleVerificationState);
  const [voiceState, setVoiceState] = useState<VerificationState>(idleVerificationState);

  useEffect(() => {
    void saveUserRecord(initialUser);
  }, []);

  const latestLog = logs.length > 0 ? logs[0] : null;
  const activeMedications = useMemo(
    () => medications.filter((medication) => medication.active),
    [medications],
  );

  async function persistMedication(medication: MedicationSchedule) {
    try {
      await saveMedicationRecord(medication);
    } catch {
      // Keep the demo responsive even when the backend is unavailable.
    }
  }

  async function createMedication(
    values: MedicationFormValues,
    source: 'manual' | 'camera',
  ): Promise<MedicationSchedule> {
    const normalized = normalizeMedicationValues(values);
    const medicationId = buildIdentifier('med');
    const notificationIds = await scheduleMedicationCourse({
      medicationId,
      medicationName: normalized.name,
      dosage: normalized.dosage,
      scheduleTime: normalized.scheduleTime,
      courseStartDate: normalized.courseStartDate,
      courseEndDate: normalized.courseEndDate,
    });

    const medication: MedicationSchedule = {
      id: medicationId,
      userId: initialUser.id,
      ...normalized,
      active: true,
      source,
      notificationIds,
    };

    setMedications((current) => [medication, ...current]);
    await persistMedication(medication);
    return medication;
  }

  async function addMedication(values: MedicationFormValues, source: 'manual' | 'camera' = 'manual') {
    await createMedication(values, source);
  }

  async function addIdentifiedMedicationToCourse() {
    if (!identifiedMedication?.detected) {
      return;
    }

    const today = todayDateString();
    const courseEndDate = addDaysToDate(today, Math.max(identifiedMedication.courseDays, 1) - 1);

    await createMedication(
      {
        name: identifiedMedication.name || 'Unknown medicine',
        dosage: identifiedMedication.dosage || identifiedMedication.potency || 'Check label',
        scheduleTime: identifiedMedication.scheduleTime || '08:00',
        purpose: identifiedMedication.purpose || identifiedMedication.summary,
        potency: identifiedMedication.potency || identifiedMedication.dosage,
        whenToTake: identifiedMedication.whenToTake || 'Follow clinician guidance',
        frequency: identifiedMedication.frequency || 'Daily',
        courseStartDate: today,
        courseEndDate,
      },
      'camera',
    );

    setIdentifiedMedication(null);
    setCameraState({
      status: 'success',
      message: 'Medicine added to the course with scheduled reminders until the end date.',
      verified: true,
    });
  }

  async function triggerReminder(medicationId: string) {
    const medication = activeMedications.find((entry) => entry.id === medicationId);

    if (!medication) {
      return;
    }

    const scheduledAt = new Date().toISOString();
    const reminderMessage = `It is time to take ${medication.name} ${medication.dosage}. ${medication.whenToTake}`;
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
      message: 'Reminder triggered. Capture the medicine photo for AI recognition.',
      verified: false,
    });
    setVoiceState({
      status: 'idle',
      message: 'Record the spoken confirmation when the dose is taken.',
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
      message: 'Analyzing the medicine photo with Gemini...',
      verified: false,
    });

    const result = await analyzeMedicationImage(input);
    const insight: MedicationInsight = {
      detected: result.detected,
      name: result.name,
      dosage: result.dosage,
      potency: result.potency,
      purpose: result.purpose,
      whenToTake: result.when_to_take,
      frequency: result.frequency,
      courseDays: Math.max(result.course_days || 0, 0),
      confidence: result.confidence,
      precautions: result.precautions ?? [],
      summary: result.summary,
      scheduleTime: result.schedule_time || '08:00',
    };

    setIdentifiedMedication(insight.detected ? insight : null);
    setCameraState({
      status: insight.detected ? 'success' : 'failed',
      message: insight.detected
        ? `Gemini identified ${insight.name || 'the medicine'} and generated usage guidance.`
        : insight.summary || 'Gemini could not confidently identify the medicine.',
      verified: insight.detected,
    });

    await updateLatestLog({
      visionVerified: insight.detected,
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

  async function removeMedication(medicationId: string) {
    const medication = medications.find((entry) => entry.id === medicationId);

    if (!medication) {
      return;
    }

    await cancelMedicationReminders(medication.notificationIds);
    setMedications((current) => current.filter((entry) => entry.id !== medicationId));

    try {
      await deleteMedicationRecord(medicationId);
    } catch {
      // Ignore backend delete failures in local/demo mode.
    }
  }

  async function endMedicationCourse(medicationId: string) {
    const medication = medications.find((entry) => entry.id === medicationId);

    if (!medication) {
      return;
    }

    await cancelMedicationReminders(medication.notificationIds);
    setMedications((current) =>
      current.map((entry) =>
        entry.id === medicationId
          ? { ...entry, active: false, notificationIds: [], courseEndDate: todayDateString() }
          : entry,
      ),
    );
  }

  async function endAllCourses() {
    await Promise.all(activeMedications.map((medication) => cancelMedicationReminders(medication.notificationIds)));
    setMedications((current) =>
      current.map((entry) =>
        entry.active
          ? { ...entry, active: false, notificationIds: [], courseEndDate: todayDateString() }
          : entry,
      ),
    );
  }

  function clearIdentifiedMedication() {
    setIdentifiedMedication(null);
    setCameraState(idleVerificationState);
  }

  return (
    <MedicineAssistantContext.Provider
      value={{
        user: initialUser,
        medications,
        activeMedications,
        identifiedMedication,
        logs,
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
