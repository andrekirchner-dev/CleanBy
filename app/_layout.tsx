import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/lib/firebase';
import { useAuthStore } from '../src/stores/authStore';

export default function RootLayout() {
  const setFirebaseUser = useAuthStore((s) => s.setFirebaseUser);

  useEffect(() => {
    // Timeout de segurança: se Firebase Auth não responder em 4s vai para onboarding
    const timeout = setTimeout(() => {
      setFirebaseUser(null);
    }, 4000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(timeout);
        setFirebaseUser(user);
      },
      (error) => {
        // Auth não configurado ou sem internet — vai para onboarding
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
