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
            Bem-vindo de volta
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, marginBottom: 40, lineHeight: 24 }}>
            Entre na sua conta CleanBy
          </Text>

          <GoogleButton onPress={handleGoogle} loading={googleLoading} />

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
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' }}>E-mail</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor="rgba(255,255,255,0.2)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 16, padding: 18,
                  color: COLORS.white, fontSize: 15,
                  borderWidth: 1, borderColor: COLORS.border,
                }}
              />
            </View>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' }}>Senha</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="rgba(255,255,255,0.2)"
                secureTextEntry
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 16, padding: 18,
                  color: COLORS.white, fontSize: 15,
                  borderWidth: 1, borderColor: COLORS.border,
                }}
              />
            </View>
          </View>

          <TouchableOpacity style={{ marginTop: 16, alignSelf: 'flex-end' }}>
            <Text style={{ color: COLORS.chuva, fontSize: 14, fontWeight: '600' }}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 32 }}>
            <Button label="Entrar" onPress={handleLogin} loading={loading} fullWidth size="lg" />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            style={{ marginTop: 28, alignItems: 'center' }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>
              Não tem conta?{' '}
              <Text style={{ color: COLORS.chuva, fontWeight: '700' }}>Criar agora</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
