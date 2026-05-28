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
    <View
      style={{
        backgroundColor: COLORS.oceano,
        borderRadius: 16,
        padding: 20,
        gap: 14,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>
          Cartão Fidelidade
        </Text>
        {isPro && (
          <View
            style={{
              backgroundColor: COLORS.verdeAgua,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: COLORS.noite, fontSize: 11, fontWeight: '700' }}>PRO 1.5×</Text>
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
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: filled ? COLORS.verdeAgua : 'rgba(255,255,255,0.12)',
                borderWidth: filled ? 0 : 1.5,
                borderColor: 'rgba(255,255,255,0.25)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: filled ? COLORS.noite : 'rgba(255,255,255,0.3)' }}>
                ✦
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
        {displayStamps}/{LOYALTY_STAMPS_REQUIRED} selos •{' '}
        {LOYALTY_STAMPS_REQUIRED - displayStamps > 0
          ? `Faltam ${LOYALTY_STAMPS_REQUIRED - displayStamps} para ganhar uma lavagem grátis`
          : 'Parabéns! Resgate sua lavagem grátis'}
      </Text>
    </View>
  );
}
