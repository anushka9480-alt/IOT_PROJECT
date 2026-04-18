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
    tone === 'danger' ? '#A94438' : tone === 'secondary' ? '#E8F0E9' : '#163020';
  const textColor = tone === 'secondary' ? '#163020' : '#F5F6EF';

  return (
    <TouchableOpacity
      disabled={busy || disabled}
      onPress={onPress}
      style={{
        borderRadius: 14,
        backgroundColor,
        opacity: disabled ? 0.6 : 1,
        paddingVertical: 14,
        alignItems: 'center',
      }}
    >
      {busy ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontWeight: '600' }}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}
