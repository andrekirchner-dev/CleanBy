import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
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

const MENU_ITEMS = [
  { icon: '🚗', label: 'Meus veículos' },
  { icon: '🏷️', label: 'Formas de pagamento' },
  { icon: '📍', label: 'Endereços salvos' },
  { icon: '🔔', label: 'Notificações' },
  { icon: '🛡️', label: 'Privacidade e segurança' },
  { icon: '❓', label: 'Central de ajuda' },
  { icon: '📋', label: 'Termos de uso' },
];

export default function PerfilScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [showProModal, setShowProModal] = useState(false);
  const isPro = user?.plan === 'pro';
  const stamps = user?.loyalty_stamps ?? 3;
  const initials = user?.name?.split(' ').map((n) => n[0]).slice(0, 2).join('') ?? 'U';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 24, paddingBottom: 28 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>
            Meu perfil
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <View style={{
              width: 72, height: 72, borderRadius: 36,
              backgroundColor: `${COLORS.chuva}30`,
              borderWidth: 2, borderColor: `${COLORS.chuva}50`,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: COLORS.chuva, fontSize: 24, fontWeight: '800' }}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: '800', letterSpacing: -0.3, marginBottom: 3 }}>
                {user?.name ?? 'Usuário CleanBy'}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                {user?.email ?? 'usuario@email.com'}
              </Text>
              <View style={{ marginTop: 6 }}>
                {isPro ? <Badge label="✦ PRO" variant="pro" /> : <Badge label="Free" variant="info" />}
              </View>
            </View>
            <TouchableOpacity style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 16 }}>✏️</Text>
            </TouchableOpacity>
          </View>

          {/* PRO CTA */}
          {!isPro ? (
            <TouchableOpacity
              onPress={() => setShowProModal(true)}
              style={{
                backgroundColor: `${COLORS.verdeAgua}15`,
                borderRadius: 18, padding: 18,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                borderWidth: 1, borderColor: `${COLORS.verdeAgua}35`,
              }}
            >
              <View>
                <Text style={{ color: COLORS.verdeAgua, fontWeight: '800', fontSize: 15, marginBottom: 3 }}>
                  ✦ Assinar CleanBy PRO
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  R$ 19,90/mês • Cancele quando quiser
                </Text>
              </View>
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: `${COLORS.verdeAgua}25`,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: COLORS.verdeAgua, fontSize: 14 }}>›</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{
              backgroundColor: `${COLORS.verdeAgua}12`,
              borderRadius: 18, padding: 16,
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              borderWidth: 1, borderColor: `${COLORS.verdeAgua}30`,
            }}>
              <Text style={{ color: COLORS.verdeAgua, fontWeight: '700', fontSize: 14 }}>✦ PRO ativo</Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                Cota pagar no local: {user?.pro_pay_on_site_quota ?? 2}/2
              </Text>
            </View>
          )}
        </View>

        <View style={{ paddingHorizontal: 24, gap: 16, paddingBottom: 40 }}>
          {/* Loyalty Card */}
          <LoyaltyCard stamps={stamps} isPro={isPro} />

          {/* Vehicles */}
          <View style={{
            backgroundColor: COLORS.noiteSurface,
            borderRadius: 20, overflow: 'hidden',
            borderWidth: 1, borderColor: COLORS.border,
          }}>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              padding: 18, borderBottomWidth: 1, borderBottomColor: COLORS.border,
            }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.white, letterSpacing: -0.2 }}>Meus veículos</Text>
              <TouchableOpacity>
                <Text style={{ color: COLORS.chuva, fontWeight: '700', fontSize: 13 }}>+ Adicionar</Text>
              </TouchableOpacity>
            </View>
            {MOCK_VEHICLES.map((v, i) => (
              <View key={v.id} style={{
                padding: 16, flexDirection: 'row', alignItems: 'center',
                borderBottomWidth: i < MOCK_VEHICLES.length - 1 ? 1 : 0,
                borderBottomColor: COLORS.border,
              }}>
                <View style={{
                  width: 42, height: 42, borderRadius: 21,
                  backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                  alignItems: 'center', justifyContent: 'center', marginRight: 14,
                }}>
                  <Text style={{ fontSize: 20 }}>🚗</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: COLORS.white, fontSize: 14 }}>{v.model}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>{v.plate} • {v.color} • {v.year}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 20 }}>⋯</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Menu */}
          <View style={{
            backgroundColor: COLORS.noiteSurface,
            borderRadius: 20, overflow: 'hidden',
            borderWidth: 1, borderColor: COLORS.border,
          }}>
            {MENU_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  flexDirection: 'row', alignItems: 'center', padding: 18,
                  borderBottomWidth: i < MENU_ITEMS.length - 1 ? 1 : 0,
                  borderBottomColor: COLORS.border,
                }}
                activeOpacity={0.7}
              >
                <View style={{
                  width: 36, height: 36, borderRadius: 12,
                  backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                  alignItems: 'center', justifyContent: 'center', marginRight: 14,
                }}>
                  <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                </View>
                <Text style={{ flex: 1, color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>{item.label}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign out */}
          <TouchableOpacity
            onPress={async () => { await signOut(); router.replace('/(auth)/onboarding'); }}
            style={{
              backgroundColor: 'rgba(226,75,74,0.10)',
              borderRadius: 100, padding: 18, alignItems: 'center',
              borderWidth: 1, borderColor: 'rgba(226,75,74,0.25)',
            }}
          >
            <Text style={{ color: COLORS.error, fontWeight: '700', fontSize: 15 }}>Sair da conta</Text>
          </TouchableOpacity>

          <Text style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
            CleanBy v1.0.0
          </Text>
        </View>
      </ScrollView>

      <ProModal visible={showProModal} onClose={() => setShowProModal(false)} onSubscribe={() => setShowProModal(false)} />
    </SafeAreaView>
  );
}
