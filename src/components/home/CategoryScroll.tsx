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
      contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingVertical: 4 }}
    >
      {CATEGORIES.map((cat) => {
        const active = selected === cat;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(active ? null : cat)}
            style={{
              alignItems: 'center',
              gap: 6,
              minWidth: 68,
            }}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: active ? COLORS.chuva : COLORS.nevoa,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 24 }}>{CATEGORY_EMOJI[cat]}</Text>
            </View>
            <Text
              style={{
                fontSize: 10,
                fontWeight: active ? '700' : '500',
                color: active ? COLORS.chuva : COLORS.gray600,
                textAlign: 'center',
              }}
              numberOfLines={2}
            >
              {CATEGORY_LABELS[cat]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
