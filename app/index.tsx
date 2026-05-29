import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../src/lib/constants';

export default function Index() {
  const { firebaseUser, user, loading } = useAuthStore();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.noite, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.chuva} size="large" />
      </View>
    );
  }

  if (!firebaseUser) return <Redirect href="/(auth)/onboarding" />;
  if (user?.role === 'parceiro') return <Redirect href="/parceiro/(dashboard)" />;
  return <Redirect href="/(tabs)" />;
}
