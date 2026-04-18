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
    <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: '#163020' }}>{title}</Text>
      {description ? (
        <Text style={{ marginTop: 10, fontSize: 15, lineHeight: 22, color: '#40513B' }}>
          {description}
        </Text>
      ) : null}
      <View style={{ marginTop: 16 }}>{children}</View>
    </View>
  );
}
