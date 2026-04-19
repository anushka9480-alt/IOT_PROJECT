import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

type PrimaryButtonProps = PropsWithChildren<{
  busy?: boolean;
  disabled?: boolean;
  onPress: () => void;
  tone?: 'primary' | 'danger' | 'secondary';
}>;

export function PrimaryButton({
  busy,
  children,
  disabled,
  onPress,
  tone = 'primary',
}: PrimaryButtonProps) {
  const backgroundColor =
    tone === 'danger' ? '#C74B50' : tone === 'secondary' ? '#EEF4FF' : '#152033';
  const textColor = tone === 'secondary' ? '#152033' : '#F8FBFF';

  return (
    <TouchableOpacity
      disabled={busy || disabled}
      onPress={onPress}
      style={{
        borderRadius: 18,
        backgroundColor,
        opacity: disabled ? 0.6 : 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {busy ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontWeight: '700', fontSize: 15 }}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}
