import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/authStore';
import { COLORS } from '../../src/lib/constants';
import { Button } from '../../src/components/ui/Button';

export default function SignupScreen() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
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

  const fields = [
    { label: 'Nome completo', value: name, onChange: setName, placeholder: 'Seu nome', type: 'default' as const },
    { label: 'E-mail', value: email, onChange: setEmail, placeholder: 'seu@email.com', type: 'email-address' as const },
    { label: 'Senha', value: password, onChange: setPassword, placeholder: '••••••••', type: 'default' as const, secure: true },
  ];

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
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 40 }}>
            Junte-se ao CleanBy gratuitamente
          </Text>

          {error ? (
            <View style={{ backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <Text style={{ color: '#991B1B', fontSize: 14 }}>{error}</Text>
            </View>
          ) : null}

          <View style={{ gap: 16 }}>
            {fields.map((f) => (
              <View key={f.label}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>{f.label}</Text>
                <TextInput
                  value={f.value}
                  onChangeText={f.onChange}
                  placeholder={f.placeholder}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType={f.type}
                  autoCapitalize={f.type === 'email-address' ? 'none' : 'words'}
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

          <View style={{ marginTop: 32 }}>
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
