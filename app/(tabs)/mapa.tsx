import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, Callout } from 'react-native-maps';
import { COLORS } from '../../src/lib/constants';
import { Badge } from '../../src/components/ui/Badge';
import { StarRating } from '../../src/components/ui/StarRating';
import type { Establishment } from '../../src/types';

const { height } = Dimensions.get('window');

const MOCK: Establishment[] = [
  { id: '1', name: 'AutoSpa Premium', slug: 'autospa-premium', rating: 4.8, review_count: 124, address: 'Rua das Flores, 123', latitude: -23.550, longitude: -46.633, distance_km: 0.8, is_open: true, opening_hours: {}, has_mobile_service: true, categories: ['lavagem_simples'], cover_url: undefined, logo_url: undefined },
  { id: '2', name: 'LavaCar Express', slug: 'lavacar-express', rating: 4.5, review_count: 89, address: 'Av. Paulista, 456', latitude: -23.562, longitude: -46.644, distance_km: 1.2, is_open: true, opening_hours: {}, has_mobile_service: false, categories: ['lavagem_completa'], cover_url: undefined, logo_url: undefined },
  { id: '3', name: 'Shine & Clean', slug: 'shine-clean', rating: 4.9, review_count: 201, address: 'Rua Augusta, 789', latitude: -23.541, longitude: -46.651, distance_km: 2.1, is_open: false, opening_hours: {}, has_mobile_service: true, categories: ['estetica_completa'], cover_url: undefined, logo_url: undefined },
];

export default function MapaScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Establishment | null>(null);
  const [onlyMobile, setOnlyMobile] = useState(false);

  const filtered = onlyMobile ? MOCK.filter((e) => e.has_mobile_service) : MOCK;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: -23.55,
          longitude: -46.64,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filtered.map((e) => (
          <Marker
            key={e.id}
            coordinate={{ latitude: e.latitude, longitude: e.longitude }}
            onPress={() => setSelected(e)}
          >
            <View
              style={{
                backgroundColor: selected?.id === e.id ? COLORS.chuva : COLORS.noite,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: COLORS.white,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: '700' }}>🚗</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Safe area header overlay */}
      <SafeAreaView
        style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
        pointerEvents="box-none"
      >
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16, gap: 10 }}>
          <TouchableOpacity
            onPress={() => setOnlyMobile(!onlyMobile)}
            style={{
              backgroundColor: onlyMobile ? COLORS.chuva : COLORS.white,
              paddingHorizontal: 14, paddingVertical: 8,
              borderRadius: 20, shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
            }}
          >
            <Text style={{ color: onlyMobile ? COLORS.white : COLORS.noite, fontWeight: '700', fontSize: 13 }}>
              📍 Vai até você
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Selected card */}
      {selected && (
        <View
          style={{
            position: 'absolute', bottom: 90, left: 16, right: 16,
            backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
            shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.noite }}>{selected.name}</Text>
              <Text style={{ color: COLORS.gray400, fontSize: 13, marginTop: 2 }}>{selected.address}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={{ color: COLORS.gray400, fontSize: 18, marginLeft: 8 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <StarRating rating={selected.rating} reviewCount={selected.review_count} />
            <Badge label={selected.is_open ? 'Aberto' : 'Fechado'} variant={selected.is_open ? 'open' : 'closed'} />
            {selected.distance_km && (
              <Text style={{ color: COLORS.gray400, fontSize: 13 }}>
                {selected.distance_km < 1 ? `${Math.round(selected.distance_km * 1000)}m` : `${selected.distance_km.toFixed(1)}km`}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push(`/estabelecimento/${selected.id}`)}
            style={{
              backgroundColor: COLORS.chuva, borderRadius: 12,
              paddingVertical: 12, alignItems: 'center',
            }}
          >
            <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>Ver estabelecimento</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
