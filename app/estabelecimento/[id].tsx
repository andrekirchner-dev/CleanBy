import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, Navigation } from 'lucide-react-native';
import { COLORS } from '../../src/lib/constants';
import { Badge } from '../../src/components/ui/Badge';
import { StarRating } from '../../src/components/ui/StarRating';
import { Button } from '../../src/components/ui/Button';
import { useBookingStore } from '../../src/stores/bookingStore';
import { useAuthStore } from '../../src/stores/authStore';
import { useEstablishmentStore } from '../../src/stores/establishmentStore';
import { fetchServices, fetchReviews } from '../../src/lib/db';
import { ProModal } from '../../src/components/ui/ProModal';
import type { Establishment, Service, Review } from '../../src/types';

const { width } = Dimensions.get('window');

type Tab = 'servicos' | 'fotos' | 'avaliacoes' | 'informacoes';

const TABS: { key: Tab; label: string }[] = [
  { key: 'servicos', label: 'Serviços' },
  { key: 'fotos', label: 'Fotos' },
  { key: 'avaliacoes', label: 'Avaliações' },
  { key: 'informacoes', label: 'Informações' },
];

export default function EstabelecimentoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { setService } = useBookingStore();
  const user = useAuthStore((s) => s.user);
  const { getById } = useEstablishmentStore();
  const isPro = user?.plan === 'pro';

  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('servicos');
  const [showProModal, setShowProModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const [est, svcs, revs] = await Promise.all([
        getById(id),
        fetchServices(id),
        fetchReviews(id),
      ]);
      setEstablishment(est);
      setServices(svcs);
      setReviews(revs);
      setLoading(false);
    })();
  }, [id]);

  const handleAgendar = (service: Service) => {
    if (!establishment) return;
    setService(service, establishment);
    router.push(`/agendamento/${service.id}`);
  };

  const proPrice = (price: number) => price * 0.9;

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.noite, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.chuva} size="large" />
      </View>
    );
  }

  if (!establishment) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.noite, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>Estabelecimento não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: COLORS.chuva, fontWeight: '700' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Cover */}
          <View style={{ height: 200, backgroundColor: '#0D1E3A', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 56, opacity: 0.3 }}>✦</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                position: 'absolute', top: 16, left: 16,
                backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20,
                width: 38, height: 38, alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <ArrowLeft size={18} color={COLORS.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Info Header */}
          <View style={{ backgroundColor: COLORS.noiteSurface, padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.white, flex: 1, letterSpacing: -0.3 }}>
                {establishment.name}
              </Text>
              <Badge label={establishment.is_open ? 'Aberto' : 'Fechado'} variant={establishment.is_open ? 'open' : 'closed'} />
            </View>

            <StarRating rating={establishment.rating} reviewCount={establishment.review_count} size={15} />

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <MapPin size={13} color="rgba(255,255,255,0.35)" strokeWidth={1.8} />
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
                {establishment.address}
                {establishment.distance_km != null ? ` · ${establishment.distance_km}km` : ''}
              </Text>
            </View>

            {establishment.has_mobile_service && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <Badge label="Vai até você" variant="info" />
                {establishment.mobile_radius_km != null && (
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                    Raio de {establishment.mobile_radius_km}km
                  </Text>
                )}
              </View>
            )}

            {establishment.description && (
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 12, lineHeight: 20 }}>
                {establishment.description}
              </Text>
            )}
          </View>

          {/* Tabs */}
          <View style={{ backgroundColor: COLORS.noiteSurface, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginTop: 8 }}>
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
                  <Text style={{ color: tab === t.key ? COLORS.chuva : 'rgba(255,255,255,0.35)', fontWeight: '700', fontSize: 14 }}>
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
                      backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 14,
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                      borderWidth: 1, borderColor: 'rgba(0,201,160,0.2)',
                    }}
                  >
                    <View>
                      <Text style={{ color: COLORS.verdeAgua, fontWeight: '700', fontSize: 13 }}>✦ Assine o PRO</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>
                        10% off em serviços elegíveis + horários exclusivos
                      </Text>
                    </View>
                    <Text style={{ color: COLORS.verdeAgua, fontWeight: '700' }}>Ver →</Text>
                  </TouchableOpacity>
                )}

                {services.length === 0 ? (
                  <Text style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 20 }}>
                    Nenhum serviço cadastrado ainda.
                  </Text>
                ) : services.map((service) => (
                  <View key={service.id} style={{
                    backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 16,
                    borderWidth: 1, borderColor: COLORS.border,
                  }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                      <View style={{ flex: 1, marginRight: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <Text style={{ fontWeight: '700', color: COLORS.white, fontSize: 15 }}>{service.name}</Text>
                          {service.has_special_slots && (
                            <Text style={{ color: isPro ? COLORS.verdeAgua : 'rgba(255,255,255,0.25)', fontSize: 13 }}>✦</Text>
                          )}
                        </View>
                        {service.description && (
                          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
                            {service.description}
                          </Text>
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 }}>
                          <Clock size={12} color="rgba(255,255,255,0.3)" strokeWidth={1.8} />
                          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{service.duration_min} min</Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        {isPro && service.pro_discount_eligible ? (
                          <>
                            <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, textDecorationLine: 'line-through' }}>
                              R$ {service.price.toFixed(2).replace('.', ',')}
                            </Text>
                            <Text style={{ color: COLORS.verdeAgua, fontWeight: '800', fontSize: 16 }}>
                              R$ {proPrice(service.price).toFixed(2).replace('.', ',')}
                            </Text>
                          </>
                        ) : (
                          <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 16 }}>
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
                <View style={{ backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 20, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: COLORS.border }}>
                  <Text style={{ fontSize: 48, fontWeight: '800', color: COLORS.white }}>{establishment.rating.toFixed(1)}</Text>
                  <StarRating rating={establishment.rating} reviewCount={establishment.review_count} size={16} />
                </View>
                {reviews.length === 0 ? (
                  <Text style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 16 }}>
                    Nenhuma avaliação ainda.
                  </Text>
                ) : reviews.map((r) => (
                  <View key={r.id} style={{ backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ fontWeight: '700', color: COLORS.white }}>{r.user?.name ?? 'Usuário'}</Text>
                      <StarRating rating={r.rating} size={13} />
                    </View>
                    {r.comment && (
                      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 20 }}>{r.comment}</Text>
                    )}
                    <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 6 }}>
                      {new Date(r.created_at).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {tab === 'informacoes' && (
              <View style={{ gap: 12 }}>
                <View style={{ backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border }}>
                  <Text style={{ fontWeight: '700', color: COLORS.white, fontSize: 15, marginBottom: 12 }}>Horário de funcionamento</Text>
                  {Object.keys(establishment.opening_hours).length === 0 ? (
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Não informado</Text>
                  ) : Object.entries(establishment.opening_hours).map(([day, hours]) => (
                    <View key={day} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textTransform: 'capitalize' }}>{day}</Text>
                      <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 14 }}>{hours.open} – {hours.close}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {tab === 'fotos' && (
              <View style={{ alignItems: 'center', paddingTop: 40, gap: 12 }}>
                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 40 }}>📸</Text>
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>Fotos em breve</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <ProModal visible={showProModal} onClose={() => setShowProModal(false)} onSubscribe={() => { setShowProModal(false); router.push('/pro'); }} />
    </View>
  );
}
