import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { Platform, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { auth } from '../src/lib/firebase';
import { useAuthStore } from '../src/stores/authStore';

function PhoneShell({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View style={{
      flex: 1,
      // @ts-ignore
      background: 'radial-gradient(ellipse at 30% 20%, #0D1E3A 0%, #050A12 60%, #000 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}>
      {/* Dot grid */}
      <View style={{
        position: 'absolute', inset: 0,
        // @ts-ignore
        backgroundImage: 'radial-gradient(circle, rgba(26,122,200,0.07) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
      }} />

      {/* Phone */}
      <View style={{ alignItems: 'center', gap: 20 }}>
        {/* Side buttons (visual) */}
        <View style={{
          position: 'absolute', left: -14, top: 120,
          gap: 16, alignItems: 'center',
        }}>
          {[40, 72, 72].map((h, i) => (
            <View key={i} style={{ width: 4, height: h, borderRadius: 2, backgroundColor: '#2a2a2a' }} />
          ))}
        </View>
        <View style={{
          position: 'absolute', right: -14, top: 180,
          width: 4, height: 90, borderRadius: 2, backgroundColor: '#2a2a2a',
        }} />

        {/* Phone frame */}
        <View style={{
          width: 393,
          height: 852,
          borderRadius: 54,
          // @ts-ignore
          boxShadow: '0 60px 140px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 12px #181818, 0 0 0 13px rgba(255,255,255,0.04)',
          overflow: 'hidden',
          backgroundColor: '#080F1E',
          position: 'relative',
        }}>
          {/* Screen glare */}
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 200,
            // @ts-ignore
            background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
            zIndex: 1, pointerEvents: 'none',
          }} />

          {/* Dynamic Island */}
          <View style={{
            position: 'absolute', top: 14, left: 137,
            width: 120, height: 36,
            backgroundColor: '#000',
            borderRadius: 20,
            zIndex: 9999,
            // @ts-ignore
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
          }} />

          <SafeAreaProvider>
            <SafeAreaInsetsContext.Provider value={{ top: 54, bottom: 24, left: 0, right: 0 }}>
              <View style={{ flex: 1 }}>
                {children}
              </View>
            </SafeAreaInsetsContext.Provider>
          </SafeAreaProvider>
        </View>

        {/* Label */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#1A7AC8' }} />
          {/* @ts-ignore */}
          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: 1 }}>
            CLEANBY · PREVIEW
          </Text>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#00C9A0' }} />
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
      try {
        const result = await getRedirectResult(auth);
        if (result?.user && mounted) setFirebaseUser(result.user);
      } catch (_) {}

      if (!mounted) return;

      timeout = setTimeout(() => { if (mounted) setFirebaseUser(null); }, 5000);

      unsubscribeAuth = onAuthStateChanged(
        auth,
        (user) => { if (!mounted) return; if (timeout) clearTimeout(timeout); setFirebaseUser(user); },
        () => { if (!mounted) return; if (timeout) clearTimeout(timeout); setFirebaseUser(null); }
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
