import type {
  MedicationLog,
  MedicationSchedule,
  RiskScoreSnapshot,
  UserProfile,
} from '../types/domain';
import { apiRequest } from './serverApi';

export async function saveMedicationRecord(medication: MedicationSchedule) {
  await apiRequest('/medications', {
    method: 'POST',
    body: JSON.stringify({
      id: medication.id,
      userId: medication.userId,
      name: medication.name,
      dosage: medication.dosage,
      scheduleTime: medication.scheduleTime,
    }),
  });
}

export async function saveUserRecord(user: UserProfile) {
  await apiRequest('/users/upsert', {
    method: 'POST',
    body: JSON.stringify({
      id: user.id,
      fullName: user.fullName,
      age: user.age,
      caregiverName: user.caregiverName,
      caregiverPhone: user.caregiverPhone,
      caregiverEmail: user.caregiverEmail,
    }),
  });
}

export async function saveLogRecord(log: MedicationLog) {
  await apiRequest(`/logs/${log.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      id: log.id,
      userId: log.userId,
      medicationId: log.medicationId,
      scheduledAt: log.scheduledAt,
      takenAt: log.takenAt,
      status: log.status,
      visionVerified: log.visionVerified,
      voiceVerified: log.voiceVerified,
      delayMinutes: log.delayMinutes,
    }),
  });
}

export async function saveRiskScore(user: UserProfile, riskScore: RiskScoreSnapshot) {
  await apiRequest(`/risk-scores/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      userId: user.id,
      missedDoses: riskScore.missedDoses,
      totalDelayMinutes: riskScore.totalDelayMinutes,
      historyFactor: riskScore.historyFactor,
      score: riskScore.score,
      level: riskScore.level,
    }),
  });
}

export async function queueCaregiverAlert(payload: {
  patientName: string;
  caregiverName: string;
  caregiverPhone: string;
  caregiverEmail: string;
  riskLevel: 'low' | 'medium' | 'high';
  logStatus: 'pending' | 'taken' | 'missed';
  reason: string;
}) {
  await apiRequest('/caregiver-alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
