import React from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { Droplets, Sparkles, Wind, CircleDot, Gem, Shield, Star, Navigation } from 'lucide-react-native';
import { COLORS, CATEGORY_LABELS } from '../../lib/constants';
import type { ServiceCategory } from '../../types';

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<any>> = {
  lavagem_simples: Droplets,
  lavagem_completa: Sparkles,
  higienizacao_interna: Wind,
  polimento: CircleDot,
  cristalizacao: Gem,
  blindagem_pintura: Shield,
  estetica_completa: Star,
  vai_ate_voce: Navigation,
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
        const IconComponent = CATEGORY_ICON_MAP[cat];
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(active ? null : cat)}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 100,
              backgroundColor: active ? COLORS.chuva : COLORS.surface,
              borderWidth: 1,
              borderColor: active ? 'transparent' : COLORS.border,
            }}
          >
            <IconComponent
              size={14}
              color={active ? COLORS.white : 'rgba(255,255,255,0.55)'}
              strokeWidth={active ? 2.2 : 1.8}
            />
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
