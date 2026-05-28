import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { COLORS, STATUS_LABELS, STATUS_COLORS } from '../../src/lib/constants';
import type { Booking } from '../../src/types';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1', user_id: 'u1', service_id: 's1', vehicle_id: 'v1', establishment_id: 'e1',
    date: '2026-06-02', time: '10:00', status: 'confirmado',
    payment_type: 'reserva', amount_paid: 30, total_amount: 80, created_at: '2026-05-27',
    service: { id: 's1', establishment_id: 'e1', name: 'Lavagem Completa', price: 80, duration_min: 60, pro_discount_eligible: true, has_special_slots: false, category: 'lavagem_completa' },
    establishment: { id: 'e1', name: 'AutoSpa Premium', slug: 'autospa-premium', rating: 4.8, review_count: 124, address: 'Rua das Flores, 123', latitude: -23.55, longitude: -46.63, is_open: true, opening_hours: {}, has_mobile_service: false, categories: ['lavagem_completa'], cover_url: undefined, logo_url: undefined },
    vehicle: { id: 'v1', user_id: 'u1', plate: 'ABC-1234', model: 'Honda Civic', color: 'Prata' },
  },
  {
    id: '2', user_id: 'u1', service_id: 's2', vehicle_id: 'v1', establishment_id: 'e2',
    date: '2026-05-20', time: '14:00', status: 'concluido',
    payment_type: 'completo', amount_paid: 120, total_amount: 120, created_at: '2026-05-15',
    service: { id: 's2', establishment_id: 'e2', name: 'Polimento Técnico', price: 120, duration_min: 90, pro_discount_eligible: true, has_special_slots: true, category: 'polimento' },
    establishment: { id: 'e2', name: 'Shine & Clean', slug: 'shine-clean', rating: 4.9, review_count: 201, address: 'Rua Augusta, 789', latitude: -23.54, longitude: -46.65, is_open: false, opening_hours: {}, has_mobile_service: true, categories: ['polimento'], cover_url: undefined, logo_url: undefined },
    vehicle: { id: 'v1', user_id: 'u1', plate: 'ABC-1234', model: 'Honda Civic', color: 'Prata' },
  },
];

type Tab = 'proximos' | 'historico';

export default function AgendamentosScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('proximos');

  const upcoming = MOCK_BOOKINGS.filter((b) => ['aguardando_confirmacao', 'confirmado', 'em_andamento'].includes(b.status));
  const history = MOCK_BOOKINGS.filter((b) => ['concluido', 'cancelado'].includes(b.status));
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

        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 20, gap: 14 }} showsVerticalScrollIndicator={false}>
          {list.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 60, gap: 16 }}>
              <View style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 36 }}>📅</Text>
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
                  {/* Status bar top */}
                  <View style={{ height: 3, backgroundColor: statusColor }} />

                  <View style={{ padding: 18 }}>
                    {/* Header row */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.white, letterSpacing: -0.2, marginBottom: 2 }} numberOfLines={1}>
                          {booking.service?.name}
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                          {booking.establishment?.name}
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
                          <Text style={{ fontSize: 14 }}>📅</Text>
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
                          <Text style={{ fontSize: 14 }}>🚗</Text>
                        </View>
                        <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                          {booking.vehicle?.model} · {booking.vehicle?.plate}
                        </Text>
                      </View>
                    </View>

                    {/* Footer */}
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
                          }}>
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 13 }}>⭐ Avaliar</Text>
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
      </SafeAreaView>
    </View>
  );
}
