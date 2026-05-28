import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/lib/constants';
import { useCartStore } from '../../src/stores/cartStore';
import { Button } from '../../src/components/ui/Button';
import type { Product } from '../../src/types';

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Shampoo Automotivo 500ml', description: 'Fórmula concentrada para lavagem a mão.', price: 34.90, category: 'limpeza', image_url: undefined, pro_points: 15 },
  { id: 'p2', name: 'Cera Carnaúba Premium', description: 'Proteção e brilho de longa duração.', price: 89.90, category: 'polimento', image_url: undefined, pro_points: 35 },
  { id: 'p3', name: 'Aromatizante Novo Carro', description: 'Fragrância suave e duradoura.', price: 19.90, category: 'acessorios', image_url: undefined },
  { id: 'p4', name: 'Microfibra 400gsm — Kit 3un', description: 'Panos de alta absorção sem risco.', price: 42.90, category: 'acessorios', image_url: undefined, pro_points: 20 },
  { id: 'p5', name: 'Cristalizador de Vidros', description: 'Repelente de água e sujeira para vidros.', price: 54.90, category: 'polimento', image_url: undefined, pro_points: 25 },
  { id: 'p6', name: 'Pretinho para Pneus', description: 'Revitaliza e protege com brilho intenso.', price: 24.90, category: 'limpeza', image_url: undefined },
];

const CATEGORIES = [
  { key: null, label: 'Todos' },
  { key: 'limpeza', label: 'Limpeza' },
  { key: 'polimento', label: 'Polimento' },
  { key: 'acessorios', label: 'Acessórios' },
];

export default function LojaScreen() {
  const router = useRouter();
  const { addItem, items, count, total } = useCartStore();
  const [category, setCategory] = useState<string | null>(null);

  const filtered = category ? MOCK_PRODUCTS.filter((p) => p.category === category) : MOCK_PRODUCTS;
  const cartCount = count();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offWhite }}>
      {/* Header */}
      <View style={{ backgroundColor: COLORS.noite, padding: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: COLORS.chuva, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: '800', flex: 1 }}>Loja Automotiva</Text>
        {cartCount > 0 && (
          <View style={{ position: 'relative' }}>
            <Text style={{ fontSize: 24 }}>🛒</Text>
            <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.error, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: COLORS.white, fontSize: 10, fontWeight: '700' }}>{cartCount}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Category filter */}
      <View style={{ backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12, gap: 8 }}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={String(c.key)}
              onPress={() => setCategory(c.key)}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: category === c.key ? COLORS.chuva : COLORS.nevoa }}
            >
              <Text style={{ color: category === c.key ? COLORS.white : COLORS.gray600, fontWeight: '600', fontSize: 13 }}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12, paddingBottom: cartCount > 0 ? 100 : 20 }}
        columnWrapperStyle={{ gap: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const inCart = items.find((i) => i.product.id === item.id);
          return (
            <View style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}>
              <View style={{ height: 120, backgroundColor: COLORS.nevoa, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 48 }}>🧴</Text>
              </View>
              <View style={{ padding: 12, gap: 6 }}>
                {item.pro_points && (
                  <View style={{ backgroundColor: COLORS.verdeAgua + '25', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start' }}>
                    <Text style={{ color: COLORS.verdeAgua, fontSize: 10, fontWeight: '700' }}>+{item.pro_points} pts PRO</Text>
                  </View>
                )}
                <Text style={{ fontWeight: '700', color: COLORS.noite, fontSize: 13 }} numberOfLines={2}>{item.name}</Text>
                <Text style={{ color: COLORS.noite, fontWeight: '800', fontSize: 15 }}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
                <TouchableOpacity
                  onPress={() => addItem(item)}
                  style={{ backgroundColor: inCart ? COLORS.success : COLORS.chuva, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 4 }}
                >
                  <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>
                    {inCart ? `✓ ${inCart.quantity} no carrinho` : 'Adicionar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Cart bar */}
      {cartCount > 0 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.noite, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{cartCount} {cartCount === 1 ? 'item' : 'itens'}</Text>
            <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 17 }}>R$ {total().toFixed(2).replace('.', ',')}</Text>
          </View>
          <Button label="Finalizar compra" onPress={() => {}} variant="pro" size="md" />
        </View>
      )}
    </SafeAreaView>
  );
}
