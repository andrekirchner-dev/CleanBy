import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { COLORS } from '../../src/lib/constants';
import { Button } from '../../src/components/ui/Button';
import { GoogleButton } from '../../src/components/ui/GoogleButton';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle, googleLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name || !email || !password) { setError('Preencha todos os campos'); return; }
    if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres'); return; }
    setLoading(true); setError('');
    const result = await signUp(email, password, name);
    setLoading(false);
    if (result.error) setError(result.error);
    else router.replace('/(tabs)');
  };

  const handleGoogle = async () => {
    setError('');
    const result = await signInWithGoogle();
    if (result?.error) setError(result.error);
    else router.replace('/(tabs)');
  };

  const inputStyle = (field: string) => ({
    backgroundColor: focusedField === field ? 'rgba(26,122,200,0.08)' : COLORS.surface,
    borderRadius: 16, padding: 18,
    color: COLORS.white, fontSize: 15,
    borderWidth: 1,
    borderColor: focusedField === field ? 'rgba(26,122,200,0.4)' : COLORS.border,
  });

  const fields = [
    { key: 'name', label: 'Nome completo', value: name, onChange: setName, placeholder: 'Seu nome', keyboard: 'default' as const, capitalize: 'words' as const },
    { key: 'email', label: 'E-mail', value: email, onChange: setEmail, placeholder: 'seu@email.com', keyboard: 'email-address' as const, capitalize: 'none' as const },
    { key: 'password', label: 'Senha', value: password, onChange: setPassword, placeholder: '••••••••', keyboard: 'default' as const, capitalize: 'none' as const, secure: true },
  ];

  return (
    <LinearGradient colors={['#0A1628', '#080F1E']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* Back */}
            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 8, marginBottom: 40, alignSelf: 'flex-start' }}>
              <View style={{
                width: 42, height: 42, borderRadius: 21,
                backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ color: COLORS.white, fontSize: 18, lineHeight: 22 }}>←</Text>
              </View>
            </TouchableOpacity>

            {/* Header */}
            <View style={{ marginBottom: 36 }}>
              <Text style={{ color: COLORS.verdeAgua, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                Novo usuário
              </Text>
              <Text style={{ fontSize: 36, fontWeight: '800', color: COLORS.white, letterSpacing: -0.8, lineHeight: 44, marginBottom: 10 }}>
                Criar{'\n'}sua conta
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, lineHeight: 22 }}>
                Junte-se ao CleanBy gratuitamente
              </Text>
            </View>

            {/* Google */}
            <GoogleButton onPress={handleGoogle} loading={googleLoading} label="Cadastrar com Google" />

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 28 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
              <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>OU</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            </View>

            {/* Error */}
            {error ? (
              <View style={{ backgroundColor: 'rgba(226,75,74,0.1)', borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(226,75,74,0.25)', flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 14 }}>⚠️</Text>
                <Text style={{ color: '#FF6B6B', fontSize: 13, flex: 1, lineHeight: 18 }}>{error}</Text>
              </View>
            ) : null}

            {/* Fields */}
            <View style={{ gap: 16 }}>
              {fields.map((f) => (
                <View key={f.key}>
                  <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
                    {f.label}
                  </Text>
                  <TextInput
                    value={f.value} onChangeText={f.onChange}
                    placeholder={f.placeholder} placeholderTextColor="rgba(255,255,255,0.18)"
                    keyboardType={f.keyboard} autoCapitalize={f.capitalize}
                    secureTextEntry={f.secure}
                    onFocus={() => setFocusedField(f.key)} onBlur={() => setFocusedField(null)}
                    style={inputStyle(f.key)}
                  />
                </View>
              ))}
            </View>

            <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 18, lineHeight: 18 }}>
              Ao criar conta, você concorda com nossos Termos de Uso e Política de Privacidade.
            </Text>

            <View style={{ marginTop: 28 }}>
              <Button label="Criar minha conta" onPress={handleSignup} loading={loading} fullWidth size="lg" />
            </View>

            <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={{ marginTop: 28, marginBottom: 12, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
                Já tem conta?{'  '}
                <Text style={{ color: COLORS.chuva, fontWeight: '700' }}>Entrar</Text>
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
