import { Text, View } from 'react-native';

export function ScheduleScreen() {
  return (
    <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', color: '#163020' }}>
        Phase 2: Scheduling & Reminders
      </Text>
      <Text style={{ marginTop: 12, fontSize: 15, lineHeight: 22, color: '#40513B' }}>
        Use the form below to add a medication name, dosage, and schedule time. Each record can
        trigger a local reminder, multilingual TTS playback, and a verification workflow.
      </Text>
    </View>
  );
}
