import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, SafeAreaView, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, CATEGORY_LABELS } from '../../src/lib/constants';
import { EstablishmentCard } from '../../src/components/home/EstablishmentCard';
import { Badge } from '../../src/components/ui/Badge';
import { StarRating } from '../../src/components/ui/StarRating';
import type { Establishment } from '../../src/types';

const MOCK: Establishment[] = [
  { id: '1', name: 'AutoSpa Premium', slug: 'autospa-premium', rating: 4.8, review_count: 124, address: 'Rua das Flores, 123', latitude: -23.55, longitude: -46.63, distance_km: 0.8, is_open: true, opening_hours: {}, has_mobile_service: true, categories: ['lavagem_simples', 'polimento'], cover_url: undefined, logo_url: undefined },
  { id: '2', name: 'LavaCar Express', slug: 'lavacar-express', rating: 4.5, review_count: 89, address: 'Av. Paulista, 456', latitude: -23.56, longitude: -46.64, distance_km: 1.2, is_open: true, opening_hours: {}, has_mobile_service: false, categories: ['lavagem_simples', 'higienizacao_interna'], cover_url: undefined, logo_url: undefined },
  { id: '3', name: 'Shine & Clean', slug: 'shine-clean', rating: 4.9, review_count: 201, address: 'Rua Augusta, 789', latitude: -23.54, longitude: -46.65, distance_km: 2.1, is_open: false, opening_hours: {}, has_mobile_service: true, categories: ['estetica_completa', 'cristalizacao'], cover_url: undefined, logo_url: undefined },
  { id: '4', name: 'Cristal Auto', slug: 'cristal-auto', rating: 4.3, review_count: 56, address: 'Al. Santos, 321', latitude: -23.57, longitude: -46.66, distance_km: 3.0, is_open: true, opening_hours: {}, has_mobile_service: false, categories: ['cristalizacao', 'blindagem_pintura'], cover_url: undefined, logo_url: undefined },
];

type SortOption = 'relevancia' | 'distancia' | 'avaliacao' | 'preco';

export default function BuscarScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevancia');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyMobile, setOnlyMobile] = useState(false);

  const SORT_OPTS: { key: SortOption; label: string }[] = [
    { key: 'relevancia', label: 'Relevância' },
    { key: 'distancia', label: 'Mais próximo' },
    { key: 'avaliacao', label: 'Melhor avaliado' },
    { key: 'preco', label: 'Menor preço' },
  ];

  const filtered = MOCK.filter((e) => {
    if (onlyOpen && !e.is_open) return false;
    if (onlyMobile && !e.has_mobile_service) return false;
    if (query) {
      const q = query.toLowerCase();
      return e.name.toLowerCase().includes(q) || e.address.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'distancia') return (a.distance_km ?? 99) - (b.distance_km ?? 99);
    if (sortBy === 'avaliacao') return b.rating - a.rating;
    return 0;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offWhite }}>
      {/* Search Header */}
      <View style={{ backgroundColor: COLORS.noite, padding: 20, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: COLORS.chuva, fontSize: 16 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 }}>
            <Text style={{ fontSize: 16 }}>🔍</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar serviço ou estabelecimento..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={{ flex: 1, color: COLORS.white, fontSize: 15, paddingVertical: 14 }}
              autoFocus
            />
            {query ? (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={{ backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12, gap: 8 }}>
          {SORT_OPTS.map((s) => (
            <TouchableOpacity
              key={s.key}
              onPress={() => setSortBy(s.key)}
              style={{
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                backgroundColor: sortBy === s.key ? COLORS.chuva : COLORS.nevoa,
              }}
            >
              <Text style={{ color: sortBy === s.key ? COLORS.white : COLORS.gray600, fontSize: 13, fontWeight: '600' }}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setOnlyOpen(!onlyOpen)}
            style={{
              paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
              backgroundColor: onlyOpen ? COLORS.success : COLORS.nevoa,
            }}
          >
            <Text style={{ color: onlyOpen ? COLORS.white : COLORS.gray600, fontSize: 13, fontWeight: '600' }}>
              Abertos agora
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOnlyMobile(!onlyMobile)}
            style={{
              paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
              backgroundColor: onlyMobile ? COLORS.chuva : COLORS.nevoa,
            }}
          >
            <Text style={{ color: onlyMobile ? COLORS.white : COLORS.gray600, fontSize: 13, fontWeight: '600' }}>
              Vai até você
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <Text style={{ color: COLORS.gray400, fontSize: 13, marginBottom: 4 }}>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </Text>
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
            <Text style={{ color: COLORS.gray400, fontSize: 16 }}>Nenhum resultado encontrado</Text>
          </View>
        }
        renderItem={({ item }) => <EstablishmentCard establishment={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
