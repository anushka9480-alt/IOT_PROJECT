import * as Speech from 'expo-speech';

export function speakMedicationReminder(message: string) {
  Speech.speak(message, {
    language: 'en-US',
    pitch: 1,
    rate: 0.95,
  });
}
