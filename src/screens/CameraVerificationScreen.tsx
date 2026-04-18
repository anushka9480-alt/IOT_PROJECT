import { useRef, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import type { VerificationState } from '../types/domain';

type CameraVerificationScreenProps = {
  result: VerificationState;
  onCapture: (input: { base64: string; mimeType: string }) => Promise<void>;
};

export function CameraVerificationScreen({
  result,
  onCapture,
}: CameraVerificationScreenProps) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);

  async function handleCapture() {
    if (!cameraRef.current || busy) {
      return;
    }

    setBusy(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7,
      });

      if (photo.base64) {
        await onCapture({
          base64: photo.base64,
          mimeType: 'image/jpeg',
        });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', color: '#163020' }}>
        Phase 3: Pill Detection
      </Text>
      <Text style={{ marginTop: 10, fontSize: 15, lineHeight: 22, color: '#40513B' }}>
        Capture a pill or strip image after the reminder. The image is sent to Gemini with the
        strict JSON prompt from the to-do list.
      </Text>

      {!permission ? (
        <Text style={{ marginTop: 16, color: '#40513B' }}>Checking camera permission...</Text>
      ) : permission.granted ? (
        <View style={{ marginTop: 16 }}>
          <View style={{ overflow: 'hidden', borderRadius: 18 }}>
            <CameraView ref={cameraRef} style={{ height: 240, width: '100%' }} facing="back" />
          </View>
          <TouchableOpacity
            onPress={handleCapture}
            style={{
              marginTop: 14,
              borderRadius: 14,
              backgroundColor: '#163020',
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            {busy ? (
              <ActivityIndicator color="#F5F6EF" />
            ) : (
              <Text style={{ color: '#F5F6EF', fontWeight: '600' }}>Capture Pill Image</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            marginTop: 16,
            borderRadius: 14,
            backgroundColor: '#E8F0E9',
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#163020', fontWeight: '600' }}>Grant Camera Access</Text>
        </TouchableOpacity>
      )}

      <Text style={{ marginTop: 14, color: '#40513B' }}>Status: {result.status}</Text>
      <Text style={{ marginTop: 6, color: '#4F6F52', lineHeight: 21 }}>{result.message}</Text>
    </View>
  );
}
