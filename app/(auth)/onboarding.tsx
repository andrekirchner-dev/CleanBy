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
    color: '#1A7AC8',
  },
  {
    emoji: '📅',
    title: 'Agende em segundos,\nsem fila',
    subtitle: 'Escolha o serviço, data e horário. Confirmação instantânea e lembretes automáticos.',
    color: '#0E3D6B',
  },
  {
    emoji: '✦',
    title: 'Acumule selos e\nganhe lavagens grátis',
    subtitle: 'A cada serviço concluído, você acumula selos no cartão fidelidade digital.',
    color: '#00C9A0',
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

  const slide = SLIDES[current];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.noite }}>
      {/* Skip */}
      {current < SLIDES.length - 1 && (
        <TouchableOpacity
          onPress={() => goTo(SLIDES.length - 1)}
          style={{ position: 'absolute', top: 56, right: 24, zIndex: 10 }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 }}>
            Pular
          </Text>
        </TouchableOpacity>
      )}

      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={{ flex: 1 }}
        >
          {SLIDES.map((s, i) => (
            <View
              key={i}
              style={{ width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 }}
            >
              {/* Decorative rings */}
              <View style={{
                width: 220, height: 220, borderRadius: 110,
                backgroundColor: `${s.color}0D`,
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 48,
              }}>
                <View style={{
                  width: 164, height: 164, borderRadius: 82,
                  backgroundColor: `${s.color}15`,
                  borderWidth: 1, borderColor: `${s.color}40`,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <View style={{
                    width: 110, height: 110, borderRadius: 55,
                    backgroundColor: `${s.color}25`,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 48 }}>{s.emoji}</Text>
                  </View>
                </View>
              </View>

              <Text style={{
                fontSize: 32, fontWeight: '800', color: COLORS.white,
                textAlign: 'center', lineHeight: 42, marginBottom: 16,
                letterSpacing: -0.5,
              }}>
                {s.title}
              </Text>
              <Text style={{
                fontSize: 16, color: 'rgba(255,255,255,0.5)',
                textAlign: 'center', lineHeight: 26,
              }}>
                {s.subtitle}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)}>
              <View style={{
                width: i === current ? 28 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === current ? COLORS.chuva : 'rgba(255,255,255,0.2)',
              }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* CTAs */}
        <View style={{ paddingHorizontal: 24, gap: 12, paddingBottom: 36 }}>
          {current < SLIDES.length - 1 ? (
            <Button label="Próximo" onPress={() => goTo(current + 1)} fullWidth size="lg" />
          ) : (
            <>
              {error ? (
                <View style={{ backgroundColor: 'rgba(226,75,74,0.15)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(226,75,74,0.3)' }}>
                  <Text style={{ color: '#FF6B6B', fontSize: 13, textAlign: 'center' }}>{error}</Text>
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
