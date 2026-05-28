import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../lib/constants';
import { Badge } from '../ui/Badge';
import { StarRating } from '../ui/StarRating';
import type { Establishment } from '../../types';

interface EstablishmentCardProps {
  establishment: Establishment;
  style?: object;
}

export function EstablishmentCard({ establishment, style }: EstablishmentCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/estabelecimento/${establishment.id}`)}
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        ...style,
      }}
      activeOpacity={0.9}
    >
      <View style={{ height: 140, backgroundColor: COLORS.nevoa }}>
        {establishment.cover_url ? (
          <Image
            source={{ uri: establishment.cover_url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 40 }}>🚗</Text>
          </View>
        )}
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
          <Badge
            label={establishment.is_open ? 'Aberto' : 'Fechado'}
            variant={establishment.is_open ? 'open' : 'closed'}
          />
        </View>
        {establishment.has_mobile_service && (
          <View style={{ position: 'absolute', top: 10, left: 10 }}>
            <Badge label="Vai até você" variant="info" />
          </View>
        )}
      </View>

      <View style={{ padding: 14, gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.noite, flex: 1 }} numberOfLines={1}>
            {establishment.name}
          </Text>
          {establishment.distance_km !== undefined && (
            <Text style={{ color: COLORS.gray400, fontSize: 12, marginLeft: 8 }}>
              {establishment.distance_km < 1
                ? `${Math.round(establishment.distance_km * 1000)}m`
                : `${establishment.distance_km.toFixed(1)}km`}
            </Text>
          )}
        </View>
        <StarRating rating={establishment.rating} reviewCount={establishment.review_count} />
      </View>
    </TouchableOpacity>
  );
}
