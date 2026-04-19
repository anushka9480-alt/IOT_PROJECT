import { Linking, Text, View } from 'react-native';

import { PrimaryButton } from '../components/common/PrimaryButton';
import { SectionCard } from '../components/common/SectionCard';
import { externalLinks } from '../lib/constants';

export function ScheduleScreen() {
  return (
    <SectionCard
      title="Mobile Workflow"
      description="1. Scan the medicines. 2. Review AI guidance. 3. Save the course with repeat reminders. 4. Remove one medicine or end the whole course whenever needed."
    >
      <View style={{ gap: 12 }}>
        <View
          style={{
            borderRadius: 18,
            backgroundColor: '#F8FBFF',
            borderWidth: 1,
            borderColor: '#D8E1EF',
            padding: 16,
            gap: 8,
          }}
        >
          <Text style={{ color: '#152033', fontWeight: '700' }}>Preview on your laptop</Text>
          <Text style={{ color: '#5B667A', lineHeight: 21 }}>
            Use `npm run web` from the project root to open the mobile experience in a browser while
            you edit it on your laptop.
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={() => void Linking.openURL(externalLinks.webApp)} tone="secondary">
              Open Website
            </PrimaryButton>
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton onPress={() => void Linking.openURL(externalLinks.apkDownload)}>
              APK Link
            </PrimaryButton>
          </View>
        </View>
      </View>
    </SectionCard>
  );
}
