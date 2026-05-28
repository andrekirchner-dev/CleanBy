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

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, googleLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Preencha todos os campos'); return; }
    setLoading(true);
    setError('');
    const result = await signIn(email, password);
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
            Bem-vindo de volta
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>
            Entre na sua conta CleanBy
          </Text>

          {/* Google OAuth */}
          <GoogleButton onPress={handleGoogle} loading={googleLoading} />

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>ou entre com e-mail</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </View>

          {error ? (
            <View style={{ backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <Text style={{ color: '#991B1B', fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}

          <View style={{ gap: 16 }}>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>E-mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: 16,
                  color: COLORS.white, fontSize: 15,
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
                }}
              />
            </View>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>Senha</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12, padding: 16,
                  color: COLORS.white, fontSize: 15,
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
                }}
              />
            </View>
          </View>

          <TouchableOpacity style={{ marginTop: 12, alignSelf: 'flex-end' }}>
            <Text style={{ color: COLORS.chuva, fontSize: 14 }}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 28 }}>
            <Button label="Entrar" onPress={handleLogin} loading={loading} fullWidth size="lg" />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            style={{ marginTop: 24, alignItems: 'center' }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
              Não tem conta?{' '}
              <Text style={{ color: COLORS.chuva, fontWeight: '700' }}>Criar agora</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
