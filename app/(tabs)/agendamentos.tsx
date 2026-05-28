import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offWhite }}>
      <View style={{ backgroundColor: COLORS.noite, padding: 20, paddingBottom: 0 }}>
        <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: '800', marginBottom: 16 }}>
          Meus Agendamentos
        </Text>
        <View style={{ flexDirection: 'row' }}>
          {(['proximos', 'historico'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={{
                paddingBottom: 12, paddingHorizontal: 4, marginRight: 24,
                borderBottomWidth: 2,
                borderBottomColor: tab === t ? COLORS.chuva : 'transparent',
              }}
            >
              <Text style={{ color: tab === t ? COLORS.white : 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: 15 }}>
                {t === 'proximos' ? 'Próximos' : 'Histórico'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
            <Text style={{ fontSize: 48 }}>📅</Text>
            <Text style={{ color: COLORS.gray400, fontSize: 16 }}>
              {tab === 'proximos' ? 'Nenhum agendamento próximo' : 'Nenhum histórico ainda'}
            </Text>
            {tab === 'proximos' && (
              <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                <Text style={{ color: COLORS.chuva, fontWeight: '700', fontSize: 15 }}>Agendar agora →</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          list.map((booking) => (
            <View
              key={booking.id}
              style={{
                backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
                shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.noite, flex: 1 }} numberOfLines={1}>
                  {booking.service?.name}
                </Text>
                <View style={{
                  backgroundColor: STATUS_COLORS[booking.status] + '20',
                  paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginLeft: 8,
                }}>
                  <Text style={{ color: STATUS_COLORS[booking.status], fontSize: 11, fontWeight: '700' }}>
                    {STATUS_LABELS[booking.status]}
                  </Text>
                </View>
              </View>

              <Text style={{ color: COLORS.gray600, fontSize: 13, marginBottom: 4 }}>
                🏪 {booking.establishment?.name}
              </Text>
              <Text style={{ color: COLORS.gray600, fontSize: 13, marginBottom: 4 }}>
                📅 {new Date(booking.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {booking.time}
              </Text>
              <Text style={{ color: COLORS.gray600, fontSize: 13, marginBottom: 12 }}>
                🚗 {booking.vehicle?.model} • {booking.vehicle?.plate}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: COLORS.noite, fontWeight: '700', fontSize: 15 }}>
                  R$ {booking.total_amount.toFixed(2).replace('.', ',')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {booking.status === 'concluido' && (
                    <TouchableOpacity style={{ backgroundColor: COLORS.nevoa, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                      <Text style={{ color: COLORS.chuva, fontWeight: '700', fontSize: 13 }}>Avaliar</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => router.push(`/estabelecimento/${booking.establishment_id}`)}
                    style={{ backgroundColor: COLORS.chuva, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>Ver detalhes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
