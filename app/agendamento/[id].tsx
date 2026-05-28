import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useBookingStore } from '../../src/stores/bookingStore';
import { useAuthStore } from '../../src/stores/authStore';
import { COLORS } from '../../src/lib/constants';
import { BookingStepIndicator } from '../../src/components/agendamento/BookingStepIndicator';
import { Button } from '../../src/components/ui/Button';
import { ProModal } from '../../src/components/ui/ProModal';

const STEP_LABELS = ['Serviço', 'Veículo', 'Data', 'Horário', 'Pagamento'];

const MOCK_VEHICLES = [
  { id: 'v1', user_id: 'u1', plate: 'ABC-1234', model: 'Honda Civic', color: 'Prata' },
  { id: 'v2', user_id: 'u1', plate: 'XYZ-5678', model: 'Toyota Corolla', color: 'Branco' },
];

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const AVAILABLE_TIMES = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
const SPECIAL_TIMES = ['09:00', '14:00'];

export default function AgendamentoScreen() {
  const router = useRouter();
  const { draft, setVehicle, setDate, setTime, setPaymentType, resetDraft } = useBookingStore();
  const user = useAuthStore((s) => s.user);
  const isPro = user?.plan === 'pro';
  const hasProQuota = (user?.pro_pay_on_site_quota ?? 0) > 0;

  const [step, setStep] = useState(0);
  const [showProModal, setShowProModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const dates = generateDates();

  const canNext = () => {
    if (step === 1) return !!draft.vehicle;
    if (step === 2) return !!draft.date;
    if (step === 3) return !!draft.time;
    if (step === 4) return !!draft.paymentType;
    return true;
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleConfirm();
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setConfirmed(true);
  };

  const handleDone = () => {
    resetDraft();
    router.replace('/(tabs)/agendamentos');
  };

  if (confirmed) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.noite, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ alignItems: 'center', gap: 20 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.verdeAgua, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 48 }}>✓</Text>
          </View>
          <Text style={{ color: COLORS.white, fontSize: 24, fontWeight: '800', textAlign: 'center' }}>
            Horário garantido!
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            Seu carro será atendido em{' '}
            <Text style={{ color: COLORS.verdeAgua, fontWeight: '700' }}>
              {draft.date ? new Date(draft.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }) : ''} às {draft.time}
            </Text>
          </Text>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 16, width: '100%', gap: 8 }}>
            <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>{draft.service?.name}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{draft.establishment?.name}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>🚗 {draft.vehicle?.model} • {draft.vehicle?.plate}</Text>
          </View>
          <Button label="Ver meus agendamentos" onPress={handleDone} fullWidth size="lg" />
          <TouchableOpacity onPress={() => { resetDraft(); router.replace('/(tabs)'); }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Voltar para o início</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offWhite }}>
      {/* Header */}
      <View style={{ backgroundColor: COLORS.noite, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()}>
          <Text style={{ color: COLORS.chuva, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: '700', flex: 1 }}>Agendamento</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>
      <BookingStepIndicator current={step} total={5} labels={STEP_LABELS} />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Step 0: Service summary */}
        {step === 0 && draft.service && (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.noite, marginBottom: 4 }}>Resumo do serviço</Text>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20, gap: 10 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.noite }}>{draft.service.name}</Text>
              <Text style={{ color: COLORS.gray600, fontSize: 14, lineHeight: 20 }}>{draft.service.description}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.gray200 }}>
                <Text style={{ color: COLORS.gray600 }}>⏱ Duração</Text>
                <Text style={{ fontWeight: '700', color: COLORS.noite }}>{draft.service.duration_min} min</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: COLORS.gray600 }}>📍 Local</Text>
                <Text style={{ fontWeight: '700', color: COLORS.noite, flex: 1, textAlign: 'right' }} numberOfLines={1}>{draft.establishment?.name}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: COLORS.gray600 }}>💰 Valor</Text>
                <Text style={{ fontWeight: '800', color: COLORS.noite, fontSize: 17 }}>
                  R$ {draft.service.price.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Step 1: Vehicle */}
        {step === 1 && (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.noite, marginBottom: 4 }}>Qual veículo?</Text>
            {MOCK_VEHICLES.map((v) => (
              <TouchableOpacity
                key={v.id}
                onPress={() => setVehicle(v)}
                style={{
                  backgroundColor: COLORS.white, borderRadius: 14, padding: 16,
                  flexDirection: 'row', alignItems: 'center',
                  borderWidth: 2, borderColor: draft.vehicle?.id === v.id ? COLORS.chuva : 'transparent',
                }}
              >
                <Text style={{ fontSize: 28, marginRight: 14 }}>🚗</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: COLORS.noite, fontSize: 15 }}>{v.model}</Text>
                  <Text style={{ color: COLORS.gray400, fontSize: 13 }}>{v.plate} • {v.color}</Text>
                </View>
                {draft.vehicle?.id === v.id && <Text style={{ color: COLORS.chuva, fontSize: 20 }}>●</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, backgroundColor: COLORS.nevoa, borderRadius: 14 }}>
              <Text style={{ fontSize: 20 }}>➕</Text>
              <Text style={{ color: COLORS.chuva, fontWeight: '700' }}>Adicionar novo veículo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Date */}
        {step === 2 && (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.noite, marginBottom: 4 }}>Qual data?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {dates.map((d) => {
                const iso = d.toISOString().split('T')[0];
                const selected = draft.date === iso;
                const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                const dayNum = d.getDate();
                const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
                return (
                  <TouchableOpacity
                    key={iso}
                    onPress={() => setDate(iso)}
                    style={{
                      width: 72, alignItems: 'center', padding: 12, borderRadius: 14,
                      backgroundColor: selected ? COLORS.chuva : COLORS.white,
                      borderWidth: 1, borderColor: selected ? COLORS.chuva : COLORS.gray200,
                    }}
                  >
                    <Text style={{ color: selected ? 'rgba(255,255,255,0.8)' : COLORS.gray400, fontSize: 11, textTransform: 'capitalize' }}>{dayName}</Text>
                    <Text style={{ color: selected ? COLORS.white : COLORS.noite, fontWeight: '800', fontSize: 20 }}>{dayNum}</Text>
                    <Text style={{ color: selected ? 'rgba(255,255,255,0.8)' : COLORS.gray400, fontSize: 11, textTransform: 'capitalize' }}>{month}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.noite, marginBottom: 4 }}>Qual horário?</Text>
            {!isPro && (
              <TouchableOpacity onPress={() => setShowProModal(true)} style={{ backgroundColor: COLORS.noite, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: COLORS.verdeAgua, fontSize: 13 }}>✦ Horários exclusivos PRO disponíveis</Text>
                <Text style={{ color: COLORS.verdeAgua, fontWeight: '700' }}>Ver →</Text>
              </TouchableOpacity>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {AVAILABLE_TIMES.map((t) => {
                const isSpecial = SPECIAL_TIMES.includes(t);
                const selected = draft.time === t;
                const locked = isSpecial && !isPro;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => locked ? setShowProModal(true) : setTime(t)}
                    style={{
                      paddingHorizontal: 18, paddingVertical: 14, borderRadius: 12,
                      backgroundColor: selected ? COLORS.chuva : locked ? COLORS.gray100 : COLORS.white,
                      borderWidth: 1.5, borderColor: selected ? COLORS.chuva : isSpecial && isPro ? COLORS.verdeAgua : COLORS.gray200,
                      flexDirection: 'row', alignItems: 'center', gap: 6,
                    }}
                  >
                    {isSpecial && <Text style={{ color: isPro ? COLORS.verdeAgua : COLORS.gray400, fontSize: 12 }}>✦</Text>}
                    <Text style={{
                      fontWeight: '700', fontSize: 15,
                      color: selected ? COLORS.white : locked ? COLORS.gray400 : COLORS.noite,
                    }}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 4: Payment */}
        {step === 4 && draft.service && (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.noite, marginBottom: 4 }}>Como deseja pagar?</Text>

            {[
              { type: 'reserva' as const, label: 'Pagar reserva agora', desc: `Confirma o horário com R$ ${(draft.service.price * 0.3).toFixed(2).replace('.', ',')} de entrada`, icon: '🔒' },
              { type: 'completo' as const, label: 'Pagar valor completo', desc: `R$ ${draft.service.price.toFixed(2).replace('.', ',')} — pagamento integral agora`, icon: '💳' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.type}
                onPress={() => setPaymentType(opt.type)}
                style={{
                  backgroundColor: COLORS.white, borderRadius: 14, padding: 16,
                  flexDirection: 'row', alignItems: 'center', gap: 14,
                  borderWidth: 2, borderColor: draft.paymentType === opt.type ? COLORS.chuva : 'transparent',
                }}
              >
                <Text style={{ fontSize: 28 }}>{opt.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: COLORS.noite, fontSize: 15 }}>{opt.label}</Text>
                  <Text style={{ color: COLORS.gray600, fontSize: 13, marginTop: 2 }}>{opt.desc}</Text>
                </View>
                {draft.paymentType === opt.type && <Text style={{ color: COLORS.chuva, fontSize: 20 }}>●</Text>}
              </TouchableOpacity>
            ))}

            {isPro && hasProQuota && (
              <TouchableOpacity
                onPress={() => setPaymentType('no_local')}
                style={{
                  backgroundColor: COLORS.noite, borderRadius: 14, padding: 16,
                  flexDirection: 'row', alignItems: 'center', gap: 14,
                  borderWidth: 2, borderColor: draft.paymentType === 'no_local' ? COLORS.verdeAgua : 'transparent',
                }}
              >
                <Text style={{ fontSize: 28 }}>✦</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: COLORS.verdeAgua, fontSize: 15 }}>Pagar no local</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>Benefício PRO • Cota disponível</Text>
                </View>
                {draft.paymentType === 'no_local' && <Text style={{ color: COLORS.verdeAgua, fontSize: 20 }}>●</Text>}
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: COLORS.white, padding: 20,
        borderTopWidth: 1, borderTopColor: COLORS.gray200,
        shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08, shadowRadius: 8, elevation: 8,
      }}>
        <Button
          label={step === 4 ? 'Confirmar agendamento' : 'Próximo'}
          onPress={handleNext}
          disabled={!canNext()}
          loading={submitting}
          fullWidth size="lg"
        />
      </View>

      <ProModal visible={showProModal} onClose={() => setShowProModal(false)} onSubscribe={() => { setShowProModal(false); router.push('/pro'); }} />
    </SafeAreaView>
  );
}
