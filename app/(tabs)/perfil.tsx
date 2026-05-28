import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { COLORS } from '../../src/lib/constants';
import { LoyaltyCard } from '../../src/components/ui/LoyaltyCard';
import { ProModal } from '../../src/components/ui/ProModal';
import { Badge } from '../../src/components/ui/Badge';

const MOCK_VEHICLES = [
  { id: 'v1', plate: 'ABC-1234', model: 'Honda Civic', color: 'Prata', year: 2022 },
  { id: 'v2', plate: 'XYZ-5678', model: 'Toyota Corolla', color: 'Branco', year: 2020 },
];

export default function PerfilScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [showProModal, setShowProModal] = useState(false);
  const isPro = user?.plan === 'pro';
  const stamps = user?.loyalty_stamps ?? 3;

  const menuItems = [
    { icon: '🚗', label: 'Meus veículos', onPress: () => {} },
    { icon: '🏷️', label: 'Formas de pagamento', onPress: () => {} },
    { icon: '📍', label: 'Endereços salvos', onPress: () => {} },
    { icon: '🔔', label: 'Notificações', onPress: () => {} },
    { icon: '🛡️', label: 'Privacidade e segurança', onPress: () => {} },
    { icon: '❓', label: 'Central de ajuda', onPress: () => {} },
    { icon: '📋', label: 'Termos de uso', onPress: () => {} },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offWhite }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ backgroundColor: COLORS.noite, padding: 24, paddingBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <View style={{
              width: 72, height: 72, borderRadius: 36,
              backgroundColor: COLORS.chuva, alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 32 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: '800' }}>
                {user?.name ?? 'Usuário CleanBy'}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>
                {user?.email ?? 'usuario@email.com'}
              </Text>
              <View style={{ marginTop: 6 }}>
                {isPro ? (
                  <Badge label="✦ PRO" variant="pro" />
                ) : (
                  <Badge label="Free" variant="info" />
                )}
              </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 10 }}>
              <Text style={{ fontSize: 18 }}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* PRO CTA or status */}
          {!isPro ? (
            <TouchableOpacity
              onPress={() => setShowProModal(true)}
              style={{
                backgroundColor: COLORS.verdeAgua, borderRadius: 14,
                padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={{ color: COLORS.noite, fontWeight: '800', fontSize: 15 }}>Assinar CleanBy PRO</Text>
                <Text style={{ color: COLORS.oceano, fontSize: 12, marginTop: 2 }}>
                  R$ 19,90/mês • Cancele quando quiser
                </Text>
              </View>
              <Text style={{ fontSize: 24 }}>✦</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ backgroundColor: 'rgba(0,201,160,0.15)', borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: COLORS.verdeAgua, fontWeight: '700', fontSize: 14 }}>✦ PRO ativo</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                Cota pagar no local: {user?.pro_pay_on_site_quota ?? 2}/2
              </Text>
            </View>
          )}
        </View>

        <View style={{ padding: 20, gap: 20 }}>
          {/* Loyalty Card */}
          <LoyaltyCard stamps={stamps} isPro={isPro} />

          {/* Vehicles */}
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.noite }}>Meus veículos</Text>
              <TouchableOpacity>
                <Text style={{ color: COLORS.chuva, fontWeight: '700' }}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>
            {MOCK_VEHICLES.map((v, i) => (
              <View key={v.id} style={{ padding: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: i < MOCK_VEHICLES.length - 1 ? 1 : 0, borderBottomColor: COLORS.gray200 }}>
                <Text style={{ fontSize: 28, marginRight: 14 }}>🚗</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: COLORS.noite, fontSize: 14 }}>{v.model}</Text>
                  <Text style={{ color: COLORS.gray400, fontSize: 13 }}>{v.plate} • {v.color} • {v.year}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={{ color: COLORS.gray400, fontSize: 20 }}>⋯</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Menu */}
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden' }}>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={item.onPress}
                style={{
                  flexDirection: 'row', alignItems: 'center', padding: 16,
                  borderBottomWidth: i < menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: COLORS.gray200,
                }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 20, marginRight: 14 }}>{item.icon}</Text>
                <Text style={{ flex: 1, color: COLORS.gray800, fontSize: 15 }}>{item.label}</Text>
                <Text style={{ color: COLORS.gray400 }}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign out */}
          <TouchableOpacity
            onPress={async () => { await signOut(); router.replace('/(auth)/onboarding'); }}
            style={{ backgroundColor: '#FEE2E2', borderRadius: 14, padding: 16, alignItems: 'center' }}
          >
            <Text style={{ color: COLORS.error, fontWeight: '700', fontSize: 15 }}>Sair da conta</Text>
          </TouchableOpacity>

          <Text style={{ textAlign: 'center', color: COLORS.gray400, fontSize: 12, marginBottom: 8 }}>
            CleanBy v1.0.0
          </Text>
        </View>
      </ScrollView>

      <ProModal visible={showProModal} onClose={() => setShowProModal(false)} onSubscribe={() => setShowProModal(false)} />
    </SafeAreaView>
  );
}
