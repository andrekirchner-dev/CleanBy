import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, FlatList,
  ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react-native';
import { COLORS } from '../../src/lib/constants';
import { useProductStore } from '../../src/stores/productStore';
import { useCartStore } from '../../src/stores/cartStore';
import { useAuthStore } from '../../src/stores/authStore';
import { Button } from '../../src/components/ui/Button';

const CATEGORIES = [
  { key: null,         label: 'Todos' },
  { key: 'limpeza',   label: 'Limpeza' },
  { key: 'polimento', label: 'Polimento' },
  { key: 'acessorios',label: 'Acessórios' },
];

export default function LojaScreen() {
  const router = useRouter();
  const { products, loading, fetch } = useProductStore();
  const { addItem, items, count, total } = useCartStore();
  const isPro = useAuthStore((s) => s.user?.plan === 'pro');
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => { fetch(category ?? undefined); }, [category]);

  const cartCount = count();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.noite }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14,
        flexDirection: 'row', alignItems: 'center', gap: 12,
        borderBottomWidth: 1, borderBottomColor: COLORS.border,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 38, height: 38, borderRadius: 19,
            backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowLeft size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: '800', flex: 1, letterSpacing: -0.3 }}>
          Loja Automotiva
        </Text>
        {cartCount > 0 && (
          <View style={{ position: 'relative' }}>
            <ShoppingCart size={22} color={COLORS.chuva} strokeWidth={2} />
            <View style={{
              position: 'absolute', top: -6, right: -6,
              backgroundColor: COLORS.error, borderRadius: 8,
              width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ color: COLORS.white, fontSize: 9, fontWeight: '800' }}>{cartCount}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
        style={{ flexGrow: 0 }}
      >
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={String(c.key)}
            onPress={() => setCategory(c.key)}
            style={{
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
              backgroundColor: category === c.key ? COLORS.chuva : COLORS.surface,
              borderWidth: 1, borderColor: category === c.key ? 'transparent' : COLORS.border,
            }}
          >
            <Text style={{
              color: category === c.key ? COLORS.white : 'rgba(255,255,255,0.5)',
              fontWeight: '600', fontSize: 13,
            }}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ height: 1, backgroundColor: COLORS.border, marginHorizontal: 20 }} />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={COLORS.chuva} size="large" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, paddingBottom: cartCount > 0 ? 110 : 32, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60, gap: 16 }}>
              <View style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Package size={36} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>Nenhum produto disponível</Text>
            </View>
          }
          renderItem={({ item }) => {
            const inCart = items.find((i) => i.product.id === item.id);
            const proDiscount = isPro && item.pro_points;
            return (
              <View style={{
                flex: 1, backgroundColor: COLORS.noiteSurface, borderRadius: 16,
                overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border,
              }}>
                {/* Image placeholder */}
                <View style={{
                  height: 110, backgroundColor: COLORS.surface,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Package size={40} color="rgba(255,255,255,0.12)" strokeWidth={1.5} />
                </View>
                <View style={{ padding: 12, gap: 6 }}>
                  {item.pro_points && (
                    <View style={{
                      backgroundColor: 'rgba(0,201,160,0.15)', paddingHorizontal: 8, paddingVertical: 3,
                      borderRadius: 100, alignSelf: 'flex-start',
                      borderWidth: 1, borderColor: 'rgba(0,201,160,0.25)',
                    }}>
                      <Text style={{ color: COLORS.verdeAgua, fontSize: 10, fontWeight: '700' }}>
                        ✦ +{item.pro_points} pts PRO
                      </Text>
                    </View>
                  )}
                  <Text style={{ fontWeight: '700', color: COLORS.white, fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 16, letterSpacing: -0.3 }}>
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => addItem(item)}
                    style={{
                      backgroundColor: inCart ? COLORS.verdeAgua : COLORS.chuva,
                      borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 2,
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 12 }}>
                      {inCart ? `✓ ${inCart.quantity} no carrinho` : 'Adicionar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Cart bar */}
      {cartCount > 0 && (
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: COLORS.noite, padding: 16,
          borderTopWidth: 1, borderTopColor: COLORS.border,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
              {cartCount} {cartCount === 1 ? 'item' : 'itens'}
            </Text>
            <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 18, letterSpacing: -0.3 }}>
              R$ {total().toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <Button label="Finalizar compra" onPress={() => {}} variant="pro" size="md" />
        </View>
      )}
    </SafeAreaView>
  );
}
