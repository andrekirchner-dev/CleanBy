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
    secondary: COLORS.surfaceHigh,
    outline: 'transparent',
    pro: COLORS.verdeAgua,
    ghost: 'transparent',
  };

  const textColors = {
    primary: COLORS.white,
    secondary: COLORS.white,
    outline: COLORS.white,
    pro: COLORS.noite,
    ghost: COLORS.chuva,
  };

  const paddings = { sm: 10, md: 14, lg: 18 };
  const fontSizes = { sm: 13, md: 15, lg: 16 };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        backgroundColor: disabled ? 'rgba(255,255,255,0.08)' : bgColors[variant],
        paddingVertical: paddings[size],
        paddingHorizontal: paddings[size] * 2,
        borderRadius: 100,
        borderWidth: variant === 'outline' ? 1.5 : 0,
        borderColor: variant === 'outline' ? 'rgba(255,255,255,0.2)' : 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        opacity: disabled ? 0.5 : 1,
      }}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} size="small" />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text
            style={{
              color: disabled ? 'rgba(255,255,255,0.3)' : textColors[variant],
              fontSize: fontSizes[size],
              fontWeight: '700',
              letterSpacing: 0.4,
            }}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
