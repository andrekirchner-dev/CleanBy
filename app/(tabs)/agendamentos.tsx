import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, Car, Star } from 'lucide-react-native';
import { COLORS, STATUS_LABELS, STATUS_COLORS } from '../../src/lib/constants';
import { useAuthStore } from '../../src/stores/authStore';
import { useBookingStore } from '../../src/stores/bookingStore';

type Tab = 'proximos' | 'historico';

export default function AgendamentosScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { bookings, bookingsLoading, fetchBookings } = useBookingStore();
  const [tab, setTab] = useState<Tab>('proximos');

  const load = async () => { if (user) await fetchBookings(user.id); };

  useEffect(() => { load(); }, [user?.id]);

  const upcoming = bookings.filter((b) => ['aguardando_confirmacao', 'confirmado', 'em_andamento'].includes(b.status));
  const history = bookings.filter((b) => ['concluido', 'cancelado'].includes(b.status));
  const list = tab === 'proximos' ? upcoming : history;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 6, paddingBottom: 4 }}>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
            Agenda
          </Text>
          <Text style={{ color: COLORS.white, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 20 }}>
            Meus agendamentos
          </Text>

          {/* Tabs */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: COLORS.surface,
            borderRadius: 14, padding: 4,
            borderWidth: 1, borderColor: COLORS.border,
          }}>
            {(['proximos', 'historico'] as Tab[]).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 11,
                  backgroundColor: tab === t ? COLORS.chuva : 'transparent',
                  alignItems: 'center',
                }}
                activeOpacity={0.8}
              >
                <Text style={{
                  color: tab === t ? COLORS.white : 'rgba(255,255,255,0.35)',
                  fontWeight: '700', fontSize: 14,
                }}>
                  {t === 'proximos' ? 'Próximos' : 'Histórico'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {bookingsLoading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={COLORS.chuva} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ padding: 24, paddingTop: 20, gap: 14 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={bookingsLoading} onRefresh={load} tintColor={COLORS.chuva} />}
          >
            {list.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 60, gap: 16 }}>
                <View style={{
                  width: 80, height: 80, borderRadius: 40,
                  backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Calendar size={36} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
                </View>
                <View style={{ alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: '700' }}>
                    {tab === 'proximos' ? 'Nenhum agendamento' : 'Nenhum histórico'}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center' }}>
                    {tab === 'proximos' ? 'Seus próximos serviços aparecerão aqui' : 'Seus serviços concluídos aparecerão aqui'}
                  </Text>
                </View>
                {tab === 'proximos' && (
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)')}
                    style={{
                      backgroundColor: COLORS.chuva, borderRadius: 100,
                      paddingHorizontal: 24, paddingVertical: 12,
                    }}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 14 }}>Agendar agora</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              list.map((booking) => {
                const statusColor = STATUS_COLORS[booking.status];
                return (
                  <View
                    key={booking.id}
                    style={{
                      backgroundColor: COLORS.noiteSurface,
                      borderRadius: 20, overflow: 'hidden',
                      borderWidth: 1, borderColor: COLORS.border,
                    }}
                  >
                    <View style={{ height: 3, backgroundColor: statusColor }} />

                    <View style={{ padding: 18 }}>
                      {/* Header row */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.white, letterSpacing: -0.2, marginBottom: 2 }} numberOfLines={1}>
                            {booking.service_name}
                          </Text>
                          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                            {booking.establishment_name}
                          </Text>
                        </View>
                        <View style={{
                          backgroundColor: `${statusColor}18`,
                          paddingHorizontal: 10, paddingVertical: 5,
                          borderRadius: 100, marginLeft: 12,
                          borderWidth: 1, borderColor: `${statusColor}30`,
                        }}>
                          <Text style={{ color: statusColor, fontSize: 11, fontWeight: '700' }}>
                            {STATUS_LABELS[booking.status]}
                          </Text>
                        </View>
                      </View>

                      {/* Details */}
                      <View style={{ gap: 8, marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={{
                            width: 28, height: 28, borderRadius: 8,
                            backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Calendar size={14} color="rgba(255,255,255,0.5)" strokeWidth={1.8} />
                          </View>
                          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                            {new Date(booking.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {booking.time}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={{
                            width: 28, height: 28, borderRadius: 8,
                            backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Car size={14} color="rgba(255,255,255,0.5)" strokeWidth={1.8} />
                          </View>
                          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                            {booking.vehicle_model} · {booking.vehicle_plate}
                          </Text>
                        </View>
                      </View>

                      <View style={{ height: 1, backgroundColor: COLORS.border, marginBottom: 14 }} />
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 2 }}>Total</Text>
                          <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 18, letterSpacing: -0.3 }}>
                            R$ {booking.total_amount.toFixed(2).replace('.', ',')}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          {booking.status === 'concluido' && (
                            <TouchableOpacity style={{
                              backgroundColor: COLORS.surface, borderRadius: 100,
                              paddingHorizontal: 14, paddingVertical: 10,
                              borderWidth: 1, borderColor: COLORS.border,
                              flexDirection: 'row', alignItems: 'center', gap: 6,
                            }}>
                              <Star size={13} color="rgba(255,255,255,0.6)" strokeWidth={1.8} />
                              <Text style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 13 }}>Avaliar</Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            onPress={() => router.push(`/estabelecimento/${booking.establishment_id}`)}
                            style={{
                              backgroundColor: COLORS.chuva, borderRadius: 100,
                              paddingHorizontal: 16, paddingVertical: 10,
                            }}
                          >
                            <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>Ver detalhes</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
