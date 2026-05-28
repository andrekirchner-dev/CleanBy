import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/lib/constants';
import { EstablishmentCard } from '../../src/components/home/EstablishmentCard';
import { CategoryScroll } from '../../src/components/home/CategoryScroll';
import { useAuthStore } from '../../src/stores/authStore';
import type { Establishment, ServiceCategory } from '../../src/types';

const MOCK_ESTABLISHMENTS: Establishment[] = [
  {
    id: '1', name: 'AutoSpa Premium', slug: 'autospa-premium',
    rating: 4.8, review_count: 124, address: 'Rua das Flores, 123',
    latitude: -23.55, longitude: -46.63, distance_km: 0.8,
    is_open: true, opening_hours: {}, has_mobile_service: true,
    categories: ['lavagem_simples', 'lavagem_completa', 'polimento'],
    cover_url: undefined, logo_url: undefined,
  },
  {
    id: '2', name: 'LavaCar Express', slug: 'lavacar-express',
    rating: 4.5, review_count: 89, address: 'Av. Paulista, 456',
    latitude: -23.56, longitude: -46.64, distance_km: 1.2,
    is_open: true, opening_hours: {}, has_mobile_service: false,
    categories: ['lavagem_simples', 'higienizacao_interna'],
    cover_url: undefined, logo_url: undefined,
  },
  {
    id: '3', name: 'Shine & Clean', slug: 'shine-clean',
    rating: 4.9, review_count: 201, address: 'Rua Augusta, 789',
    latitude: -23.54, longitude: -46.65, distance_km: 2.1,
    is_open: false, opening_hours: {}, has_mobile_service: true,
    categories: ['estetica_completa', 'cristalizacao', 'blindagem_pintura'],
    cover_url: undefined, logo_url: undefined,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [establishments] = useState(MOCK_ESTABLISHMENTS);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  };

  const filtered = selectedCategory
    ? establishments.filter((e) => e.categories.includes(selectedCategory))
    : establishments;

  const openNow = filtered.filter((e) => e.is_open);
  const mobileService = filtered.filter((e) => e.has_mobile_service);

  const firstName = user?.name?.split(' ')[0] ?? 'você';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.noite }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 2 }}>Olá, {firstName} 👋</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>São Paulo, SP</Text>
              <Text style={{ color: COLORS.chuva, fontSize: 11 }}>▼</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => router.push('/loja')}
              style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>🛒</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/buscar')}
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16, paddingVertical: 16, paddingHorizontal: 18,
            flexDirection: 'row', alignItems: 'center', gap: 10,
            borderWidth: 1, borderColor: COLORS.border,
          }}
        >
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
            Buscar serviço ou estabelecimento...
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.chuva} />}
      >
        {/* Categories */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ paddingHorizontal: 24, fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.4)', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>
            Serviços
          </Text>
          <CategoryScroll selected={selectedCategory} onSelect={setSelectedCategory} />
        </View>

        {/* Promotional Banner */}
        <View style={{ marginHorizontal: 24, marginBottom: 28 }}>
          <View style={{
            backgroundColor: COLORS.noiteSurface,
            borderRadius: 20, padding: 20,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            borderWidth: 1, borderColor: `${COLORS.chuva}30`,
            overflow: 'hidden',
          }}>
            <View style={{
              position: 'absolute', right: -20, top: -20,
              width: 120, height: 120, borderRadius: 60,
              backgroundColor: `${COLORS.chuva}15`,
            }} />
            <View style={{ flex: 1 }}>
              <View style={{
                backgroundColor: `${COLORS.chuva}20`, borderRadius: 8,
                paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8,
              }}>
                <Text style={{ color: COLORS.chuva, fontSize: 10, fontWeight: '700', letterSpacing: 0.8 }}>OFERTA</Text>
              </View>
              <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 16, marginBottom: 4, letterSpacing: -0.2 }}>
                Primeira lavagem com 20% off!
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                Use o código CLEAN20
              </Text>
            </View>
            <Text style={{ fontSize: 36 }}>✨</Text>
          </View>
        </View>

        {/* Open Now */}
        {openNow.length > 0 && (
          <View style={{ marginBottom: 28 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.white, letterSpacing: -0.2 }}>Abertos agora</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/buscar')}>
                <Text style={{ color: COLORS.chuva, fontSize: 13, fontWeight: '600' }}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}>
              {openNow.map((e) => (
                <EstablishmentCard key={e.id} establishment={e} style={{ width: 248 }} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Mobile Service */}
        {mobileService.length > 0 && (
          <View style={{ marginBottom: 28 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.white, letterSpacing: -0.2 }}>Vão até você 📍</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}>
              {mobileService.map((e) => (
                <EstablishmentCard key={e.id} establishment={e} style={{ width: 248 }} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Near You */}
        <View style={{ marginBottom: 48 }}>
          <Text style={{ paddingHorizontal: 24, fontSize: 17, fontWeight: '800', color: COLORS.white, marginBottom: 14, letterSpacing: -0.2 }}>
            Próximos de você
          </Text>
          <View style={{ paddingHorizontal: 24, gap: 14 }}>
            {filtered.map((e) => (
              <EstablishmentCard key={e.id} establishment={e} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
