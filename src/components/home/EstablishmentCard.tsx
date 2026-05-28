import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Car } from 'lucide-react-native';
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
        backgroundColor: COLORS.noiteSurface,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        ...style,
      }}
      activeOpacity={0.85}
    >
      <View style={{ height: 148, backgroundColor: 'rgba(26,122,200,0.08)' }}>
        {establishment.cover_url ? (
          <Image
            source={{ uri: establishment.cover_url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Car size={48} color={COLORS.chuva} strokeWidth={1} />
          </View>
        )}
        <View style={{ position: 'absolute', top: 12, right: 12 }}>
          <Badge
            label={establishment.is_open ? 'Aberto' : 'Fechado'}
            variant={establishment.is_open ? 'open' : 'closed'}
          />
        </View>
        {establishment.has_mobile_service && (
          <View style={{ position: 'absolute', top: 12, left: 12 }}>
            <Badge label="Vai até você" variant="info" />
          </View>
        )}
      </View>

      <View style={{ padding: 14, gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.white, flex: 1, letterSpacing: 0.1 }} numberOfLines={1}>
            {establishment.name}
          </Text>
          {establishment.distance_km !== undefined && (
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginLeft: 8 }}>
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
