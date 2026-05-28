import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, Dimensions, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS } from '../../src/lib/constants';
import { Badge } from '../../src/components/ui/Badge';
import { StarRating } from '../../src/components/ui/StarRating';
import { Button } from '../../src/components/ui/Button';
import { useBookingStore } from '../../src/stores/bookingStore';
import { useAuthStore } from '../../src/stores/authStore';
import { ProModal } from '../../src/components/ui/ProModal';
import type { Establishment, Service } from '../../src/types';

const { width } = Dimensions.get('window');

const MOCK_ESTABLISHMENT: Establishment = {
  id: '1', name: 'AutoSpa Premium', slug: 'autospa-premium',
  description: 'Especialistas em estética automotiva premium. Utilizamos produtos de alta qualidade para cuidar do seu veículo como ele merece.',
  rating: 4.8, review_count: 124, address: 'Rua das Flores, 123 — Jardins, São Paulo',
  latitude: -23.55, longitude: -46.63, distance_km: 0.8,
  is_open: true, has_mobile_service: true, mobile_radius_km: 10,
  opening_hours: {
    seg: { open: '08:00', close: '18:00' },
    ter: { open: '08:00', close: '18:00' },
    qua: { open: '08:00', close: '18:00' },
    qui: { open: '08:00', close: '18:00' },
    sex: { open: '08:00', close: '18:00' },
    sab: { open: '09:00', close: '16:00' },
  },
  categories: ['lavagem_simples', 'lavagem_completa', 'polimento', 'estetica_completa'],
  cover_url: undefined, logo_url: undefined,
};

const MOCK_SERVICES: Service[] = [
  { id: 's1', establishment_id: '1', name: 'Lavagem Simples', description: 'Lavagem externa com shampoo especial, secagem e limpeza de vidros.', price: 40, duration_min: 30, pro_discount_eligible: true, has_special_slots: false, category: 'lavagem_simples' },
  { id: 's2', establishment_id: '1', name: 'Lavagem Completa', description: 'Lavagem externa + aspiração interna + limpeza de painel e vidros.', price: 80, duration_min: 60, pro_discount_eligible: true, has_special_slots: false, category: 'lavagem_completa' },
  { id: 's3', establishment_id: '1', name: 'Polimento Técnico', description: 'Remoção de riscos leves e oxidação com politriz orbital. Acabamento espelhado.', price: 180, duration_min: 120, pro_discount_eligible: true, has_special_slots: true, category: 'polimento' },
  { id: 's4', establishment_id: '1', name: 'Estética Completa', description: 'Pacote completo: lavagem + polimento + cristalização + higienização interna.', price: 350, duration_min: 240, pro_discount_eligible: false, has_special_slots: true, category: 'estetica_completa' },
];

const MOCK_REVIEWS = [
  { id: 'r1', user: { name: 'Carlos M.', avatar_url: undefined }, rating: 5, comment: 'Serviço impecável! Meu carro ficou novo. Recomendo demais.', created_at: '2026-05-20' },
  { id: 'r2', user: { name: 'Ana P.', avatar_url: undefined }, rating: 4, comment: 'Ótimo atendimento, pontual e cuidadoso. Voltarei com certeza.', created_at: '2026-05-15' },
];

type Tab = 'servicos' | 'fotos' | 'avaliacoes' | 'informacoes';

export default function EstabelecimentoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { setService } = useBookingStore();
  const user = useAuthStore((s) => s.user);
  const isPro = user?.plan === 'pro';
  const [tab, setTab] = useState<Tab>('servicos');
  const [showProModal, setShowProModal] = useState(false);

  const establishment = MOCK_ESTABLISHMENT;
  const services = MOCK_SERVICES;

  const handleAgendar = (service: Service) => {
    setService(service, establishment);
    router.push(`/agendamento/${service.id}`);
  };

  const proPrice = (price: number) => price * 0.9;

  const TABS: { key: Tab; label: string }[] = [
    { key: 'servicos', label: 'Serviços' },
    { key: 'fotos', label: 'Fotos' },
    { key: 'avaliacoes', label: 'Avaliações' },
    { key: 'informacoes', label: 'Informações' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.offWhite }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover */}
        <View style={{ height: 200, backgroundColor: COLORS.oceano, position: 'relative' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 64 }}>🚗</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: 'absolute', top: 16, left: 16,
              backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20,
              width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: 18 }}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Info Header */}
        <View style={{ backgroundColor: COLORS.white, padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.noite, flex: 1 }}>
              {establishment.name}
            </Text>
            <Badge label={establishment.is_open ? 'Aberto' : 'Fechado'} variant={establishment.is_open ? 'open' : 'closed'} />
          </View>

          <StarRating rating={establishment.rating} reviewCount={establishment.review_count} size={15} />

          <Text style={{ color: COLORS.gray600, fontSize: 13, marginTop: 8 }}>
            📍 {establishment.address} • {establishment.distance_km}km
          </Text>

          {establishment.has_mobile_service && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <Badge label="Vai até você" variant="info" />
              <Text style={{ color: COLORS.gray400, fontSize: 12 }}>
                Raio de {establishment.mobile_radius_km}km
              </Text>
            </View>
          )}

          {establishment.description && (
            <Text style={{ color: COLORS.gray600, fontSize: 14, marginTop: 12, lineHeight: 20 }}>
              {establishment.description}
            </Text>
          )}
        </View>

        {/* Tabs */}
        <View style={{ backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200, marginTop: 8 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {TABS.map((t) => (
              <TouchableOpacity
                key={t.key}
                onPress={() => setTab(t.key)}
                style={{
                  paddingVertical: 14, paddingHorizontal: 4, marginRight: 24,
                  borderBottomWidth: 2, borderBottomColor: tab === t.key ? COLORS.chuva : 'transparent',
                }}
              >
                <Text style={{ color: tab === t.key ? COLORS.chuva : COLORS.gray400, fontWeight: '700', fontSize: 14 }}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={{ padding: 20 }}>
          {tab === 'servicos' && (
            <View style={{ gap: 12 }}>
              {!isPro && (
                <TouchableOpacity
                  onPress={() => setShowProModal(true)}
                  style={{
                    backgroundColor: COLORS.noite, borderRadius: 14, padding: 14,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text style={{ color: COLORS.verdeAgua, fontWeight: '700', fontSize: 13 }}>✦ Assine o PRO</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>
                      10% off em serviços elegíveis + horários exclusivos
                    </Text>
                  </View>
                  <Text style={{ color: COLORS.verdeAgua, fontWeight: '700' }}>Ver →</Text>
                </TouchableOpacity>
              )}

              {services.map((service) => (
                <View key={service.id} style={{
                  backgroundColor: COLORS.white, borderRadius: 14, padding: 16,
                  shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={{ fontWeight: '700', color: COLORS.noite, fontSize: 15 }}>{service.name}</Text>
                        {service.has_special_slots && isPro && <Text style={{ color: COLORS.verdeAgua, fontSize: 13 }}>✦</Text>}
                        {service.has_special_slots && !isPro && (
                          <TouchableOpacity onPress={() => setShowProModal(true)}>
                            <Text style={{ color: COLORS.gray400, fontSize: 13 }}>✦</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      {service.description && (
                        <Text style={{ color: COLORS.gray600, fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
                          {service.description}
                        </Text>
                      )}
                      <Text style={{ color: COLORS.gray400, fontSize: 12, marginTop: 4 }}>
                        ⏱ {service.duration_min} min
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      {isPro && service.pro_discount_eligible ? (
                        <>
                          <Text style={{ color: COLORS.gray400, fontSize: 12, textDecorationLine: 'line-through' }}>
                            R$ {service.price.toFixed(2).replace('.', ',')}
                          </Text>
                          <Text style={{ color: COLORS.verdeAgua, fontWeight: '800', fontSize: 16 }}>
                            R$ {proPrice(service.price).toFixed(2).replace('.', ',')}
                          </Text>
                        </>
                      ) : (
                        <Text style={{ color: COLORS.noite, fontWeight: '800', fontSize: 16 }}>
                          R$ {service.price.toFixed(2).replace('.', ',')}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Button label="Agendar" onPress={() => handleAgendar(service)} size="sm" fullWidth />
                </View>
              ))}
            </View>
          )}

          {tab === 'avaliacoes' && (
            <View style={{ gap: 12 }}>
              <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 20, alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 48, fontWeight: '800', color: COLORS.noite }}>{establishment.rating}</Text>
                <StarRating rating={establishment.rating} reviewCount={establishment.review_count} size={16} />
              </View>
              {MOCK_REVIEWS.map((r) => (
                <View key={r.id} style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontWeight: '700', color: COLORS.noite }}>{r.user.name}</Text>
                    <StarRating rating={r.rating} size={13} />
                  </View>
                  <Text style={{ color: COLORS.gray600, fontSize: 14, lineHeight: 20 }}>{r.comment}</Text>
                  <Text style={{ color: COLORS.gray400, fontSize: 12, marginTop: 6 }}>
                    {new Date(r.created_at).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {tab === 'informacoes' && (
            <View style={{ gap: 12 }}>
              <View style={{ backgroundColor: COLORS.white, borderRadius: 14, padding: 16 }}>
                <Text style={{ fontWeight: '700', color: COLORS.noite, fontSize: 15, marginBottom: 12 }}>Horário de funcionamento</Text>
                {Object.entries(establishment.opening_hours).map(([day, hours]) => (
                  <View key={day} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 }}>
                    <Text style={{ color: COLORS.gray600, fontSize: 14, textTransform: 'capitalize' }}>{day}</Text>
                    <Text style={{ color: COLORS.noite, fontWeight: '600', fontSize: 14 }}>{hours.open} – {hours.close}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {tab === 'fotos' && (
            <View style={{ alignItems: 'center', paddingTop: 40, gap: 12 }}>
              <Text style={{ fontSize: 48 }}>📸</Text>
              <Text style={{ color: COLORS.gray400, fontSize: 15 }}>Fotos em breve</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <ProModal visible={showProModal} onClose={() => setShowProModal(false)} onSubscribe={() => { setShowProModal(false); router.push('/pro'); }} />
    </SafeAreaView>
  );
}
