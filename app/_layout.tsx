import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase, isSupabaseConfigured } from '../src/lib/supabase';
import { useAuthStore } from '../src/stores/authStore';

export default function RootLayout() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Sem credenciais: vai direto para onboarding sem travar
      setSession(null);
      return;
    }
    supabase.auth.getSession()
      .then(({ data: { session } }) => setSession(session))
      .catch(() => setSession(null));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
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
    </>
  );
}
