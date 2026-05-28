import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { COLORS } from '../../src/lib/constants';
import { EstablishmentCard } from '../../src/components/home/EstablishmentCard';
import type { Establishment } from '../../src/types';

const MOCK: Establishment[] = [
  { id: '1', name: 'AutoSpa Premium', slug: 'autospa-premium', rating: 4.8, review_count: 124, address: 'Rua das Flores, 123', latitude: -23.55, longitude: -46.63, distance_km: 0.8, is_open: true, opening_hours: {}, has_mobile_service: true, categories: ['lavagem_simples', 'polimento'], cover_url: undefined, logo_url: undefined },
  { id: '2', name: 'LavaCar Express', slug: 'lavacar-express', rating: 4.5, review_count: 89, address: 'Av. Paulista, 456', latitude: -23.56, longitude: -46.64, distance_km: 1.2, is_open: true, opening_hours: {}, has_mobile_service: false, categories: ['lavagem_simples', 'higienizacao_interna'], cover_url: undefined, logo_url: undefined },
  { id: '3', name: 'Shine & Clean', slug: 'shine-clean', rating: 4.9, review_count: 201, address: 'Rua Augusta, 789', latitude: -23.54, longitude: -46.65, distance_km: 2.1, is_open: false, opening_hours: {}, has_mobile_service: true, categories: ['estetica_completa', 'cristalizacao'], cover_url: undefined, logo_url: undefined },
  { id: '4', name: 'Cristal Auto', slug: 'cristal-auto', rating: 4.3, review_count: 56, address: 'Al. Santos, 321', latitude: -23.57, longitude: -46.66, distance_km: 3.0, is_open: true, opening_hours: {}, has_mobile_service: false, categories: ['cristalizacao', 'blindagem_pintura'], cover_url: undefined, logo_url: undefined },
];

type SortOption = 'relevancia' | 'distancia' | 'avaliacao';

const SORT_OPTS: { key: SortOption; label: string }[] = [
  { key: 'relevancia', label: 'Relevância' },
  { key: 'distancia',  label: 'Mais próximo' },
  { key: 'avaliacao',  label: 'Melhor avaliado' },
];

export default function BuscarScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevancia');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyMobile, setOnlyMobile] = useState(false);

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

  const FilterChip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100,
        backgroundColor: active ? COLORS.chuva : COLORS.surface,
        borderWidth: 1, borderColor: active ? 'transparent' : COLORS.border,
      }}
    >
      <Text style={{ color: active ? COLORS.white : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* Search header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <ArrowLeft size={18} color="rgba(255,255,255,0.75)" strokeWidth={2} />
            </TouchableOpacity>

            <View style={{
              flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
              backgroundColor: COLORS.surface,
              borderRadius: 16, paddingHorizontal: 14,
              borderWidth: 1, borderColor: COLORS.border,
            }}>
              <Search size={15} color="rgba(255,255,255,0.3)" strokeWidth={2} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar serviço ou estabelecimento..."
                placeholderTextColor="rgba(255,255,255,0.25)"
                style={{ flex: 1, color: COLORS.white, fontSize: 15, paddingVertical: 14 }}
                autoFocus
              />
              {query ? (
                <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <X size={16} color="rgba(255,255,255,0.4)" strokeWidth={2} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 14 }}
        >
          {SORT_OPTS.map((s) => (
            <FilterChip key={s.key} active={sortBy === s.key} label={s.label} onPress={() => setSortBy(s.key)} />
          ))}
          <FilterChip active={onlyOpen} label="Abertos agora" onPress={() => setOnlyOpen(!onlyOpen)} />
          <FilterChip active={onlyMobile} label="Vai até você" onPress={() => setOnlyMobile(!onlyMobile)} />
        </ScrollView>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: COLORS.border, marginHorizontal: 20 }} />

        {/* Results */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, gap: 14 }}
          ListHeaderComponent={
            <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </Text>
          }
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60, gap: 16 }}>
              <View style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Search size={36} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>Nenhum resultado encontrado</Text>
            </View>
          }
          renderItem={({ item }) => <EstablishmentCard establishment={item} />}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
}
