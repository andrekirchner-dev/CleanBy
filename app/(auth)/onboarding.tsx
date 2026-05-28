import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Car, CalendarCheck, Award } from 'lucide-react-native';
import { COLORS } from '../../src/lib/constants';
import { Button } from '../../src/components/ui/Button';
import { GoogleButton } from '../../src/components/ui/GoogleButton';
import { useAuthStore } from '../../src/stores/authStore';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    Icon: Car,
    tag: 'MARKETPLACE',
    title: 'Seu carro,\ncuidado por quem\nentende',
    subtitle: 'Encontre os melhores lava-jatos e estéticas automotivas perto de você.',
    accent: '#1A7AC8',
    colors: ['#0D1E3A', '#080F1E'] as [string, string],
  },
  {
    Icon: CalendarCheck,
    tag: 'AGENDAMENTO',
    title: 'Agende em\nsegundos,\nsem fila',
    subtitle: 'Escolha o serviço, data e horário. Confirmação instantânea e lembretes automáticos.',
    accent: '#2196F3',
    colors: ['#0A1A30', '#080F1E'] as [string, string],
  },
  {
    Icon: Award,
    tag: 'FIDELIDADE',
    title: 'Acumule selos\ne ganhe\nlavagens grátis',
    subtitle: 'A cada serviço concluído, você acumula selos no cartão fidelidade digital.',
    accent: '#00C9A0',
    colors: ['#071A15', '#080F1E'] as [string, string],
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
    if (result?.error) setError(result.error);
    else router.replace('/(tabs)');
  };

  const slide = SLIDES[current];

  return (
    <LinearGradient colors={slide.colors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>

        {/* Top bar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: slide.accent }} />
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 }}>
              CleanBy
            </Text>
          </View>
          {current < SLIDES.length - 1 && (
            <TouchableOpacity onPress={() => goTo(SLIDES.length - 1)}
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 100, paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' }}>Pular</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Slides */}
        <ScrollView
          ref={scrollRef}
          horizontal pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={{ flex: 1 }}
        >
          {SLIDES.map((s, i) => (
            <View key={i} style={{ width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
              {/* Glow blob */}
              <View style={{
                position: 'absolute', top: '10%',
                width: 280, height: 280,
                borderRadius: 140,
                backgroundColor: s.accent,
                opacity: 0.06,
              }} />

              {/* Radiant rings */}
              <View style={{
                width: 200, height: 200, borderRadius: 100,
                borderWidth: 1, borderColor: `${s.accent}18`,
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 44,
              }}>
                <View style={{
                  width: 152, height: 152, borderRadius: 76,
                  borderWidth: 1, borderColor: `${s.accent}28`,
                  backgroundColor: `${s.accent}08`,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <View style={{
                    width: 104, height: 104, borderRadius: 52,
                    backgroundColor: `${s.accent}18`,
                    borderWidth: 1, borderColor: `${s.accent}40`,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <s.Icon size={44} color={s.accent} strokeWidth={1.5} />
                  </View>
                </View>
              </View>

              {/* Tag */}
              <View style={{
                backgroundColor: `${s.accent}18`, borderRadius: 100,
                paddingHorizontal: 12, paddingVertical: 5,
                borderWidth: 1, borderColor: `${s.accent}30`,
                marginBottom: 20,
              }}>
                <Text style={{ color: s.accent, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }}>{s.tag}</Text>
              </View>

              <Text style={{
                fontSize: 36, fontWeight: '800', color: COLORS.white,
                textAlign: 'center', lineHeight: 44, marginBottom: 18,
                letterSpacing: -0.8,
              }}>
                {s.title}
              </Text>
              <Text style={{
                fontSize: 15, color: 'rgba(255,255,255,0.45)',
                textAlign: 'center', lineHeight: 24,
              }}>
                {s.subtitle}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <View style={{
                height: 6, width: i === current ? 32 : 6, borderRadius: 3,
                backgroundColor: i === current ? slide.accent : 'rgba(255,255,255,0.15)',
              }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* CTAs */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 12, gap: 10 }}>
          {current < SLIDES.length - 1 ? (
            <Button label="Próximo" onPress={() => goTo(current + 1)} fullWidth size="lg" />
          ) : (
            <>
              {error ? (
                <View style={{ backgroundColor: 'rgba(226,75,74,0.12)', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(226,75,74,0.25)' }}>
                  <Text style={{ color: '#FF6B6B', fontSize: 13, textAlign: 'center' }}>{error}</Text>
                </View>
              ) : null}
              <GoogleButton onPress={handleGoogle} loading={googleLoading} />
              <Button label="Criar conta com e-mail" onPress={() => router.push('/(auth)/signup')} fullWidth size="lg" />
              <Button label="Já tenho conta" onPress={() => router.push('/(auth)/login')} variant="outline" fullWidth size="lg" />
            </>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
