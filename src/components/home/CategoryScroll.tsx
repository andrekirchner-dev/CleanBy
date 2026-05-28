import React from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { COLORS, CATEGORY_LABELS } from '../../lib/constants';
import type { ServiceCategory } from '../../types';

const CATEGORY_EMOJI: Record<string, string> = {
  lavagem_simples: '💧',
  lavagem_completa: '✨',
  higienizacao_interna: '💨',
  polimento: '🔵',
  cristalizacao: '💎',
  blindagem_pintura: '🛡️',
  estetica_completa: '⭐',
  vai_ate_voce: '📍',
};

const CATEGORIES: ServiceCategory[] = [
  'lavagem_simples',
  'lavagem_completa',
  'higienizacao_interna',
  'polimento',
  'cristalizacao',
  'blindagem_pintura',
  'estetica_completa',
  'vai_ate_voce',
];

interface CategoryScrollProps {
  selected?: ServiceCategory | null;
  onSelect: (category: ServiceCategory | null) => void;
}

export function CategoryScroll({ selected, onSelect }: CategoryScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 4 }}
    >
      {CATEGORIES.map((cat) => {
        const active = selected === cat;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(active ? null : cat)}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 100,
              backgroundColor: active ? COLORS.chuva : COLORS.surface,
              borderWidth: 1,
              borderColor: active ? 'transparent' : COLORS.border,
            }}
          >
            <Text style={{ fontSize: 14 }}>{CATEGORY_EMOJI[cat]}</Text>
            <Text style={{
              fontSize: 13,
              fontWeight: active ? '700' : '500',
              color: active ? COLORS.white : 'rgba(255,255,255,0.55)',
              letterSpacing: 0.2,
            }}>
              {CATEGORY_LABELS[cat]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
