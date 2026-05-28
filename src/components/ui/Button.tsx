import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { COLORS } from '../../lib/constants';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'pro' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const bgColors = {
    primary: COLORS.chuva,
    secondary: COLORS.noite,
    outline: 'transparent',
    pro: COLORS.verdeAgua,
    ghost: 'transparent',
  };

  const textColors = {
    primary: COLORS.white,
    secondary: COLORS.white,
    outline: COLORS.chuva,
    pro: COLORS.noite,
    ghost: COLORS.chuva,
  };

  const paddings = { sm: 8, md: 14, lg: 18 };
  const fontSizes = { sm: 13, md: 15, lg: 17 };
  const borderRadius = 12;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        backgroundColor: disabled ? COLORS.gray200 : bgColors[variant],
        paddingVertical: paddings[size],
        paddingHorizontal: paddings[size] * 1.8,
        borderRadius,
        borderWidth: variant === 'outline' ? 1.5 : 0,
        borderColor: variant === 'outline' ? COLORS.chuva : 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        opacity: disabled ? 0.6 : 1,
      }}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} size="small" />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text
            style={{
              color: disabled ? COLORS.gray400 : textColors[variant],
              fontSize: fontSizes[size],
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
