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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 32 }}>
            <Text style={{ color: COLORS.chuva, fontSize: 16 }}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.white, marginBottom: 8 }}>
            Criar conta
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
            Junte-se ao CleanBy gratuitamente
          </Text>

          {/* Google OAuth */}
          <GoogleButton onPress={handleGoogle} loading={googleLoading} label="Cadastrar com Google" />

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>ou cadastre com e-mail</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </View>

          {error ? (
            <View style={{ backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <Text style={{ color: '#991B1B', fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}

          <View style={{ gap: 16 }}>
            {[
              { label: 'Nome completo', value: name, onChange: setName, placeholder: 'Seu nome', keyboard: 'default' as const, capitalize: 'words' as const },
              { label: 'E-mail', value: email, onChange: setEmail, placeholder: 'seu@email.com', keyboard: 'email-address' as const, capitalize: 'none' as const },
              { label: 'Senha', value: password, onChange: setPassword, placeholder: '••••••••', keyboard: 'default' as const, capitalize: 'none' as const, secure: true },
            ].map((f) => (
              <View key={f.label}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>{f.label}</Text>
                <TextInput
                  value={f.value}
                  onChangeText={f.onChange}
                  placeholder={f.placeholder}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType={f.keyboard}
                  autoCapitalize={f.capitalize}
                  secureTextEntry={f.secure}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: 16,
                    color: COLORS.white, fontSize: 15,
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
                  }}
                />
              </View>
            ))}
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 16, lineHeight: 18 }}>
            Ao criar conta, você concorda com nossos Termos de Uso e Política de Privacidade.
          </Text>

          <View style={{ marginTop: 28 }}>
            <Button label="Criar minha conta" onPress={handleSignup} loading={loading} fullWidth size="lg" />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={{ marginTop: 24, alignItems: 'center' }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
              Já tem conta?{' '}
              <Text style={{ color: COLORS.chuva, fontWeight: '700' }}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
