import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, MapPin, Phone, Clock, Navigation, Save } from 'lucide-react-native';
import { usePartnerStore } from '../../../src/stores/partnerStore';
import { COLORS } from '../../../src/lib/constants';

const DAYS = [
  { key: 'seg', label: 'Segunda' },
  { key: 'ter', label: 'Terça'   },
  { key: 'qua', label: 'Quarta'  },
  { key: 'qui', label: 'Quinta'  },
  { key: 'sex', label: 'Sexta'   },
  { key: 'sab', label: 'Sábado'  },
  { key: 'dom', label: 'Domingo' },
];

export default function ParceiroEstabelecimentoScreen() {
  const { establishment, updateEstablishment, loading } = usePartnerStore();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [hasMobile, setHasMobile] = useState(false);
  const [mobileRadius, setMobileRadius] = useState('');
  const [hours, setHours] = useState<Record<string, { open: string; close: string; active: boolean }>>({});

  useEffect(() => {
    if (!establishment) return;
    setName(establishment.name ?? '');
    setDescription(establishment.description ?? '');
    setAddress(establishment.address ?? '');
    setPhone((establishment as any).phone ?? '');
    setHasMobile(establishment.has_mobile_service);
    setMobileRadius(establishment.mobile_radius_km?.toString() ?? '');

    const h: typeof hours = {};
    DAYS.forEach(({ key }) => {
      const day = establishment.opening_hours?.[key];
      h[key] = day
        ? { open: day.open, close: day.close, active: true }
        : { open: '08:00', close: '18:00', active: false };
    });
    setHours(h);
  }, [establishment?.id]);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Atenção', 'Informe o nome do estabelecimento'); return; }
    setSaving(true);

    const opening_hours: Record<string, { open: string; close: string }> = {};
    Object.entries(hours).forEach(([key, val]) => {
      if (val.active) opening_hours[key] = { open: val.open, close: val.close };
    });

    await updateEstablishment({
      name: name.trim(),
      description: description.trim() || undefined,
      address: address.trim(),
      has_mobile_service: hasMobile,
      mobile_radius_km: hasMobile && mobileRadius ? parseInt(mobileRadius) : undefined,
      opening_hours,
      ...(phone.trim() ? { phone: phone.trim() } : {}),
    } as any);

    setSaving(false);
    Alert.alert('Salvo!', 'Estabelecimento atualizado com sucesso.');
  };

  const Field = ({
    label, value, onChange, placeholder, multiline, keyboardType, icon: Icon,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; multiline?: boolean; keyboardType?: any; icon: any;
  }) => (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{label}</Text>
      <View style={{
        flexDirection: multiline ? 'column' : 'row', alignItems: multiline ? 'flex-start' : 'center',
        gap: multiline ? 0 : 12,
        backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 16,
        paddingVertical: multiline ? 12 : 0,
        borderWidth: 1, borderColor: COLORS.border,
      }}>
        {!multiline && <Icon size={16} color="rgba(255,255,255,0.3)" strokeWidth={1.8} />}
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.2)"
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          keyboardType={keyboardType ?? 'default'}
          style={{
            flex: 1, color: COLORS.white, fontSize: 15,
            paddingVertical: multiline ? 4 : 16,
            minHeight: multiline ? 72 : undefined,
            textAlignVertical: multiline ? 'top' : undefined,
          }}
        />
      </View>
    </View>
  );

  if (loading && !establishment) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.noite, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.verdeAgua} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
            Painel do Parceiro
          </Text>
          <Text style={{ color: COLORS.white, fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 28 }}>
            Estabelecimento
          </Text>

          {/* Informações básicas */}
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
            Informações Básicas
          </Text>
          <Field label="Nome" value={name} onChange={setName} placeholder="AutoSpa Premium" icon={Building2} />
          <Field label="Descrição" value={description} onChange={setDescription} placeholder="Descreva seu estabelecimento..." multiline icon={Building2} />
          <Field label="Endereço" value={address} onChange={setAddress} placeholder="Rua das Flores, 123 — Jardins" icon={MapPin} />
          <Field label="Telefone" value={phone} onChange={setPhone} placeholder="(11) 99999-9999" keyboardType="phone-pad" icon={Phone} />

          {/* Serviço móvel */}
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 20 }} />
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
            Serviço Móvel
          </Text>
          <View style={{
            backgroundColor: COLORS.noiteSurface, borderRadius: 16, padding: 16,
            borderWidth: 1, borderColor: COLORS.border, marginBottom: 14,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Navigation size={18} color={hasMobile ? COLORS.verdeAgua : 'rgba(255,255,255,0.35)'} strokeWidth={2} />
                <View>
                  <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>Vai até o cliente</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>Atende no endereço do cliente</Text>
                </View>
              </View>
              <Switch
                value={hasMobile}
                onValueChange={setHasMobile}
                trackColor={{ false: COLORS.surface, true: 'rgba(0,201,160,0.5)' }}
                thumbColor={hasMobile ? COLORS.verdeAgua : 'rgba(255,255,255,0.3)'}
              />
            </View>
          </View>
          {hasMobile && (
            <Field
              label="Raio de atendimento (km)"
              value={mobileRadius}
              onChange={setMobileRadius}
              placeholder="10"
              keyboardType="numeric"
              icon={Navigation}
            />
          )}

          {/* Horários */}
          <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 20 }} />
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
            Horário de Funcionamento
          </Text>
          <View style={{ gap: 10 }}>
            {DAYS.map(({ key, label }) => {
              const h = hours[key] ?? { open: '08:00', close: '18:00', active: false };
              return (
                <View key={key} style={{
                  backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 14,
                  borderWidth: 1, borderColor: h.active ? 'rgba(0,201,160,0.2)' : COLORS.border,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Clock size={14} color={h.active ? COLORS.verdeAgua : 'rgba(255,255,255,0.25)'} strokeWidth={2} />
                      <Text style={{ color: h.active ? COLORS.white : 'rgba(255,255,255,0.3)', fontWeight: '600', fontSize: 14 }}>
                        {label}
                      </Text>
                    </View>
                    <Switch
                      value={h.active}
                      onValueChange={(v) => setHours((prev) => ({ ...prev, [key]: { ...h, active: v } }))}
                      trackColor={{ false: COLORS.surface, true: 'rgba(0,201,160,0.5)' }}
                      thumbColor={h.active ? COLORS.verdeAgua : 'rgba(255,255,255,0.3)'}
                    />
                  </View>
                  {h.active && (
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                      {(['open', 'close'] as const).map((field) => (
                        <View key={field} style={{ flex: 1 }}>
                          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 6 }}>
                            {field === 'open' ? 'Abertura' : 'Fechamento'}
                          </Text>
                          <TextInput
                            value={h[field]}
                            onChangeText={(v) => {
                              const cleaned = v.replace(/[^0-9:]/g, '').slice(0, 5);
                              setHours((prev) => ({ ...prev, [key]: { ...h, [field]: cleaned } }));
                            }}
                            placeholder="08:00"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            keyboardType="numeric"
                            style={{
                              backgroundColor: COLORS.surface, borderRadius: 10,
                              paddingHorizontal: 12, paddingVertical: 10,
                              color: COLORS.white, fontSize: 14, fontWeight: '600',
                              borderWidth: 1, borderColor: COLORS.border, textAlign: 'center',
                            }}
                          />
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: COLORS.verdeAgua, borderRadius: 16,
              paddingVertical: 17, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 8,
              marginTop: 28, opacity: saving ? 0.7 : 1,
            }}
          >
            <Save size={18} color={COLORS.white} strokeWidth={2} />
            <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 16 }}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
