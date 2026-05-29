import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, Lock, Building2, MapPin, AlertCircle, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../../src/stores/authStore';
import { usePartnerStore } from '../../../src/stores/partnerStore';
import { COLORS } from '../../../src/lib/constants';

function validateCNPJ(cnpj: string): boolean {
  const c = cnpj.replace(/\D/g, '');
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const calc = (len: number) => {
    let sum = 0, pos = len - 7;
    for (let i = len; i >= 1; i--) {
      sum += parseInt(c[len - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11);
  };
  return calc(12) === parseInt(c[12]) && calc(13) === parseInt(c[13]);
}

function maskCNPJ(v: string): string {
  return v.replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

function maskPhone(v: string): string {
  return v.replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

const STEP_LABELS = ['Conta', 'Empresa', 'Senha'];

export default function ParceiroCadastroScreen() {
  const router = useRouter();
  const { signUpPartner } = useAuthStore();
  const { createEstablishment } = usePartnerStore();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 0 — Conta
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 1 — Empresa
  const [estName, setEstName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Step 2 — Senha
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const validateStep = (): string | null => {
    if (step === 0) {
      if (!name.trim()) return 'Informe seu nome completo';
      if (!email.trim() || !email.includes('@')) return 'E-mail inválido';
      if (phone.replace(/\D/g, '').length < 10) return 'Telefone inválido';
    }
    if (step === 1) {
      if (!estName.trim()) return 'Informe o nome do estabelecimento';
      if (!validateCNPJ(cnpj)) return 'CNPJ inválido';
      if (!address.trim()) return 'Informe o endereço';
      if (!city.trim()) return 'Informe a cidade';
    }
    if (step === 2) {
      if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres';
      if (password !== confirm) return 'As senhas não coincidem';
    }
    return null;
  };

  const handleNext = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    if (step < 2) { setStep(step + 1); return; }
    await handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await signUpPartner(email.trim(), password, name.trim(), phone);
    if (result.error) { setError(result.error); setLoading(false); return; }

    const { user } = useAuthStore.getState();
    if (user) {
      await createEstablishment({
        partner_id: user.id,
        name: estName.trim(),
        slug: estName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        address: `${address.trim()}, ${city.trim()}`,
        city: city.trim(),
        latitude: 0,
        longitude: 0,
        rating: 0,
        review_count: 0,
        opening_hours: {},
        has_mobile_service: false,
        categories: [],
        cover_url: undefined,
        logo_url: undefined,
      });
    }

    setLoading(false);
    router.replace('/parceiro/(dashboard)');
  };

  const Field = ({
    label, value, onChange, placeholder, keyboardType, secure, mask,
    icon: Icon,
  }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder: string; keyboardType?: any; secure?: boolean;
    mask?: (v: string) => string; icon: any;
  }) => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{label}</Text>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 16,
        borderWidth: 1, borderColor: COLORS.border,
      }}>
        <Icon size={16} color="rgba(255,255,255,0.3)" strokeWidth={1.8} />
        <TextInput
          value={value}
          onChangeText={(t) => onChange(mask ? mask(t) : t)}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.2)"
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
          secureTextEntry={secure}
          style={{ flex: 1, color: COLORS.white, fontSize: 16, paddingVertical: 16 }}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} keyboardShouldPersistTaps="handled">

            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <TouchableOpacity
                onPress={() => step > 0 ? setStep(step - 1) : router.back()}
                style={{
                  width: 40, height: 40, borderRadius: 20,
                  backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ArrowLeft size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
              </TouchableOpacity>

              {/* Step dots */}
              <View style={{ flexDirection: 'row', gap: 8, flex: 1, justifyContent: 'center' }}>
                {STEP_LABELS.map((_, i) => (
                  <View key={i} style={{
                    width: i === step ? 24 : 8, height: 8, borderRadius: 4,
                    backgroundColor: i <= step ? COLORS.verdeAgua : 'rgba(255,255,255,0.15)',
                  }} />
                ))}
              </View>

              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, width: 40, textAlign: 'right' }}>
                {step + 1}/{STEP_LABELS.length}
              </Text>
            </View>

            <View style={{ marginBottom: 28 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.verdeAgua }} />
                <Text style={{ color: COLORS.verdeAgua, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                  {STEP_LABELS[step]}
                </Text>
              </View>
              <Text style={{ color: COLORS.white, fontSize: 24, fontWeight: '800', letterSpacing: -0.4 }}>
                {step === 0 && 'Seus dados'}
                {step === 1 && 'Seu estabelecimento'}
                {step === 2 && 'Crie sua senha'}
              </Text>
            </View>

            {error ? (
              <View style={{
                backgroundColor: 'rgba(226,75,74,0.1)', borderRadius: 12, padding: 14,
                flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20,
                borderWidth: 1, borderColor: 'rgba(226,75,74,0.2)',
              }}>
                <AlertCircle size={16} color={COLORS.error} strokeWidth={2} />
                <Text style={{ color: COLORS.error, fontSize: 14, flex: 1 }}>{error}</Text>
              </View>
            ) : null}

            {/* Step 0 — Conta */}
            {step === 0 && (
              <View>
                <Field label="Nome completo" value={name} onChange={setName} placeholder="João Silva" icon={User} />
                <Field label="E-mail" value={email} onChange={setEmail} placeholder="joao@empresa.com" keyboardType="email-address" icon={Mail} />
                <Field label="Telefone" value={phone} onChange={setPhone} placeholder="(11) 99999-9999" keyboardType="phone-pad" mask={maskPhone} icon={Phone} />
              </View>
            )}

            {/* Step 1 — Empresa */}
            {step === 1 && (
              <View>
                <Field label="Nome do estabelecimento" value={estName} onChange={setEstName} placeholder="AutoSpa Premium" icon={Building2} />
                <Field label="CNPJ" value={cnpj} onChange={setCnpj} placeholder="00.000.000/0001-00" keyboardType="numeric" mask={maskCNPJ} icon={Building2} />
                <Field label="Endereço" value={address} onChange={setAddress} placeholder="Rua das Flores, 123" icon={MapPin} />
                <Field label="Cidade" value={city} onChange={setCity} placeholder="São Paulo" icon={MapPin} />
              </View>
            )}

            {/* Step 2 — Senha */}
            {step === 2 && (
              <View>
                <Field label="Senha" value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres" secure icon={Lock} />
                <Field label="Confirmar senha" value={confirm} onChange={setConfirm} placeholder="Repita a senha" secure icon={Lock} />
              </View>
            )}

            <TouchableOpacity
              onPress={handleNext}
              disabled={loading}
              style={{
                backgroundColor: COLORS.verdeAgua, borderRadius: 16,
                paddingVertical: 17, alignItems: 'center',
                flexDirection: 'row', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.7 : 1, marginTop: 12,
              }}
            >
              <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 16 }}>
                {loading ? 'Criando conta...' : step === 2 ? 'Criar conta' : 'Continuar'}
              </Text>
              {!loading && <ChevronRight size={18} color={COLORS.white} strokeWidth={2.5} />}
            </TouchableOpacity>

            {step === 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 20 }}>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Já tem conta?</Text>
                <TouchableOpacity onPress={() => router.replace('/parceiro/(auth)/login')}>
                  <Text style={{ color: COLORS.verdeAgua, fontWeight: '700', fontSize: 14 }}>Entrar</Text>
                </TouchableOpacity>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
