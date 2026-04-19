import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { PrimaryButton } from '../components/common/PrimaryButton';
import { SectionCard } from '../components/common/SectionCard';
import type { MedicationInsight, VerificationState } from '../types/domain';

type CameraVerificationScreenProps = {
  result: VerificationState;
  insight: MedicationInsight | null;
  onCapture: (input: { base64: string; mimeType: string }) => Promise<void>;
  onAddToCourse: () => Promise<void>;
  onClearInsight: () => void;
};

export function CameraVerificationScreen({
  result,
  insight,
  onCapture,
  onAddToCourse,
  onClearInsight,
}: CameraVerificationScreenProps) {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [adding, setAdding] = useState(false);

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

  async function handleAddToCourse() {
    setAdding(true);

    try {
      await onAddToCourse();
    } finally {
      setAdding(false);
    }
  }

  return (
    <SectionCard
      title="AI Medicine Scanner"
      description="Take a photo of tablets, strips, or packaging. Gemini will estimate the medicine, explain what it is for, and prefill the course workflow."
    >
      <View style={{ gap: 16 }}>
        {!permission ? (
          <Text style={{ color: '#5B667A' }}>Checking camera permission...</Text>
        ) : permission.granted ? (
          <View style={{ gap: 14 }}>
            <View style={{ overflow: 'hidden', borderRadius: 22 }}>
              <CameraView ref={cameraRef} style={{ height: 260, width: '100%' }} facing="back" />
            </View>
            <PrimaryButton busy={busy} onPress={() => void handleCapture()}>
              Scan Medicine Photo
            </PrimaryButton>
          </View>
        ) : (
          <TouchableOpacity
            onPress={requestPermission}
            style={{
              borderRadius: 18,
              backgroundColor: '#EEF4FF',
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#152033', fontWeight: '700' }}>Grant Camera Access</Text>
          </TouchableOpacity>
        )}

        <View
          style={{
            borderRadius: 18,
            backgroundColor: '#F8FBFF',
            borderWidth: 1,
            borderColor: '#D8E1EF',
            padding: 14,
          }}
        >
          <Text style={{ color: '#152033', fontWeight: '700' }}>Scanner status</Text>
          <Text style={{ marginTop: 8, color: '#5B667A' }}>{result.message}</Text>
        </View>

        {insight?.detected ? (
          <View
            style={{
              borderRadius: 22,
              backgroundColor: '#152033',
              padding: 18,
              gap: 12,
            }}
          >
            <Text style={{ color: '#F8FBFF', fontSize: 20, fontWeight: '700' }}>
              {insight.name || 'Medicine identified'}
            </Text>
            <Text style={{ color: '#D6E4FF' }}>{insight.summary}</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  `Dose: ${insight.dosage || insight.potency || 'Check pack'}`,
                  `Use: ${insight.purpose || 'General medication support'}`,
                  `Take: ${insight.whenToTake || 'Follow doctor advice'}`,
                  `Frequency: ${insight.frequency || 'Daily'}`,
                ].map((item) => (
                  <View
                    key={item}
                    style={{
                      borderRadius: 999,
                      backgroundColor: '#26344A',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <Text style={{ color: '#F8FBFF' }}>{item}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            {insight.precautions.length > 0 ? (
              <View
                style={{
                  borderRadius: 16,
                  backgroundColor: '#26344A',
                  padding: 12,
                  gap: 4,
                }}
              >
                <Text style={{ color: '#F8FBFF', fontWeight: '700' }}>Precautions</Text>
                {insight.precautions.slice(0, 3).map((precaution) => (
                  <Text key={precaution} style={{ color: '#D6E4FF', lineHeight: 20 }}>
                    • {precaution}
                  </Text>
                ))}
              </View>
            ) : null}

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <PrimaryButton busy={adding} onPress={() => void handleAddToCourse()}>
                  Add To Course
                </PrimaryButton>
              </View>
              <View style={{ flex: 1 }}>
                <PrimaryButton onPress={onClearInsight} tone="secondary">
                  Clear Scan
                </PrimaryButton>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}
