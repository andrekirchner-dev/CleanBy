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
    let timeout: ReturnType<typeof setTimeout>;

    // Processa resultado do Google redirect (web) antes de iniciar o timeout
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          clearTimeout(timeout);
          setFirebaseUser(result.user);
        }
      })
      .catch(() => null);

    timeout = setTimeout(() => setFirebaseUser(null), 6000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(timeout);
        setFirebaseUser(user);
      },
      () => {
        clearTimeout(timeout);
        setFirebaseUser(null);
      }
    );

    return () => {
      clearTimeout(timeout);
      unsubscribe();
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
