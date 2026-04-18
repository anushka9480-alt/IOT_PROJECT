import type { MedicationLogStatus } from '../types/domain';

export function determineLogStatus(input: {
  visionVerified: boolean;
  voiceVerified: boolean;
}): MedicationLogStatus {
  if (input.visionVerified && input.voiceVerified) {
    return 'taken';
  }

  return 'pending';
}
