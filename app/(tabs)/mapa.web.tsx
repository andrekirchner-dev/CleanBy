import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, X, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../../src/lib/constants';
import { StarRating } from '../../src/components/ui/StarRating';
import type { Establishment } from '../../src/types';

const MOCK: Establishment[] = [
  { id: '1', name: 'AutoSpa Premium', slug: 'autospa-premium', rating: 4.8, review_count: 124, address: 'Rua das Flores, 123', latitude: -23.550, longitude: -46.633, distance_km: 0.8, is_open: true, opening_hours: {}, has_mobile_service: true, categories: ['lavagem_simples'], cover_url: undefined, logo_url: undefined },
  { id: '2', name: 'LavaCar Express', slug: 'lavacar-express', rating: 4.5, review_count: 89, address: 'Av. Paulista, 456', latitude: -23.562, longitude: -46.644, distance_km: 1.2, is_open: true, opening_hours: {}, has_mobile_service: false, categories: ['lavagem_completa'], cover_url: undefined, logo_url: undefined },
  { id: '3', name: 'Shine & Clean', slug: 'shine-clean', rating: 4.9, review_count: 201, address: 'Rua Augusta, 789', latitude: -23.541, longitude: -46.651, distance_km: 2.1, is_open: false, opening_hours: {}, has_mobile_service: true, categories: ['estetica_completa'], cover_url: undefined, logo_url: undefined },
];

function createMarkerIcon(isSelected: boolean, isOpen: boolean) {
  const bg = isSelected ? '#1A7AC8' : isOpen ? '#00C9A0' : '#E24B4A';
  const size = isSelected ? 18 : 14;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.6);cursor:pointer;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapClickHandler({ onDeselect }: { onDeselect: () => void }) {
  useMapEvents({ click: onDeselect });
  return null;
}

export default function MapaWebScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Establishment | null>(null);
  const [onlyMobile, setOnlyMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.onload = () => setReady(true);
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `.leaflet-container{background:#080F1E!important}.leaflet-control-attribution{display:none!important}`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  const filtered = onlyMobile ? MOCK.filter((e) => e.has_mobile_service) : MOCK;
  const handleDeselect = useCallback(() => setSelected(null), []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ flex: 1, position: 'relative' }}>

          {/* Map layer */}
          {ready ? (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <MapContainer
                center={[-23.552, -46.640]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                <MapClickHandler onDeselect={handleDeselect} />
                {filtered.map((e) => (
                  <Marker
                    key={e.id}
                    position={[e.latitude, e.longitude]}
                    icon={createMarkerIcon(selected?.id === e.id, e.is_open)}
                    eventHandlers={{
                      click: (ev) => {
                        ev.originalEvent.stopPropagation();
                        setSelected(e);
                      },
                    }}
                  />
                ))}
              </MapContainer>
            </View>
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.chuva }} />
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Carregando mapa...</Text>
            </View>
          )}

          {/* Top-left legend */}
          <View style={{
            position: 'absolute', top: 12, left: 14,
            flexDirection: 'row', gap: 12,
            backgroundColor: 'rgba(8,15,30,0.85)',
            borderRadius: 100, paddingHorizontal: 12, paddingVertical: 8,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
          }}>
            {[{ color: '#00C9A0', label: 'Aberto' }, { color: '#E24B4A', label: 'Fechado' }].map((l) => (
              <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: l.color }} />
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{l.label}</Text>
              </View>
            ))}
          </View>

          {/* Top-right filter */}
          <View style={{ position: 'absolute', top: 12, right: 14 }}>
            <TouchableOpacity
              onPress={() => setOnlyMobile(!onlyMobile)}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingHorizontal: 14, paddingVertical: 9, borderRadius: 100,
                backgroundColor: onlyMobile ? COLORS.chuva : 'rgba(8,15,30,0.85)',
                borderWidth: 1, borderColor: onlyMobile ? 'transparent' : 'rgba(255,255,255,0.12)',
              }}
            >
              <Navigation size={13} color={onlyMobile ? COLORS.white : 'rgba(255,255,255,0.7)'} strokeWidth={2} />
              <Text style={{ color: onlyMobile ? COLORS.white : 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 13 }}>
                Vai até você
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selected establishment card */}
          {selected && (
            <View style={{
              position: 'absolute', bottom: 16, left: 14, right: 14,
              backgroundColor: COLORS.noiteSurface,
              borderRadius: 20, padding: 16,
              borderWidth: 1, borderColor: COLORS.border,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.white, letterSpacing: -0.2, marginBottom: 2 }} numberOfLines={1}>
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
                {selected.distance_km !== undefined && (
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
      </SafeAreaView>
    </View>
  );
}
