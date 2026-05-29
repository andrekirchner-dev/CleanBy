import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker, type Region } from 'react-native-maps';
import { Navigation, X, ChevronRight, Locate } from 'lucide-react-native';
import * as Location from 'expo-location';
import { COLORS } from '../../src/lib/constants';
import { StarRating } from '../../src/components/ui/StarRating';
import { useEstablishmentStore } from '../../src/stores/establishmentStore';
import type { Establishment } from '../../src/types';

const DEFAULT_REGION: Region = { latitude: -23.55, longitude: -46.64, latitudeDelta: 0.05, longitudeDelta: 0.05 };

export default function MapaScreen() {
  const router = useRouter();
  const { establishments, fetch } = useEstablishmentStore();
  const [selected, setSelected] = useState<Establishment | null>(null);
  const [onlyMobile, setOnlyMobile] = useState(false);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const userRegion: Region = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          };
          setRegion(userRegion);
          fetch(loc.coords.latitude, loc.coords.longitude);
        } else {
          fetch();
        }
      } catch {
        fetch();
      }
    })();
  }, []);

  const filtered = onlyMobile ? establishments.filter((e) => e.has_mobile_service) : establishments;

  const centerOnUser = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const r: Region = { latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.04, longitudeDelta: 0.04 };
      setRegion(r);
      mapRef.current?.animateToRegion(r, 600);
    } catch {}
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={setRegion}
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
                backgroundColor: selected?.id === e.id ? COLORS.chuva : e.is_open ? 'rgba(0,201,160,0.9)' : 'rgba(226,75,74,0.9)',
                paddingHorizontal: 10, paddingVertical: 6,
                borderRadius: 20, borderWidth: 2, borderColor: COLORS.white,
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
              }}
            >
              <Text style={{ color: COLORS.white, fontSize: 11, fontWeight: '700' }}>
                {e.name.split(' ')[0]}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header overlay */}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }} pointerEvents="box-none">
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 16, gap: 10 }}>
          <TouchableOpacity
            onPress={centerOnUser}
            style={{
              backgroundColor: COLORS.white, width: 40, height: 40, borderRadius: 20,
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Locate size={18} color={COLORS.noite} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOnlyMobile(!onlyMobile)}
            style={{
              backgroundColor: onlyMobile ? COLORS.chuva : COLORS.white,
              paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
              flexDirection: 'row', alignItems: 'center', gap: 6,
            }}
          >
            <Navigation size={13} color={onlyMobile ? COLORS.white : COLORS.noite} strokeWidth={2} />
            <Text style={{ color: onlyMobile ? COLORS.white : COLORS.noite, fontWeight: '700', fontSize: 13 }}>
              Vai até você
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Selected card */}
      {selected && (
        <View style={{
          position: 'absolute', bottom: 90, left: 16, right: 16,
          backgroundColor: COLORS.noiteSurface, borderRadius: 20, padding: 16,
          borderWidth: 1, borderColor: COLORS.border,
          shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.white, marginBottom: 2 }} numberOfLines={1}>
                {selected.name}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{selected.address}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelected(null)}
              style={{
                width: 30, height: 30, borderRadius: 15,
                backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center', marginLeft: 10,
              }}
            >
              <X size={14} color="rgba(255,255,255,0.5)" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <StarRating rating={selected.rating} reviewCount={selected.review_count} />
            <View style={{
              paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100,
              backgroundColor: selected.is_open ? 'rgba(0,201,160,0.14)' : 'rgba(226,75,74,0.14)',
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: selected.is_open ? '#00C9A0' : '#FF6B6B' }}>
                {selected.is_open ? 'Aberto' : 'Fechado'}
              </Text>
            </View>
            {selected.distance_km != null && (
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                {selected.distance_km < 1 ? `${Math.round(selected.distance_km * 1000)}m` : `${selected.distance_km.toFixed(1)}km`}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push(`/estabelecimento/${selected.id}`)}
            style={{
              backgroundColor: COLORS.chuva, borderRadius: 14,
              paddingVertical: 13, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 6,
            }}
          >
            <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>Ver estabelecimento</Text>
            <ChevronRight size={16} color={COLORS.white} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
