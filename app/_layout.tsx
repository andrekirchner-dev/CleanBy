import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { Platform, View } from 'react-native';
import { auth } from '../src/lib/firebase';
import { useAuthStore } from '../src/stores/authStore';

function PhoneShell({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;
  return (
    <View style={{
      flex: 1,
      // @ts-ignore — web-only
      backgroundColor: '#0A0A0A',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Decorative background dots */}
      <View style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        // @ts-ignore
        backgroundImage: 'radial-gradient(circle, rgba(26,122,200,0.06) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Phone frame */}
      <View style={{
        width: 393,
        height: 852,
        borderRadius: 54,
        // @ts-ignore — web-only
        boxShadow: '0 50px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04)',
        overflow: 'hidden',
        borderWidth: 12,
        borderColor: '#1A1A1A',
        backgroundColor: '#080F1E',
        position: 'relative',
      }}>
        {/* Dynamic Island */}
        <View style={{
          position: 'absolute',
          top: 16,
          left: 137,
          width: 120,
          height: 34,
          backgroundColor: '#000',
          borderRadius: 20,
          zIndex: 9999,
        }} />

        <View style={{ flex: 1 }}>
          {children}
        </View>
      </View>

      {/* Label below */}
      <View style={{ marginTop: 24, alignItems: 'center', gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#1A7AC8' }} />
          {/* @ts-ignore */}
          <View style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: 'system-ui' }}>
            CleanBy — preview
          </View>
        </View>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const setFirebaseUser = useAuthStore((s) => s.setFirebaseUser);

  useEffect(() => {
    let mounted = true;
    let unsubscribeAuth: (() => void) | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const init = async () => {
      // Verifica redirect pendente (Google OAuth com redirect) antes de tudo.
      // Isso evita a race condition onde onAuthStateChanged dispara null
      // antes de getRedirectResult processar o usuário recém-logado.
      try {
        const result = await getRedirectResult(auth);
        if (result?.user && mounted) {
          setFirebaseUser(result.user);
        }
      } catch (_) {}

      if (!mounted) return;

      // Após checar o redirect, configura o listener normal com timeout de segurança
      timeout = setTimeout(() => {
        if (mounted) setFirebaseUser(null);
      }, 5000);

      unsubscribeAuth = onAuthStateChanged(
        auth,
        (user) => {
          if (!mounted) return;
          if (timeout) clearTimeout(timeout);
          setFirebaseUser(user);
        },
        () => {
          if (!mounted) return;
          if (timeout) clearTimeout(timeout);
          setFirebaseUser(null);
        }
      );
    };

    init();

    return () => {
      mounted = false;
      if (timeout) clearTimeout(timeout);
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  return (
    <PhoneShell>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="estabelecimento/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="agendamento/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="loja/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="pro/index" options={{ presentation: 'modal' }} />
      </Stack>
    </PhoneShell>
  );
}
