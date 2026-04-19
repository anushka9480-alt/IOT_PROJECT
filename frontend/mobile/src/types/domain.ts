import type { MedicationFormValues } from './medication';

export type UserProfile = {
  id: string;
  fullName: string;
  age: number;
  caregiverName: string;
  caregiverPhone: string;
  caregiverEmail: string;
};

export type MedicationSchedule = MedicationFormValues & {
  id: string;
  userId: string;
  active: boolean;
  source: 'manual' | 'camera';
  notificationIds: string[];
};

export type MedicationLogStatus = 'pending' | 'taken' | 'missed';

export type MedicationLog = {
  id: string;
  medicationId: string;
  userId: string;
  scheduledAt: string;
  takenAt: string | null;
  status: MedicationLogStatus;
  visionVerified: boolean;
  voiceVerified: boolean;
  delayMinutes: number;
};

export type RiskScoreSnapshot = {
  missedDoses: number;
  totalDelayMinutes: number;
  historyFactor: number;
  score: number;
  level: 'low' | 'medium' | 'high';
};

export type VerificationState = {
  status: 'idle' | 'processing' | 'success' | 'failed';
  message: string;
  verified: boolean;
};

export type MedicationInsight = {
  detected: boolean;
  name: string;
  dosage: string;
  potency: string;
  purpose: string;
  whenToTake: string;
  frequency: string;
  courseDays: number;
  confidence: string;
  precautions: string[];
  summary: string;
  scheduleTime: string;
};

export type CaregiverAlert = {
  id: string;
  reason: string;
  channel: 'sms' | 'email' | 'push';
  createdAt: string;
};
