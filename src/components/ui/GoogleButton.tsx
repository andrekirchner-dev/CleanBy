import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../lib/constants';

interface GoogleButtonProps {
  onPress: () => void;
  loading?: boolean;
  label?: string;
}

export function GoogleButton({ onPress, loading = false, label = 'Continuar com Google' }: GoogleButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderWidth: 1.5,
        borderColor: COLORS.gray200,
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.gray600} size="small" />
      ) : (
        <>
          {/* Google G logo SVG-like using text */}
          <View style={{
            width: 22, height: 22, borderRadius: 11,
            backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#4285F4' }}>G</Text>
          </View>
          <Text style={{ color: COLORS.gray800, fontWeight: '700', fontSize: 15 }}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
