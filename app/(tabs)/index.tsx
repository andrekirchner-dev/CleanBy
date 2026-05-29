import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ShoppingBag, Bell, ChevronDown, Search, Gift } from 'lucide-react-native';
import * as Location from 'expo-location';
import { COLORS } from '../../src/lib/constants';
import { EstablishmentCard } from '../../src/components/home/EstablishmentCard';
import { CategoryScroll } from '../../src/components/home/CategoryScroll';
import { useAuthStore } from '../../src/stores/authStore';
import { useEstablishmentStore } from '../../src/stores/establishmentStore';
import type { ServiceCategory } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { establishments, loading, fetch } = useEstablishmentStore();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          fetch(loc.coords.latitude, loc.coords.longitude);
        } else {
          fetch();
        }
      } catch {
        fetch();
      }
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  };

  const filtered = selectedCategory
    ? establishments.filter((e) => e.categories.includes(selectedCategory))
    : establishments;
  const openNow = filtered.filter((e) => e.is_open);
  const mobileService = filtered.filter((e) => e.has_mobile_service);
  const firstName = user?.name?.split(' ')[0] ?? 'você';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 6, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 4 }}>
                Olá, {firstName}
              </Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 18, letterSpacing: -0.3 }}>
                  São Paulo, SP
                </Text>
                <View style={{
                  backgroundColor: `${COLORS.chuva}20`,
                  borderRadius: 100, paddingHorizontal: 6, paddingVertical: 2,
                }}>
                  <ChevronDown size={12} color={COLORS.chuva} strokeWidth={2.5} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => router.push('/loja')}
                style={{
                  width: 42, height: 42, borderRadius: 21,
                  backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                <ShoppingBag size={18} color="rgba(255,255,255,0.65)" strokeWidth={1.8} />
              </TouchableOpacity>
              <TouchableOpacity style={{
                width: 42, height: 42, borderRadius: 21,
                backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <View style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 8, height: 8, borderRadius: 4,
                  backgroundColor: COLORS.verdeAgua,
                  borderWidth: 2, borderColor: COLORS.noite,
                }} />
                <Bell size={18} color="rgba(255,255,255,0.65)" strokeWidth={1.8} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/buscar')}
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 18, paddingVertical: 16, paddingHorizontal: 18,
              flexDirection: 'row', alignItems: 'center', gap: 12,
              borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <Search size={15} color="rgba(255,255,255,0.3)" strokeWidth={2} />
            <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 15, flex: 1 }}>
              Buscar serviço ou estabelecimento...
            </Text>
            <View style={{
              backgroundColor: `${COLORS.chuva}20`, borderRadius: 8,
              paddingHorizontal: 8, paddingVertical: 4,
            }}>
              <Text style={{ color: COLORS.chuva, fontSize: 10, fontWeight: '700' }}>⌘K</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={COLORS.chuva} />}
        >
          {/* Categories */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                Serviços
              </Text>
              {selectedCategory && (
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <Text style={{ color: COLORS.chuva, fontSize: 12, fontWeight: '600' }}>Limpar ×</Text>
                </TouchableOpacity>
              )}
            </View>
            <CategoryScroll selected={selectedCategory} onSelect={setSelectedCategory} />
          </View>

          {/* Promo banner */}
          <View style={{ marginHorizontal: 24, marginBottom: 28 }}>
            <LinearGradient
              colors={['#1A4A7A', '#0E2E52']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ borderRadius: 22, padding: 22, overflow: 'hidden' }}
            >
              <View style={{
                position: 'absolute', right: -30, top: -30,
                width: 150, height: 150, borderRadius: 75,
                backgroundColor: 'rgba(26,122,200,0.25)',
              }} />
              <View style={{
                position: 'absolute', right: 20, bottom: -20,
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: 'rgba(0,201,160,0.15)',
              }} />

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{
                    backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start',
                    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 12,
                    flexDirection: 'row', alignItems: 'center', gap: 6,
                  }}>
                    <Gift size={10} color={COLORS.white} strokeWidth={2.5} />
                    <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>OFERTA ESPECIAL</Text>
                  </View>
                  <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 20, letterSpacing: -0.4, lineHeight: 26, marginBottom: 6 }}>
                    Primeira lavagem{'\n'}com 20% off!
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                    Código: <Text style={{ color: COLORS.white, fontWeight: '700', fontFamily: 'monospace' }}>CLEAN20</Text>
                  </Text>
                </View>
                <View style={{
                  marginLeft: 16, width: 64, height: 64, borderRadius: 32,
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
                }}>
                  <Gift size={30} color={COLORS.white} strokeWidth={1.5} />
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Open now */}
          {openNow.length > 0 && (
            <View style={{ marginBottom: 28 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 14 }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.white, letterSpacing: -0.3 }}>
                    Abertos agora
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.verdeAgua }} />
                    <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{openNow.length} disponíveis</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => router.push('/(tabs)/buscar')}
                  style={{ backgroundColor: `${COLORS.chuva}15`, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: `${COLORS.chuva}25` }}>
                  <Text style={{ color: COLORS.chuva, fontSize: 12, fontWeight: '700' }}>Ver todos</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}>
                {openNow.map((e) => <EstablishmentCard key={e.id} establishment={e} style={{ width: 256 }} />)}
              </ScrollView>
            </View>
          )}

          {/* Mobile service */}
          {mobileService.length > 0 && (
            <View style={{ marginBottom: 28 }}>
              <View style={{ paddingHorizontal: 24, marginBottom: 14 }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.white, letterSpacing: -0.3 }}>
                  Vão até você
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>
                  Serviço na porta da sua casa
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}>
                {mobileService.map((e) => <EstablishmentCard key={e.id} establishment={e} style={{ width: 256 }} />)}
              </ScrollView>
            </View>
          )}

          {/* Near you */}
          <View style={{ marginBottom: 48 }}>
            <View style={{ paddingHorizontal: 24, marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.white, letterSpacing: -0.3 }}>
                Próximos de você
              </Text>
            </View>
            <View style={{ paddingHorizontal: 24, gap: 14 }}>
              {filtered.map((e) => <EstablishmentCard key={e.id} establishment={e} />)}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
