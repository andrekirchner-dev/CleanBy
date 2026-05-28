import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/lib/constants';

export default function MapaScreenWeb() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 64 }}>🗺️</Text>
      <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: '800' }}>Mapa</Text>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', paddingHorizontal: 40 }}>
        O mapa interativo está disponível no app mobile.{'\n'}Baixe na App Store ou Google Play.
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/buscar')}
        style={{ backgroundColor: COLORS.chuva, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, marginTop: 8 }}
      >
        <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>Buscar estabelecimentos →</Text>
      </TouchableOpacity>
    </View>
  );
}
