import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, RefreshControl, TextInput,
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
  const [establishments, setEstablishments] = useState(MOCK_ESTABLISHMENTS);

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offWhite }}>
      {/* Header */}
      <View style={{ backgroundColor: COLORS.noite, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Localização atual</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>São Paulo, SP</Text>
              <Text style={{ color: COLORS.chuva, fontSize: 12 }}>▼</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.push('/loja')}>
              <Text style={{ fontSize: 24 }}>🛒</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{ fontSize: 24 }}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/buscar')}
          style={{
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: 12, padding: 14,
            flexDirection: 'row', alignItems: 'center', gap: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>🔍</Text>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>
            Buscar serviço ou estabelecimento...
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.chuva} />}
      >
        {/* Categories */}
        <View style={{ paddingTop: 20, paddingBottom: 8 }}>
          <Text style={{ paddingHorizontal: 20, fontSize: 16, fontWeight: '700', color: COLORS.noite, marginBottom: 12 }}>
            O que você precisa?
          </Text>
          <CategoryScroll selected={selectedCategory} onSelect={setSelectedCategory} />
        </View>

        {/* Promotional Banner */}
        <View style={{ marginHorizontal: 20, marginVertical: 16 }}>
          <View
            style={{
              backgroundColor: COLORS.chuva, borderRadius: 16, padding: 20,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 16, marginBottom: 4 }}>
                Primeira lavagem com 20% off!
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
                Use o código CLEAN20 no checkout
              </Text>
            </View>
            <Text style={{ fontSize: 40 }}>✨</Text>
          </View>
        </View>

        {/* Open Now */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.noite }}>Abertos agora</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/buscar')}>
              <Text style={{ color: COLORS.chuva, fontSize: 14 }}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {openNow.map((e) => (
              <EstablishmentCard key={e.id} establishment={e} style={{ width: 240 }} />
            ))}
          </ScrollView>
        </View>

        {/* Mobile Service */}
        {mobileService.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.noite }}>Vão até você 📍</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
              {mobileService.map((e) => (
                <EstablishmentCard key={e.id} establishment={e} style={{ width: 240 }} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Near You */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{ paddingHorizontal: 20, fontSize: 16, fontWeight: '700', color: COLORS.noite, marginBottom: 12 }}>
            Próximos de você
          </Text>
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {filtered.map((e) => (
              <EstablishmentCard key={e.id} establishment={e} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
