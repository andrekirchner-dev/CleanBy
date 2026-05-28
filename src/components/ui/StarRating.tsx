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
      <Text style={{ color: COLORS.white, fontSize: size, fontWeight: '700' }}>
        {rating.toFixed(1)}
      </Text>
      {reviewCount !== undefined && (
        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: size - 1 }}>({reviewCount})</Text>
      )}
    </View>
  );
}
