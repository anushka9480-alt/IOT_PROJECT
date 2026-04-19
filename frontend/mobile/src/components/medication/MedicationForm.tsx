import { useEffect, useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import type { MedicationInsight } from '../../types/domain';
import type { MedicationFormValues } from '../../types/medication';
import { todayDateString } from '../../utils/date';
import { PrimaryButton } from '../common/PrimaryButton';
import { SectionCard } from '../common/SectionCard';

type MedicationFormProps = {
  onSubmit: (values: MedicationFormValues) => Promise<void>;
  suggestion?: MedicationInsight | null;
};

function createInitialValues(): MedicationFormValues {
  const today = todayDateString();

  return {
    name: '',
    dosage: '',
    scheduleTime: '08:00',
    purpose: '',
    potency: '',
    whenToTake: '',
    frequency: 'Daily',
    courseStartDate: today,
    courseEndDate: today,
  };
}

function buildSuggestionValues(suggestion: MedicationInsight): MedicationFormValues {
  const today = todayDateString();
  const courseLength = Math.max(suggestion.courseDays || 1, 1);
  const endDate = new Date(`${today}T00:00:00`);
  endDate.setDate(endDate.getDate() + courseLength - 1);

  return {
    name: suggestion.name || '',
    dosage: suggestion.dosage || suggestion.potency || '',
    scheduleTime: suggestion.scheduleTime || '08:00',
    purpose: suggestion.purpose || '',
    potency: suggestion.potency || '',
    whenToTake: suggestion.whenToTake || '',
    frequency: suggestion.frequency || 'Daily',
    courseStartDate: today,
    courseEndDate: endDate.toISOString().slice(0, 10),
  };
}

export function MedicationForm({ onSubmit, suggestion }: MedicationFormProps) {
  const [values, setValues] = useState<MedicationFormValues>(createInitialValues);
  const [busy, setBusy] = useState(false);

  const suggestionValues = useMemo(
    () => (suggestion?.detected ? buildSuggestionValues(suggestion) : null),
    [suggestion],
  );

  useEffect(() => {
    if (suggestionValues) {
      setValues(suggestionValues);
    }
  }, [suggestionValues]);

  async function handleSubmit() {
    if (!values.name || !values.dosage || !values.scheduleTime || !values.courseEndDate) {
      return;
    }

    setBusy(true);

    try {
      await onSubmit(values);
      setValues(createInitialValues());
    } finally {
      setBusy(false);
    }
  }

  function renderInput(
    label: string,
    key: keyof MedicationFormValues,
    placeholder: string,
    multiline = false,
  ) {
    return (
      <View>
        <Text style={{ marginBottom: 6, color: '#41506A', fontWeight: '600' }}>{label}</Text>
        <TextInput
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          onChangeText={(value) => setValues((current) => ({ ...current, [key]: value }))}
          placeholder={placeholder}
          placeholderTextColor="#92A0B5"
          value={values[key]}
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#D8E1EF',
            paddingHorizontal: 14,
            paddingVertical: multiline ? 14 : 12,
            backgroundColor: '#F9FBFF',
            color: '#152033',
            textAlignVertical: multiline ? 'top' : 'center',
          }}
        />
      </View>
    );
  }

  return (
    <SectionCard
      title="Medicine Course Builder"
      description="Add medicines manually or let the AI photo scan prefill this form with dosage, purpose, timing, and course dates."
    >
      <View style={{ gap: 12 }}>
        {suggestionValues ? (
          <View
            style={{
              borderRadius: 18,
              backgroundColor: '#EEF4FF',
              padding: 14,
              gap: 8,
              borderWidth: 1,
              borderColor: '#D8E1EF',
            }}
          >
            <Text style={{ color: '#152033', fontWeight: '700' }}>
              AI suggestion loaded into the form
            </Text>
            <Text style={{ color: '#5B667A', lineHeight: 20 }}>
              Review the fields before saving the medicine course.
            </Text>
          </View>
        ) : null}

        {renderInput('Medicine name', 'name', 'Metformin')}
        {renderInput('Dosage', 'dosage', '500 mg tablet')}
        {renderInput('Potency / strength', 'potency', 'Moderate potency')}
        {renderInput('Purpose', 'purpose', 'Helps manage blood sugar', true)}
        {renderInput('When to take', 'whenToTake', 'After breakfast')}
        {renderInput('Frequency', 'frequency', 'Once daily')}

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            {renderInput('Reminder time', 'scheduleTime', '08:00')}
          </View>
          <View style={{ flex: 1 }}>
            {renderInput('Course ends', 'courseEndDate', '2026-05-01')}
          </View>
        </View>

        <View>
          <Text style={{ marginBottom: 6, color: '#41506A', fontWeight: '600' }}>Course starts</Text>
          <TextInput
            value={values.courseStartDate}
            onChangeText={(courseStartDate) =>
              setValues((current) => ({ ...current, courseStartDate }))
            }
            placeholder="2026-04-19"
            placeholderTextColor="#92A0B5"
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#D8E1EF',
              paddingHorizontal: 14,
              paddingVertical: 12,
              backgroundColor: '#F9FBFF',
              color: '#152033',
            }}
          />
        </View>

        <PrimaryButton busy={busy} onPress={() => void handleSubmit()}>
          Save Medicine Course
        </PrimaryButton>
      </View>
    </SectionCard>
  );
}
