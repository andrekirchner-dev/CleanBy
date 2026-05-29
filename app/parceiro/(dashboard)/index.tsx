import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TrendingUp, Star, CalendarCheck, ChevronRight, LogOut, AlertTriangle } from 'lucide-react-native';
import { useAuthStore } from '../../../src/stores/authStore';
import { usePartnerStore } from '../../../src/stores/partnerStore';
import { COLORS, STATUS_LABELS, STATUS_COLORS } from '../../../src/lib/constants';

const TODAY = new Date().toISOString().split('T')[0];

export default function ParceiroDashboardScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { establishment, bookings, loading, fetchEstablishment } = usePartnerStore();

  const load = () => { if (user) fetchEstablishment(user.id); };
  useEffect(() => { load(); }, [user?.id]);

  const todayBookings = bookings.filter((b) => b.date === TODAY && b.status !== 'cancelado');
  const pending = bookings.filter((b) => b.status === 'aguardando_confirmacao');
  const todayRevenue = todayBookings.filter((b) => b.status === 'concluido').reduce((s, b) => s + b.total_amount, 0);
  const upcoming = bookings
    .filter((b) => b.date >= TODAY && ['aguardando_confirmacao', 'confirmado'].includes(b.status))
    .slice(0, 5);

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  if (loading && !establishment) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.noite, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.verdeAgua} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={COLORS.verdeAgua} />}
        >
          {/* Header */}
          <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: COLORS.verdeAgua }} />
                  <Text style={{ color: COLORS.verdeAgua, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
                    Painel do Parceiro
                  </Text>
                </View>
                <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: '800', letterSpacing: -0.4 }} numberOfLines={1}>
                  {establishment?.name ?? user?.name ?? 'Estabelecimento'}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 2 }}>
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <LogOut size={16} color="rgba(255,255,255,0.5)" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* No establishment warning */}
          {!establishment && (
            <View style={{
              marginHorizontal: 24, marginBottom: 24, padding: 16,
              backgroundColor: 'rgba(239,159,39,0.1)', borderRadius: 16,
              borderWidth: 1, borderColor: 'rgba(239,159,39,0.25)',
              flexDirection: 'row', gap: 12, alignItems: 'center',
            }}>
              <AlertTriangle size={18} color="#EF9F27" strokeWidth={2} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#EF9F27', fontWeight: '700', fontSize: 14, marginBottom: 2 }}>
                  Configure seu estabelecimento
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  Adicione endereço, horários e serviços para aparecer no app.
                </Text>
              </View>
            </View>
          )}

          {/* Pending alert */}
          {pending.length > 0 && (
            <TouchableOpacity
              onPress={() => router.push('/parceiro/(dashboard)/agendamentos')}
              style={{
                marginHorizontal: 24, marginBottom: 20, padding: 14,
                backgroundColor: 'rgba(26,122,200,0.12)', borderRadius: 14,
                borderWidth: 1, borderColor: 'rgba(26,122,200,0.25)',
                flexDirection: 'row', alignItems: 'center', gap: 12,
              }}
            >
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: 'rgba(26,122,200,0.2)', alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: COLORS.chuva, fontWeight: '800', fontSize: 15 }}>{pending.length}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 14 }}>
                  {pending.length} agendamento{pending.length > 1 ? 's' : ''} aguardando confirmação
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Toque para confirmar ou recusar</Text>
              </View>
              <ChevronRight size={16} color={COLORS.chuva} strokeWidth={2} />
            </TouchableOpacity>
          )}

          {/* Stats */}
          <View style={{ paddingHorizontal: 24, marginBottom: 28 }}>
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
              Hoje
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {[
                { icon: CalendarCheck, value: `${todayBookings.length}`, label: 'Agendamentos', color: COLORS.chuva },
                { icon: TrendingUp, value: `R$${todayRevenue.toFixed(0)}`, label: 'Receita', color: COLORS.verdeAgua },
                { icon: Star, value: establishment?.rating ? establishment.rating.toFixed(1) : '—', label: 'Avaliação', color: '#EF9F27' },
              ].map(({ icon: Icon, value, label, color }) => (
                <View key={label} style={{
                  flex: 1, backgroundColor: COLORS.noiteSurface, borderRadius: 16, padding: 16,
                  borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', gap: 8,
                }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 12,
                    backgroundColor: `${color}18`, alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color={color} strokeWidth={2} />
                  </View>
                  <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 20, letterSpacing: -0.5 }}>{value}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '600' }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Upcoming bookings */}
          <View style={{ paddingHorizontal: 24, marginBottom: 40 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: '800', letterSpacing: -0.3 }}>
                Próximos agendamentos
              </Text>
              <TouchableOpacity onPress={() => router.push('/parceiro/(dashboard)/agendamentos')}>
                <Text style={{ color: COLORS.verdeAgua, fontWeight: '700', fontSize: 13 }}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {upcoming.length === 0 ? (
              <View style={{
                backgroundColor: COLORS.noiteSurface, borderRadius: 16, padding: 32,
                alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
              }}>
                <CalendarCheck size={32} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 12 }}>
                  Nenhum agendamento próximo
                </Text>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {upcoming.map((b) => {
                  const statusColor = STATUS_COLORS[b.status];
                  return (
                    <View key={b.id} style={{
                      backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 14,
                      borderWidth: 1, borderColor: COLORS.border,
                      flexDirection: 'row', alignItems: 'center', gap: 14,
                    }}>
                      <View style={{
                        width: 48, height: 48, borderRadius: 12,
                        backgroundColor: `${statusColor}18`, alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Text style={{ color: statusColor, fontWeight: '800', fontSize: 14 }}>
                          {b.time.slice(0, 5)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 14 }} numberOfLines={1}>
                          {b.service_name}
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>
                          {b.vehicle_model} · {b.vehicle_plate}
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 2 }}>
                          {new Date(b.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                        </Text>
                      </View>
                      <View style={{
                        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100,
                        backgroundColor: `${statusColor}18`,
                      }}>
                        <Text style={{ color: statusColor, fontSize: 10, fontWeight: '700' }}>
                          {STATUS_LABELS[b.status]}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
