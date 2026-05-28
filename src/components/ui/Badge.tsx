import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../lib/constants';

interface BadgeProps {
  label: string;
  variant?: 'open' | 'closed' | 'pro' | 'info' | 'warning';
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'info', size = 'sm' }: BadgeProps) {
  const styles = {
    open: { bg: '#DCFCE7', text: '#166534' },
    closed: { bg: '#FEE2E2', text: '#991B1B' },
    pro: { bg: COLORS.verdeAgua, text: COLORS.noite },
    info: { bg: COLORS.nevoa, text: COLORS.chuva },
    warning: { bg: '#FEF3C7', text: '#92400E' },
  };

  const { bg, text } = styles[variant];
  const fontSize = size === 'sm' ? 11 : 13;

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: size === 'sm' ? 8 : 12,
        paddingVertical: size === 'sm' ? 3 : 5,
        borderRadius: 20,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: text, fontSize, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}
