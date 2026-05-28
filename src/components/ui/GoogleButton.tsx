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
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: COLORS.white,
        borderRadius: 100,
        paddingVertical: 16,
        paddingHorizontal: 24,
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.gray600} size="small" />
      ) : (
        <>
          <View style={{
            width: 20, height: 20, borderRadius: 10,
            backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#4285F4' }}>G</Text>
          </View>
          <Text style={{ color: COLORS.gray800, fontWeight: '700', fontSize: 15, letterSpacing: 0.3 }}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
