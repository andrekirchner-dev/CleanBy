import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
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

  const handleSignup = async () => {
    if (!name || !email || !password) { setError('Preencha todos os campos'); return; }
    if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres'); return; }
    setLoading(true);
    setError('');
    const result = await signUp(email, password, name);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoogle = async () => {
    setError('');
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
    } else {
      router.replace('/(tabs)');
    }
  };

  const fields = [
    { label: 'Nome completo', value: name, onChange: setName, placeholder: 'Seu nome', keyboard: 'default' as const, capitalize: 'words' as const },
    { label: 'E-mail', value: email, onChange: setEmail, placeholder: 'seu@email.com', keyboard: 'email-address' as const, capitalize: 'none' as const },
    { label: 'Senha', value: password, onChange: setPassword, placeholder: '••••••••', keyboard: 'default' as const, capitalize: 'none' as const, secure: true },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 40, alignSelf: 'flex-start' }}>
            <View style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: COLORS.surface,
              borderWidth: 1, borderColor: COLORS.border,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: COLORS.white, fontSize: 18 }}>←</Text>
            </View>
          </TouchableOpacity>

          <Text style={{ fontSize: 34, fontWeight: '800', color: COLORS.white, marginBottom: 8, letterSpacing: -0.5 }}>
            Criar conta
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, marginBottom: 40, lineHeight: 24 }}>
            Junte-se ao CleanBy gratuitamente
          </Text>

          <GoogleButton onPress={handleGoogle} loading={googleLoading} label="Cadastrar com Google" />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 28 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, letterSpacing: 0.5 }}>OU</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          </View>

          {error ? (
            <View style={{ backgroundColor: 'rgba(226,75,74,0.12)', borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(226,75,74,0.25)' }}>
              <Text style={{ color: '#FF6B6B', fontSize: 13, textAlign: 'center' }}>{error}</Text>
            </View>
          ) : null}

          <View style={{ gap: 14 }}>
            {fields.map((f) => (
              <View key={f.label}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                  {f.label}
                </Text>
                <TextInput
                  value={f.value}
                  onChangeText={f.onChange}
                  placeholder={f.placeholder}
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  keyboardType={f.keyboard}
                  autoCapitalize={f.capitalize}
                  secureTextEntry={f.secure}
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 16, padding: 18,
                    color: COLORS.white, fontSize: 15,
                    borderWidth: 1, borderColor: COLORS.border,
                  }}
                />
              </View>
            ))}
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 18, lineHeight: 18 }}>
            Ao criar conta, você concorda com nossos Termos de Uso e Política de Privacidade.
          </Text>

          <View style={{ marginTop: 28 }}>
            <Button label="Criar minha conta" onPress={handleSignup} loading={loading} fullWidth size="lg" />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={{ marginTop: 28, alignItems: 'center' }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>
              Já tem conta?{' '}
              <Text style={{ color: COLORS.chuva, fontWeight: '700' }}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
