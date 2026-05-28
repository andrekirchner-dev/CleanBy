import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../../lib/constants';

interface BookingStepIndicatorProps {
  current: number;
  total: number;
  labels: string[];
}

export function BookingStepIndicator({ current, total, labels }: BookingStepIndicatorProps) {
  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {Array.from({ length: total }).map((_, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <React.Fragment key={i}>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: done || active ? COLORS.chuva : COLORS.gray200,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {done ? (
                    <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 14 }}>✓</Text>
                  ) : (
                    <Text style={{ color: active ? COLORS.white : COLORS.gray400, fontWeight: '700', fontSize: 13 }}>
                      {i + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    color: active ? COLORS.chuva : COLORS.gray400,
                    fontWeight: active ? '700' : '400',
                    maxWidth: 56,
                    textAlign: 'center',
                  }}
                  numberOfLines={1}
                >
                  {labels[i]}
                </Text>
              </View>
              {i < total - 1 && (
                <View
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: i < current ? COLORS.chuva : COLORS.gray200,
                    marginBottom: 18,
                    marginHorizontal: 4,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
