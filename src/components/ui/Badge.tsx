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
    open: { bg: 'rgba(0,201,160,0.14)', text: '#00C9A0' },
    closed: { bg: 'rgba(226,75,74,0.14)', text: '#FF6B6B' },
    pro: { bg: COLORS.verdeAgua, text: COLORS.noite },
    info: { bg: 'rgba(26,122,200,0.18)', text: COLORS.chuva },
    warning: { bg: 'rgba(239,159,39,0.18)', text: '#EF9F27' },
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
