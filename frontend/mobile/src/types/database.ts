export type UserRecord = {
  id: string;
  full_name: string;
  age: number | null;
  caregiver_name: string | null;
  caregiver_phone: string | null;
  caregiver_email: string | null;
  created_at: string;
  updated_at: string;
};

export type MedicationRecord = {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  schedule_time: string;
  created_at: string;
  updated_at: string;
};

export type LogRecord = {
  id: string;
  user_id: string;
  medication_id: string;
  scheduled_at: string;
  taken_at: string | null;
  status: 'pending' | 'taken' | 'missed';
  vision_verified: boolean;
  voice_verified: boolean;
  delay_minutes: number;
  created_at: string;
};

export type RiskScoreRecord = {
  id: string;
  user_id: string;
  missed_doses: number;
  total_delay_minutes: number;
  history_factor: number;
  weight1: number;
  weight2: number;
  weight3: number;
  score: number;
  level: 'low' | 'medium' | 'high';
  updated_at: string;
};

