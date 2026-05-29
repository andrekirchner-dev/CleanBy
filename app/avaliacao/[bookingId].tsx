import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';
import { COLORS } from '../../src/lib/constants';
import { useAuthStore } from '../../src/stores/authStore';
import { useBookingStore } from '../../src/stores/bookingStore';
import { createReview } from '../../src/lib/db';

export default function AvaliacaoScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const booking = useBookingStore((s) => s.bookings.find((b) => b.id === bookingId));

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !booking || rating === 0) return;
    setSubmitting(true);
    try {
      await createReview({
        user_id: user.id,
        establishment_id: booking.establishment_id,
        booking_id: booking.id,
        rating,
        comment: comment.trim() || undefined,
        created_at: new Date().toISOString(),
      });
      Alert.alert('Obrigado!', 'Sua avaliação foi enviada.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível enviar a avaliação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.noite, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'rgba(255,255,255,0.4)' }}>Agendamento não encontrado.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.noite }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
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
          <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: '700' }}>Avaliar serviço</Text>
        </View>

        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          {/* Establishment info */}
          <View style={{
            backgroundColor: COLORS.noiteSurface, borderRadius: 16, padding: 18,
            borderWidth: 1, borderColor: COLORS.border, marginBottom: 32,
          }}>
            <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>{booking.service_name}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>{booking.establishment_name}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 4 }}>
              {new Date(booking.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>

          {/* Star rating */}
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
            Como foi o serviço?
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 36 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.7}>
                <Star
                  size={42}
                  color={n <= rating ? COLORS.warning : 'rgba(255,255,255,0.12)'}
                  fill={n <= rating ? COLORS.warning : 'transparent'}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Comment */}
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 10 }}>
            Comentário (opcional)
          </Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Conte como foi a experiência..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: COLORS.noiteSurface, borderRadius: 14,
              borderWidth: 1, borderColor: COLORS.border,
              color: COLORS.white, fontSize: 15,
              padding: 16, textAlignVertical: 'top',
              minHeight: 110,
            }}
          />
        </View>

        {/* Submit */}
        <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border }}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={rating === 0 || submitting}
            style={{
              backgroundColor: rating === 0 ? 'rgba(0,201,160,0.3)' : COLORS.verdeAgua,
              borderRadius: 100, paddingVertical: 16,
              alignItems: 'center', justifyContent: 'center',
            }}
            activeOpacity={0.8}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 16 }}>
                {rating === 0 ? 'Selecione uma nota' : 'Enviar avaliação'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
