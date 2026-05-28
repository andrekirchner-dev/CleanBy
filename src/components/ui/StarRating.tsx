import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../lib/constants';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export function StarRating({ rating, reviewCount, size = 14 }: StarRatingProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Text style={{ color: '#F59E0B', fontSize: size }}>★</Text>
      <Text style={{ color: COLORS.gray800, fontSize: size, fontWeight: '700' }}>
        {rating.toFixed(1)}
      </Text>
      {reviewCount !== undefined && (
        <Text style={{ color: COLORS.gray400, fontSize: size - 1 }}>({reviewCount})</Text>
      )}
    </View>
  );
}
