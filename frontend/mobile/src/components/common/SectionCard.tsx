import type { PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

type SectionCardProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <View
      style={{
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderWidth: 1,
        borderColor: '#E4EBF5',
        shadowColor: '#152033',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#152033' }}>{title}</Text>
      {description ? (
        <Text style={{ marginTop: 10, fontSize: 15, lineHeight: 22, color: '#5B667A' }}>
          {description}
        </Text>
      ) : null}
      <View style={{ marginTop: 16 }}>{children}</View>
    </View>
  );
}
