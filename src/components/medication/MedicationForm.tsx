import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import type { MedicationFormValues } from '../../types/medication';
import { PrimaryButton } from '../common/PrimaryButton';
import { SectionCard } from '../common/SectionCard';

type MedicationFormProps = {
  onSubmit: (values: MedicationFormValues) => Promise<void>;
};

export function MedicationForm({ onSubmit }: MedicationFormProps) {
  const [values, setValues] = useState<MedicationFormValues>({
    name: '',
    dosage: '',
    scheduleTime: '08:00',
  });
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    if (!values.name || !values.dosage || !values.scheduleTime) {
      return;
    }

    setBusy(true);

    try {
      await onSubmit(values);
      setValues({
        name: '',
        dosage: '',
        scheduleTime: '08:00',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <SectionCard
      title="Medication Form"
      description="Phase 2 Step 5: capture medication name, dosage, and the scheduled time used by the reminder engine."
    >
      <View style={{ gap: 12 }}>
        <View>
          <Text style={{ marginBottom: 6, color: '#40513B' }}>Medication name</Text>
          <TextInput
            value={values.name}
            onChangeText={(name) => setValues((current) => ({ ...current, name }))}
            placeholder="Metformin"
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#D6E7D8',
              paddingHorizontal: 14,
              paddingVertical: 12,
              backgroundColor: '#FAFCF8',
            }}
          />
        </View>
        <View>
          <Text style={{ marginBottom: 6, color: '#40513B' }}>Dosage</Text>
          <TextInput
            value={values.dosage}
            onChangeText={(dosage) => setValues((current) => ({ ...current, dosage }))}
            placeholder="500 mg"
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#D6E7D8',
              paddingHorizontal: 14,
              paddingVertical: 12,
              backgroundColor: '#FAFCF8',
            }}
          />
        </View>
        <View>
          <Text style={{ marginBottom: 6, color: '#40513B' }}>Schedule time</Text>
          <TextInput
            value={values.scheduleTime}
            onChangeText={(scheduleTime) => setValues((current) => ({ ...current, scheduleTime }))}
            placeholder="08:00"
            style={{
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#D6E7D8',
              paddingHorizontal: 14,
              paddingVertical: 12,
              backgroundColor: '#FAFCF8',
            }}
          />
        </View>
        <PrimaryButton busy={busy} onPress={handleSubmit}>
          Save Medication Schedule
        </PrimaryButton>
      </View>
    </SectionCard>
  );
}
