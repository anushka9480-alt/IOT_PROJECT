import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

import type { VerificationState } from '../types/domain';

type VoiceVerificationScreenProps = {
  result: VerificationState;
  onRecorded: (input: { uri: string; mimeType: string }) => Promise<void>;
};

export function VoiceVerificationScreen({
  result,
  onRecorded,
}: VoiceVerificationScreenProps) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function prepareAudio() {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      setPermissionGranted(permission.granted);

      if (permission.granted) {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      }
    }

    void prepareAudio();
  }, []);

  async function handleToggleRecording() {
    if (!permissionGranted || busy) {
      return;
    }

    setBusy(true);

    try {
      if (recorderState.isRecording) {
        await recorder.stop();

        if (recorder.uri) {
          await onRecorded({
            uri: recorder.uri,
            mimeType: 'audio/m4a',
          });
        }
      } else {
        await recorder.prepareToRecordAsync();
        recorder.record();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', color: '#163020' }}>
        Phase 4: Voice Acknowledgment
      </Text>
      <Text style={{ marginTop: 10, fontSize: 15, lineHeight: 22, color: '#40513B' }}>
        Record a short confirmation such as "I took my medicine" or "Done". The audio is sent to
        Gemini for a strict JSON confirmation response.
      </Text>

      <TouchableOpacity
        onPress={handleToggleRecording}
        style={{
          marginTop: 16,
          borderRadius: 14,
          backgroundColor: recorderState.isRecording ? '#A94438' : '#163020',
          paddingVertical: 14,
          alignItems: 'center',
        }}
      >
        {busy ? (
          <ActivityIndicator color="#F5F6EF" />
        ) : (
          <Text style={{ color: '#F5F6EF', fontWeight: '600' }}>
            {recorderState.isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={{ marginTop: 14, color: '#40513B' }}>
        Microphone permission: {permissionGranted ? 'granted' : 'pending'}
      </Text>
      <Text style={{ marginTop: 6, color: '#40513B' }}>
        Recording: {recorderState.isRecording ? 'live' : 'idle'}
      </Text>
      <Text style={{ marginTop: 6, color: '#4F6F52', lineHeight: 21 }}>{result.message}</Text>
    </View>
  );
}
