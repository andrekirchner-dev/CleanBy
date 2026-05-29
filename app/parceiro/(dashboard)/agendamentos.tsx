import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Car, Check, X, Clock } from 'lucide-react-native';
import { usePartnerStore } from '../../../src/stores/partnerStore';
import { COLORS, STATUS_LABELS, STATUS_COLORS } from '../../../src/lib/constants';
import type { Booking } from '../../../src/types';

const TODAY = new Date().toISOString().split('T')[0];

type Tab = 'pendentes' | 'hoje' | 'historico';

export default function ParceiroAgendamentosScreen() {
  const { bookings, loading, confirmBooking, rejectBooking, completeBooking, subscribeBookings, establishment } = usePartnerStore();
  const [tab, setTab] = useState<Tab>('pendentes');

  useEffect(() => {
    if (!establishment) return;
    const unsub = subscribeBookings();
    return unsub ?? undefined;
  }, [establishment?.id]);

  const pending  = bookings.filter((b) => b.status === 'aguardando_confirmacao');
  const today    = bookings.filter((b) => b.date === TODAY && b.status !== 'cancelado' && b.status !== 'aguardando_confirmacao');
  const history  = bookings.filter((b) => ['concluido', 'cancelado'].includes(b.status));

  const list: Booking[] = tab === 'pendentes' ? pending : tab === 'hoje' ? today : history;

  const handleConfirm = (id: string) => {
    Alert.alert('Confirmar agendamento', 'Confirmar este agendamento?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: () => confirmBooking(id) },
    ]);
  };

  const handleReject = (id: string) => {
    Alert.alert('Recusar agendamento', 'Tem certeza? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Recusar', style: 'destructive', onPress: () => rejectBooking(id) },
    ]);
  };

  const handleComplete = (id: string) => {
    Alert.alert('Marcar como concluído', 'Confirmar que o serviço foi realizado?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', onPress: () => completeBooking(id) },
    ]);
  };

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'pendentes', label: 'Pendentes', count: pending.length },
    { key: 'hoje',      label: 'Hoje',      count: today.length   },
    { key: 'historico', label: 'Histórico', count: history.length },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
            Painel do Parceiro
          </Text>
          <Text style={{ color: COLORS.white, fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 18 }}>
            Agendamentos
          </Text>

          {/* Tab pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {TABS.map((t) => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setTab(t.key)}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  paddingHorizontal: 14, paddingVertical: 9, borderRadius: 100,
                  backgroundColor: tab === t.key ? COLORS.verdeAgua : COLORS.surface,
                  borderWidth: 1, borderColor: tab === t.key ? 'transparent' : COLORS.border,
                }}
              >
                <Text style={{ color: tab === t.key ? COLORS.white : 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: 13 }}>
                  {t.label}
                </Text>
                {t.count > 0 && (
                  <View style={{
                    width: 18, height: 18, borderRadius: 9,
                    backgroundColor: tab === t.key ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ color: tab === t.key ? COLORS.white : 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '800' }}>
                      {t.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={COLORS.verdeAgua} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ padding: 24, paddingTop: 8, gap: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {list.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
                <View style={{
                  width: 72, height: 72, borderRadius: 36,
                  backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Calendar size={32} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
                  {tab === 'pendentes' ? 'Nenhum pendente' : tab === 'hoje' ? 'Nenhum agendamento hoje' : 'Histórico vazio'}
                </Text>
              </View>
            ) : (
              list.map((b) => {
                const statusColor = STATUS_COLORS[b.status];
                const isPending = b.status === 'aguardando_confirmacao';
                const isConfirmed = b.status === 'confirmado';
                return (
                  <View key={b.id} style={{
                    backgroundColor: COLORS.noiteSurface, borderRadius: 18, overflow: 'hidden',
                    borderWidth: 1, borderColor: COLORS.border,
                  }}>
                    <View style={{ height: 3, backgroundColor: statusColor }} />
                    <View style={{ padding: 16 }}>

                      {/* Header */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 15, letterSpacing: -0.2 }} numberOfLines={1}>
                            {b.service_name}
                          </Text>
                          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>
                            R$ {b.total_amount.toFixed(2).replace('.', ',')}
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

                      {/* Details */}
                      <View style={{ gap: 7, marginBottom: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Calendar size={13} color="rgba(255,255,255,0.35)" strokeWidth={1.8} />
                          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                            {new Date(b.date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })} às {b.time.slice(0, 5)}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Car size={13} color="rgba(255,255,255,0.35)" strokeWidth={1.8} />
                          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                            {b.vehicle_model} · {b.vehicle_plate}
                          </Text>
                        </View>
                      </View>

                      {/* Actions */}
                      {isPending && (
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                          <TouchableOpacity
                            onPress={() => handleReject(b.id)}
                            style={{
                              flex: 1, paddingVertical: 11, borderRadius: 12,
                              backgroundColor: 'rgba(226,75,74,0.1)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.25)',
                              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                            }}
                          >
                            <X size={14} color={COLORS.error} strokeWidth={2.5} />
                            <Text style={{ color: COLORS.error, fontWeight: '700', fontSize: 13 }}>Recusar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleConfirm(b.id)}
                            style={{
                              flex: 1, paddingVertical: 11, borderRadius: 12,
                              backgroundColor: COLORS.verdeAgua,
                              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                            }}
                          >
                            <Check size={14} color={COLORS.white} strokeWidth={2.5} />
                            <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>Confirmar</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {isConfirmed && (
                        <TouchableOpacity
                          onPress={() => handleComplete(b.id)}
                          style={{
                            paddingVertical: 11, borderRadius: 12,
                            backgroundColor: 'rgba(0,201,160,0.12)', borderWidth: 1, borderColor: 'rgba(0,201,160,0.25)',
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}
                        >
                          <Clock size={14} color={COLORS.verdeAgua} strokeWidth={2} />
                          <Text style={{ color: COLORS.verdeAgua, fontWeight: '700', fontSize: 13 }}>Marcar como concluído</Text>
                        </TouchableOpacity>
                      )}
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
