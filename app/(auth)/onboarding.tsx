import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Dimensions, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/lib/constants';
import { Button } from '../../src/components/ui/Button';
import { GoogleButton } from '../../src/components/ui/GoogleButton';
import { useAuthStore } from '../../src/stores/authStore';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '🚗',
    title: 'Seu carro, cuidado\npor quem entende',
    subtitle: 'Encontre os melhores lava-jatos e estéticas automotivas perto de você.',
  },
  {
    emoji: '📅',
    title: 'Agende em segundos,\nsem fila',
    subtitle: 'Escolha o serviço, data e horário. Confirmação instantânea e lembretes automáticos.',
  },
  {
    emoji: '✦',
    title: 'Acumule selos e\nganhe lavagens grátis',
    subtitle: 'A cada serviço concluído, você acumula selos no cartão fidelidade digital.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { signInWithGoogle, googleLoading } = useAuthStore();
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const [error, setError] = useState('');

  const goTo = (index: number) => {
    setCurrent(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
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
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={{ flex: 1 }}
        >
          {SLIDES.map((slide, i) => (
            <View
              key={i}
              style={{ width, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}
            >
              <View
                style={{
                  width: 120, height: 120, borderRadius: 60,
                  backgroundColor: 'rgba(26,122,200,0.15)',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 40,
                }}
              >
                <Text style={{ fontSize: 56 }}>{slide.emoji}</Text>
              </View>
              <Text
                style={{
                  fontSize: 28, fontWeight: '800', color: COLORS.white,
                  textAlign: 'center', lineHeight: 36, marginBottom: 16,
                }}
              >
                {slide.title}
              </Text>
              <Text
                style={{
                  fontSize: 16, color: 'rgba(255,255,255,0.6)',
                  textAlign: 'center', lineHeight: 24,
                }}
              >
                {slide.subtitle}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View
                style={{
                  width: i === current ? 24 : 8, height: 8, borderRadius: 4,
                  backgroundColor: i === current ? COLORS.chuva : 'rgba(255,255,255,0.3)',
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* CTAs */}
        <View style={{ paddingHorizontal: 24, gap: 12, paddingBottom: 32 }}>
          {current < SLIDES.length - 1 ? (
            <Button label="Próximo" onPress={() => goTo(current + 1)} fullWidth size="lg" />
          ) : (
            <>
              {error ? (
                <View style={{ backgroundColor: '#FEE2E2', borderRadius: 10, padding: 12 }}>
                  <Text style={{ color: '#991B1B', fontSize: 13, textAlign: 'center' }}>{error}</Text>
                </View>
              ) : null}

              <GoogleButton onPress={handleGoogle} loading={googleLoading} />

              <Button
                label="Criar conta com e-mail"
                onPress={() => router.push('/(auth)/signup')}
                fullWidth size="lg"
              />
              <Button
                label="Já tenho conta"
                onPress={() => router.push('/(auth)/login')}
                variant="outline"
                fullWidth size="lg"
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
