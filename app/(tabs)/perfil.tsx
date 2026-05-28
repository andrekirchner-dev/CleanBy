import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pencil, Car, CreditCard, MapPin, Bell, Shield, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { COLORS } from '../../src/lib/constants';
import { LoyaltyCard } from '../../src/components/ui/LoyaltyCard';
import { ProModal } from '../../src/components/ui/ProModal';
import { Badge } from '../../src/components/ui/Badge';

const MENU_SECTIONS = [
  {
    title: 'Conta',
    items: [
      { Icon: Car,         label: 'Meus veículos',       sub: '2 veículos' },
      { Icon: CreditCard,  label: 'Formas de pagamento',  sub: 'Cartão, Pix' },
      { Icon: MapPin,      label: 'Endereços salvos',     sub: '1 endereço' },
    ],
  },
  {
    title: 'Preferências',
    items: [
      { Icon: Bell,   label: 'Notificações',        sub: 'Ativadas' },
      { Icon: Shield, label: 'Privacidade e segurança', sub: '' },
    ],
  },
  {
    title: 'Suporte',
    items: [
      { Icon: HelpCircle, label: 'Central de ajuda', sub: '' },
      { Icon: FileText,   label: 'Termos de uso',    sub: '' },
    ],
  },
];

export default function PerfilScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const [showProModal, setShowProModal] = useState(false);
  const isPro = user?.plan === 'pro';
  const stamps = user?.loyalty_stamps ?? 3;
  const initials = user?.name?.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() ?? 'U';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Hero header */}
          <LinearGradient
            colors={['#0D1E3A', '#080F1E']}
            style={{ paddingHorizontal: 24, paddingTop: 10, paddingBottom: 28 }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 20 }}>
              Perfil
            </Text>

            {/* Avatar + info */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <View style={{ position: 'relative' }}>
                <LinearGradient
                  colors={[COLORS.chuva, '#0E3D6B']}
                  style={{ width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ color: COLORS.white, fontSize: 26, fontWeight: '800' }}>{initials}</Text>
                </LinearGradient>
                {isPro && (
                  <View style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 22, height: 22, borderRadius: 11,
                    backgroundColor: COLORS.verdeAgua,
                    borderWidth: 2, borderColor: COLORS.noite,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 10 }}>✦</Text>
                  </View>
                )}
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
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Pencil size={15} color="rgba(255,255,255,0.7)" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Stats row */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderRadius: 16, padding: 16, gap: 0,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
            }}>
              {[
                { value: `${stamps}`, label: 'Selos' },
                { value: '2', label: 'Veículos' },
                { value: '3', label: 'Serviços' },
              ].map((stat, i) => (
                <View key={i} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < 2 ? 1 : 0, borderRightColor: 'rgba(255,255,255,0.07)' }}>
                  <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }}>{stat.value}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          <View style={{ paddingHorizontal: 24, gap: 16, paddingBottom: 40 }}>

            {/* PRO CTA */}
            {!isPro ? (
              <TouchableOpacity onPress={() => setShowProModal(true)} activeOpacity={0.85}>
                <LinearGradient
                  colors={['rgba(0,201,160,0.15)', 'rgba(0,160,128,0.08)']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 20, padding: 20,
                    borderWidth: 1, borderColor: 'rgba(0,201,160,0.25)',
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    overflow: 'hidden',
                  }}
                >
                  <View style={{
                    position: 'absolute', right: -20, top: -20,
                    width: 100, height: 100, borderRadius: 50,
                    backgroundColor: 'rgba(0,201,160,0.08)',
                  }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: COLORS.verdeAgua, fontWeight: '800', fontSize: 16, marginBottom: 4, letterSpacing: -0.2 }}>
                      ✦ Assinar CleanBy PRO
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 18 }}>
                      Desconto exclusivo · Fila prioritária · R$ 19,90/mês
                    </Text>
                  </View>
                  <View style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: 'rgba(0,201,160,0.2)',
                    alignItems: 'center', justifyContent: 'center', marginLeft: 14,
                  }}>
                    <ChevronRight size={18} color={COLORS.verdeAgua} strokeWidth={2.5} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={{
                backgroundColor: 'rgba(0,201,160,0.08)', borderRadius: 20, padding: 18,
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                borderWidth: 1, borderColor: 'rgba(0,201,160,0.2)',
              }}>
                <Text style={{ color: COLORS.verdeAgua, fontWeight: '800', fontSize: 15 }}>✦ PRO ativo</Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  Cota: {user?.pro_pay_on_site_quota ?? 2}/2
                </Text>
              </View>
            )}

            {/* Loyalty Card */}
            <LoyaltyCard stamps={stamps} isPro={isPro} />

            {/* Menu sections */}
            {MENU_SECTIONS.map((section) => (
              <View key={section.title}>
                <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
                  {section.title}
                </Text>
                <View style={{
                  backgroundColor: COLORS.noiteSurface, borderRadius: 20, overflow: 'hidden',
                  borderWidth: 1, borderColor: COLORS.border,
                }}>
                  {section.items.map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{
                        flexDirection: 'row', alignItems: 'center', padding: 16,
                        borderBottomWidth: i < section.items.length - 1 ? 1 : 0,
                        borderBottomColor: COLORS.border,
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={{
                        width: 38, height: 38, borderRadius: 12,
                        backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                        alignItems: 'center', justifyContent: 'center', marginRight: 14,
                      }}>
                        <item.Icon size={17} color="rgba(255,255,255,0.6)" strokeWidth={1.8} />
                      </View>
                      <Text style={{ flex: 1, color: 'rgba(255,255,255,0.75)', fontSize: 15 }}>{item.label}</Text>
                      {item.sub ? (
                        <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginRight: 8 }}>{item.sub}</Text>
                      ) : null}
                      <ChevronRight size={18} color="rgba(255,255,255,0.2)" strokeWidth={2} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Sign out */}
            <TouchableOpacity
              onPress={async () => { await signOut(); router.replace('/(auth)/onboarding'); }}
              style={{
                borderRadius: 100, padding: 16, alignItems: 'center',
                borderWidth: 1, borderColor: 'rgba(226,75,74,0.25)',
                backgroundColor: 'rgba(226,75,74,0.08)',
                flexDirection: 'row', justifyContent: 'center', gap: 8,
              }}
            >
              <LogOut size={16} color={COLORS.error} strokeWidth={2} />
              <Text style={{ color: COLORS.error, fontWeight: '700', fontSize: 15 }}>Sair da conta</Text>
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>
              CleanBy v1.0.0
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <ProModal visible={showProModal} onClose={() => setShowProModal(false)} onSubscribe={() => setShowProModal(false)} />
    </View>
  );
}
