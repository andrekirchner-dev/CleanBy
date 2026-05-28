import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, LOYALTY_STAMPS_REQUIRED } from '../../lib/constants';

interface LoyaltyCardProps {
  stamps: number;
  isPro?: boolean;
}

export function LoyaltyCard({ stamps, isPro = false }: LoyaltyCardProps) {
  const displayStamps = Math.min(stamps, LOYALTY_STAMPS_REQUIRED);

  return (
    <View style={{
      backgroundColor: COLORS.noiteSurface,
      borderRadius: 20,
      padding: 20,
      gap: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>
            Fidelidade
          </Text>
          <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: -0.2 }}>
            Cartão de selos
          </Text>
        </View>
        {isPro && (
          <View style={{
            backgroundColor: `${COLORS.verdeAgua}20`,
            paddingHorizontal: 12, paddingVertical: 5,
            borderRadius: 100, borderWidth: 1, borderColor: `${COLORS.verdeAgua}40`,
          }}>
            <Text style={{ color: COLORS.verdeAgua, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 }}>✦ PRO 1.5×</Text>
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {Array.from({ length: LOYALTY_STAMPS_REQUIRED }).map((_, i) => {
          const filled = i < displayStamps;
          return (
            <View
              key={i}
              style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: filled ? COLORS.verdeAgua : COLORS.surface,
                borderWidth: 1,
                borderColor: filled ? 'transparent' : COLORS.border,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18, color: filled ? COLORS.noite : 'rgba(255,255,255,0.2)' }}>
                ✦
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 18 }}>
        {displayStamps}/{LOYALTY_STAMPS_REQUIRED} selos •{' '}
        {LOYALTY_STAMPS_REQUIRED - displayStamps > 0
          ? `Faltam ${LOYALTY_STAMPS_REQUIRED - displayStamps} para ganhar uma lavagem grátis`
          : '🎉 Parabéns! Resgate sua lavagem grátis'}
      </Text>
    </View>
  );
}
