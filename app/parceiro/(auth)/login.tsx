import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react-native';
import { useAuthStore } from '../../../src/stores/authStore';
import { COLORS } from '../../../src/lib/constants';

export default function ParceiroLoginScreen() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Preencha todos os campos'); return; }
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    router.replace('/parceiro/(dashboard)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} keyboardShouldPersistTaps="handled">

            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center', marginBottom: 40,
              }}
            >
              <ArrowLeft size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
            </TouchableOpacity>

            <View style={{ marginBottom: 36 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.verdeAgua }} />
                <Text style={{ color: COLORS.verdeAgua, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                  Parceiro CleanBy
                </Text>
              </View>
              <Text style={{ color: COLORS.white, fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 }}>
                Entrar no painel
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, lineHeight: 22 }}>
                Acesse o painel de gestão do seu estabelecimento.
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

            <View style={{ gap: 14, marginBottom: 28 }}>
              <View>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>E-mail</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 16,
                  borderWidth: 1, borderColor: COLORS.border,
                }}>
                  <Mail size={16} color="rgba(255,255,255,0.3)" strokeWidth={1.8} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="seu@email.com"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ flex: 1, color: COLORS.white, fontSize: 16, paddingVertical: 16 }}
                  />
                </View>
              </View>

              <View>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Senha</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 16,
                  borderWidth: 1, borderColor: COLORS.border,
                }}>
                  <Lock size={16} color="rgba(255,255,255,0.3)" strokeWidth={1.8} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Sua senha"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    secureTextEntry
                    style={{ flex: 1, color: COLORS.white, fontSize: 16, paddingVertical: 16 }}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                backgroundColor: COLORS.verdeAgua, borderRadius: 16,
                paddingVertical: 17, alignItems: 'center', marginBottom: 20,
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 16 }}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Ainda não é parceiro?</Text>
              <TouchableOpacity onPress={() => router.push('/parceiro/(auth)/cadastro')}>
                <Text style={{ color: COLORS.verdeAgua, fontWeight: '700', fontSize: 14 }}>Cadastrar estabelecimento</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
