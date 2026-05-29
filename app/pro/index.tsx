import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';
import { COLORS, PRO_PRICE } from '../../src/lib/constants';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/stores/authStore';

const BENEFITS = [
  { icon: '💳', title: 'Pagar no local', desc: '2× por mês reserve sem pagar antecipadamente' },
  { icon: '✦',  title: 'Horários exclusivos', desc: 'Acesso prioritário aos melhores horários da agenda' },
  { icon: '🏷️', title: '10% de desconto', desc: 'Em serviços marcados como elegíveis pelos estabelecimentos' },
  { icon: '⚡', title: 'Fidelidade acelerada', desc: 'Acumule 1.5× selos — chegue mais rápido à lavagem grátis' },
  { icon: '🎁', title: 'Brindes mensais', desc: 'Surpresas todo mês: produtos automotivos ou descontos extras' },
  { icon: '💬', title: 'Suporte prioritário', desc: 'Atendimento exclusivo via chat com resposta em até 1h' },
];

const COMPARISON_ROWS = [
  ['Horários normais',     'Horários normais + exclusivos ✦'],
  ['Pagamento antecipado', '2× pague no local/mês'],
  ['Preço cheio',          '10% off em serviços elegíveis'],
  ['1 selo por serviço',   '1,5 selos por serviço'],
  ['Suporte padrão',       'Suporte prioritário'],
];

export default function ProScreen() {
  const router = useRouter();
  const { user, upgradeToPro } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const isPro = user?.plan === 'pro';

  const handleSubscribe = async () => {
    if (isPro) { router.back(); return; }
    setLoading(true);
    try {
      await upgradeToPro();
      Alert.alert('✦ Bem-vindo ao PRO!', 'Seu plano foi ativado. Aproveite todos os benefícios.', [
        { text: 'Continuar', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível ativar o plano. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ padding: 24, alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              alignSelf: 'flex-start', marginBottom: 24,
              flexDirection: 'row', alignItems: 'center', gap: 6,
            }}
          >
            <X size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Fechar</Text>
          </TouchableOpacity>

          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: 'rgba(0,201,160,0.15)',
            borderWidth: 1, borderColor: 'rgba(0,201,160,0.3)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Text style={{ fontSize: 36 }}>✦</Text>
          </View>

          <Text style={{ color: COLORS.white, fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 }}>
            CleanBy PRO
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
            Eleve sua experiência com o plano que cuida do seu carro e do seu bolso.
          </Text>

          {isPro ? (
            <View style={{
              marginTop: 28, backgroundColor: 'rgba(0,201,160,0.12)', borderRadius: 20,
              paddingHorizontal: 24, paddingVertical: 14,
              borderWidth: 1, borderColor: 'rgba(0,201,160,0.3)',
              flexDirection: 'row', alignItems: 'center', gap: 10,
            }}>
              <Check size={18} color={COLORS.verdeAgua} strokeWidth={2.5} />
              <Text style={{ color: COLORS.verdeAgua, fontWeight: '800', fontSize: 16 }}>Plano ativo</Text>
            </View>
          ) : (
            <View style={{ marginTop: 28, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>apenas</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 }}>
                <Text style={{ color: COLORS.verdeAgua, fontSize: 18, fontWeight: '700', marginTop: 8 }}>R$</Text>
                <Text style={{ color: COLORS.verdeAgua, fontSize: 52, fontWeight: '900', lineHeight: 56 }}>
                  {String(PRO_PRICE).split('.')[0]}
                </Text>
                <Text style={{ color: COLORS.verdeAgua, fontSize: 18, fontWeight: '700', marginTop: 8 }}>
                  ,{String(PRO_PRICE.toFixed(2)).split('.')[1]}
                </Text>
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>por mês • cancele quando quiser</Text>
            </View>
          )}
        </View>

        {/* Benefits */}
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>
            O que você ganha
          </Text>
          {BENEFITS.map((b, i) => (
            <View key={i} style={{
              backgroundColor: COLORS.noiteSurface, borderRadius: 16, padding: 16,
              flexDirection: 'row', gap: 14, alignItems: 'flex-start',
              borderWidth: 1, borderColor: COLORS.border,
            }}>
              <View style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: 'rgba(0,201,160,0.12)', alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderColor: 'rgba(0,201,160,0.2)',
              }}>
                <Text style={{ fontSize: 22 }}>{b.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.verdeAgua, fontWeight: '700', fontSize: 15, marginBottom: 3 }}>{b.title}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 18 }}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Comparison table */}
        <View style={{ margin: 20, backgroundColor: COLORS.noiteSurface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border }}>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <View style={{ flex: 1, padding: 14 }}>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontWeight: '700', fontSize: 13 }}>Free</Text>
            </View>
            <View style={{ flex: 1, padding: 14, backgroundColor: 'rgba(0,201,160,0.08)', alignItems: 'center' }}>
              <Text style={{ color: COLORS.verdeAgua, fontWeight: '800', fontSize: 13 }}>✦ PRO</Text>
            </View>
          </View>
          {COMPARISON_ROWS.map(([free, pro], i) => (
            <View key={i} style={{ flexDirection: 'row', borderTopWidth: i > 0 ? 1 : 0, borderTopColor: COLORS.border }}>
              <View style={{ flex: 1, padding: 14 }}>
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{free}</Text>
              </View>
              <View style={{ flex: 1, padding: 14, backgroundColor: 'rgba(0,201,160,0.04)' }}>
                <Text style={{ color: COLORS.verdeAgua, fontSize: 12, fontWeight: '600' }}>{pro}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 20, backgroundColor: COLORS.noite,
        borderTopWidth: 1, borderTopColor: COLORS.border,
      }}>
        <Button
          label={isPro ? 'Plano já ativo ✦' : `Assinar PRO por R$ ${PRO_PRICE.toFixed(2).replace('.', ',')}/mês`}
          onPress={handleSubscribe}
          loading={loading}
          variant="pro"
          fullWidth
          size="lg"
        />
        {!isPro && (
          <Text style={{ color: 'rgba(255,255,255,0.25)', textAlign: 'center', fontSize: 12, marginTop: 10 }}>
            Cobrança mensal recorrente. Cancele a qualquer momento.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
