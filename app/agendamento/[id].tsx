import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, X, Car, Plus, CheckCircle } from 'lucide-react-native';
import { useBookingStore } from '../../src/stores/bookingStore';
import { useAuthStore } from '../../src/stores/authStore';
import { useVehicleStore } from '../../src/stores/vehicleStore';
import { fetchBookedTimes } from '../../src/lib/db';
import { COLORS } from '../../src/lib/constants';
import { BookingStepIndicator } from '../../src/components/agendamento/BookingStepIndicator';
import { Button } from '../../src/components/ui/Button';
import { ProModal } from '../../src/components/ui/ProModal';

const STEP_LABELS = ['Serviço', 'Veículo', 'Data', 'Horário', 'Pagamento'];

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

const DAY_KEYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

function generateSlots(
  openingHours: Record<string, { open: string; close: string }>,
  dateStr: string,
  intervalMin = 60,
): string[] {
  const dayKey = DAY_KEYS[new Date(dateStr + 'T12:00:00').getDay()];
  const day = openingHours[dayKey];
  if (!day) return [];
  const [oh, om] = day.open.split(':').map(Number);
  const [ch, cm] = day.close.split(':').map(Number);
  const slots: string[] = [];
  for (let t = oh * 60 + om; t + intervalMin <= ch * 60 + cm; t += intervalMin) {
    slots.push(`${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`);
  }
  return slots;
}

export default function AgendamentoScreen() {
  const router = useRouter();
  const { draft, setVehicle, setDate, setTime, setPaymentType, resetDraft, confirm } = useBookingStore();
  const user = useAuthStore((s) => s.user);
  const { vehicles, fetch: fetchVehicles, add: vehicles_add } = useVehicleStore();
  const isPro = user?.plan === 'pro';
  const hasProQuota = (user?.pro_pay_on_site_quota ?? 0) > 0;

  const [step, setStep] = useState(0);
  const [showProModal, setShowProModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [slots, setSlots] = useState<string[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [vPlate, setVPlate] = useState('');
  const [vModel, setVModel] = useState('');
  const [vColor, setVColor] = useState('');
  const [vYear, setVYear] = useState('');
  const [vSaving, setVSaving] = useState(false);

  const handleAddVehicle = async () => {
    if (!user || !vPlate.trim() || !vModel.trim() || !vColor.trim()) return;
    setVSaving(true);
    try {
      const newVehicle = await vehicles_add({
        user_id: user.id,
        plate: vPlate.trim().toUpperCase(),
        model: vModel.trim(),
        color: vColor.trim(),
        year: vYear ? parseInt(vYear, 10) : undefined,
      });
      setVehicle(newVehicle);
      setShowVehicleModal(false);
      setVPlate(''); setVModel(''); setVColor(''); setVYear('');
    } catch {
      Alert.alert('Erro', 'Não foi possível adicionar o veículo.');
    } finally {
      setVSaving(false);
    }
  };

  const dates = generateDates();

  useEffect(() => { if (user) fetchVehicles(user.id); }, [user?.id]);

  useEffect(() => {
    if (!draft.date || !draft.establishment) return;
    const interval = draft.service ? Math.max(30, Math.ceil(draft.service.duration_min / 30) * 30) : 60;
    const generated = generateSlots(draft.establishment.opening_hours, draft.date, interval);
    setSlots(generated);
    setTime('');
    setSlotsLoading(true);
    fetchBookedTimes(draft.establishment.id, draft.date)
      .then(setBookedTimes)
      .catch(() => setBookedTimes([]))
      .finally(() => setSlotsLoading(false));
  }, [draft.date, draft.establishment?.id]);

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
    if (!user) return;
    setSubmitting(true);
    try {
      await confirm(user.id);
      setConfirmed(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível confirmar o agendamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    resetDraft();
    router.replace('/(tabs)/agendamentos');
  };

  if (confirmed) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.noite, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ alignItems: 'center', gap: 20 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,201,160,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,201,160,0.3)' }}>
            <CheckCircle size={48} color={COLORS.verdeAgua} strokeWidth={1.5} />
          </View>
          <Text style={{ color: COLORS.white, fontSize: 24, fontWeight: '800', textAlign: 'center', letterSpacing: -0.4 }}>
            Horário garantido!
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            Seu carro será atendido em{' '}
            <Text style={{ color: COLORS.verdeAgua, fontWeight: '700' }}>
              {draft.date ? new Date(draft.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }) : ''} às {draft.time}
            </Text>
          </Text>
          <View style={{ backgroundColor: COLORS.noiteSurface, borderRadius: 16, padding: 16, width: '100%', gap: 8, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>{draft.service?.name}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{draft.establishment?.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Car size={13} color="rgba(255,255,255,0.4)" strokeWidth={1.8} />
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{draft.vehicle?.model} · {draft.vehicle?.plate}</Text>
            </View>
          </View>
          <Button label="Ver meus agendamentos" onPress={handleDone} fullWidth size="lg" />
          <TouchableOpacity onPress={() => { resetDraft(); router.replace('/(tabs)'); }}>
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Voltar para o início</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            onPress={() => step > 0 ? setStep(step - 1) : router.back()}
            style={{
              width: 38, height: 38, borderRadius: 19,
              backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: '700', flex: 1 }}>Agendamento</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 38, height: 38, borderRadius: 19,
              backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} color="rgba(255,255,255,0.5)" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <BookingStepIndicator current={step} total={5} labels={STEP_LABELS} />

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

          {/* Step 0: Service summary */}
          {step === 0 && draft.service && (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 4, letterSpacing: -0.3 }}>Resumo do serviço</Text>
              <View style={{ backgroundColor: COLORS.noiteSurface, borderRadius: 16, padding: 20, gap: 10, borderWidth: 1, borderColor: COLORS.border }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.white }}>{draft.service.name}</Text>
                {draft.service.description && (
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 20 }}>{draft.service.description}</Text>
                )}
                <View style={{ height: 1, backgroundColor: COLORS.border }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.4)' }}>Duração</Text>
                  <Text style={{ fontWeight: '700', color: COLORS.white }}>{draft.service.duration_min} min</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.4)' }}>Local</Text>
                  <Text style={{ fontWeight: '700', color: COLORS.white, flex: 1, textAlign: 'right' }} numberOfLines={1}>{draft.establishment?.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.4)' }}>Valor</Text>
                  <Text style={{ fontWeight: '800', color: COLORS.white, fontSize: 17 }}>
                    R$ {draft.service.price.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Step 1: Vehicle */}
          {step === 1 && (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 4, letterSpacing: -0.3 }}>Qual veículo?</Text>
              {vehicles.length === 0 && (
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
                  Você ainda não tem veículos cadastrados.
                </Text>
              )}
              {vehicles.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => setVehicle(v)}
                  style={{
                    backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 16,
                    flexDirection: 'row', alignItems: 'center',
                    borderWidth: 2, borderColor: draft.vehicle?.id === v.id ? COLORS.chuva : COLORS.border,
                  }}
                >
                  <View style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', marginRight: 14,
                  }}>
                    <Car size={20} color={draft.vehicle?.id === v.id ? COLORS.chuva : 'rgba(255,255,255,0.5)'} strokeWidth={1.8} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', color: COLORS.white, fontSize: 15 }}>{v.model}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{v.plate} · {v.color}</Text>
                  </View>
                  {draft.vehicle?.id === v.id && (
                    <CheckCircle size={20} color={COLORS.chuva} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setShowVehicleModal(true)}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16,
                  backgroundColor: COLORS.noiteSurface, borderRadius: 14,
                  borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed',
                }}
              >
                <Plus size={18} color={COLORS.chuva} strokeWidth={2} />
                <Text style={{ color: COLORS.chuva, fontWeight: '700' }}>Adicionar novo veículo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2: Date */}
          {step === 2 && (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 4, letterSpacing: -0.3 }}>Qual data?</Text>
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
                        backgroundColor: selected ? COLORS.chuva : COLORS.noiteSurface,
                        borderWidth: 1, borderColor: selected ? COLORS.chuva : COLORS.border,
                      }}
                    >
                      <Text style={{ color: selected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'capitalize' }}>{dayName}</Text>
                      <Text style={{ color: selected ? COLORS.white : COLORS.white, fontWeight: '800', fontSize: 20 }}>{dayNum}</Text>
                      <Text style={{ color: selected ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)', fontSize: 11, textTransform: 'capitalize' }}>{month}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Step 3: Time */}
          {step === 3 && (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 4, letterSpacing: -0.3 }}>Qual horário?</Text>

              {slotsLoading ? (
                <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                  <ActivityIndicator color={COLORS.chuva} />
                  <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 10 }}>Verificando disponibilidade...</Text>
                </View>
              ) : slots.length === 0 ? (
                <View style={{
                  backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 24,
                  alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
                }}>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center' }}>
                    Nenhum horário disponível neste dia.{'\n'}Selecione outra data.
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {slots.map((t) => {
                    const booked = bookedTimes.includes(t);
                    const selected = draft.time === t;
                    return (
                      <TouchableOpacity
                        key={t}
                        onPress={() => !booked && setTime(t)}
                        disabled={booked}
                        style={{
                          paddingHorizontal: 18, paddingVertical: 14, borderRadius: 12,
                          backgroundColor: selected ? COLORS.chuva : booked ? 'rgba(255,255,255,0.03)' : COLORS.noiteSurface,
                          borderWidth: 1.5,
                          borderColor: selected ? COLORS.chuva : booked ? 'rgba(255,255,255,0.06)' : COLORS.border,
                        }}
                      >
                        <Text style={{
                          fontWeight: '700', fontSize: 15,
                          color: selected ? COLORS.white : booked ? 'rgba(255,255,255,0.2)' : COLORS.white,
                          textDecorationLine: booked ? 'line-through' : 'none',
                        }}>{t}</Text>
                        {booked && (
                          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, marginTop: 2, textAlign: 'center' }}>
                            Ocupado
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Step 4: Payment */}
          {step === 4 && draft.service && (
            <View style={{ gap: 12 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.white, marginBottom: 4, letterSpacing: -0.3 }}>Como deseja pagar?</Text>

              {[
                { type: 'reserva' as const, label: 'Pagar reserva agora', desc: `Confirma o horário com R$ ${(draft.service.price * 0.3).toFixed(2).replace('.', ',')} de entrada` },
                { type: 'completo' as const, label: 'Pagar valor completo', desc: `R$ ${draft.service.price.toFixed(2).replace('.', ',')} — pagamento integral agora` },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.type}
                  onPress={() => setPaymentType(opt.type)}
                  style={{
                    backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 16,
                    borderWidth: 2, borderColor: draft.paymentType === opt.type ? COLORS.chuva : COLORS.border,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', color: COLORS.white, fontSize: 15 }}>{opt.label}</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>{opt.desc}</Text>
                    </View>
                    {draft.paymentType === opt.type && (
                      <CheckCircle size={20} color={COLORS.chuva} strokeWidth={2} style={{ marginLeft: 12 }} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {isPro && hasProQuota && (
                <TouchableOpacity
                  onPress={() => setPaymentType('no_local')}
                  style={{
                    backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 16,
                    borderWidth: 2, borderColor: draft.paymentType === 'no_local' ? COLORS.verdeAgua : 'rgba(0,201,160,0.2)',
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', color: COLORS.verdeAgua, fontSize: 15 }}>✦ Pagar no local</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>Benefício PRO · Cota disponível</Text>
                    </View>
                    {draft.paymentType === 'no_local' && (
                      <CheckCircle size={20} color={COLORS.verdeAgua} strokeWidth={2} style={{ marginLeft: 12 }} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: COLORS.noite, padding: 20,
          borderTopWidth: 1, borderTopColor: COLORS.border,
        }}>
          <Button
            label={step === 4 ? 'Confirmar agendamento' : 'Próximo'}
            onPress={handleNext}
            disabled={!canNext()}
            loading={submitting}
            fullWidth size="lg"
          />
        </View>
      </SafeAreaView>

      <ProModal visible={showProModal} onClose={() => setShowProModal(false)} onSubscribe={() => { setShowProModal(false); router.push('/pro'); }} />

      {/* Add vehicle modal */}
      <Modal visible={showVehicleModal} animationType="slide" transparent presentationStyle="overFullScreen">
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{
            backgroundColor: '#0D1829', borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: 24, paddingBottom: 36, gap: 16,
            borderTopWidth: 1, borderColor: COLORS.border,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: '800' }}>Novo veículo</Text>
              <TouchableOpacity onPress={() => setShowVehicleModal(false)}>
                <X size={20} color="rgba(255,255,255,0.4)" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {[
              { label: 'Modelo *', value: vModel, set: setVModel, placeholder: 'Ex: Honda Civic' },
              { label: 'Placa *', value: vPlate, set: setVPlate, placeholder: 'Ex: ABC-1234', upper: true },
              { label: 'Cor *', value: vColor, set: setVColor, placeholder: 'Ex: Prata' },
              { label: 'Ano', value: vYear, set: setVYear, placeholder: 'Ex: 2022', numeric: true },
            ].map(({ label, value, set, placeholder, upper, numeric }) => (
              <View key={label}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
                <TextInput
                  value={value}
                  onChangeText={(t) => set(upper ? t.toUpperCase() : t)}
                  placeholder={placeholder}
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  keyboardType={numeric ? 'numeric' : 'default'}
                  style={{
                    backgroundColor: COLORS.surface, borderRadius: 12,
                    borderWidth: 1, borderColor: COLORS.border,
                    color: COLORS.white, fontSize: 15, padding: 14,
                  }}
                />
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAddVehicle}
              disabled={!vPlate.trim() || !vModel.trim() || !vColor.trim() || vSaving}
              style={{
                backgroundColor: (!vPlate.trim() || !vModel.trim() || !vColor.trim()) ? 'rgba(26,122,200,0.4)' : COLORS.chuva,
                borderRadius: 100, paddingVertical: 15, alignItems: 'center', marginTop: 4,
              }}
              activeOpacity={0.8}
            >
              {vSaving
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 15 }}>Adicionar veículo</Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
