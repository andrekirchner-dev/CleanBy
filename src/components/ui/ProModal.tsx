import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, PRO_PRICE } from '../../lib/constants';
import { Button } from './Button';

interface ProModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const PRO_BENEFITS = [
  { icon: '💳', text: '2× por mês pague no local, sem adiantamento' },
  { icon: '✦', text: 'Acesso exclusivo a horários especiais' },
  { icon: '🏷️', text: '10% de desconto em serviços selecionados' },
  { icon: '⚡', text: 'Cartão fidelidade acumula 1.5× mais rápido' },
  { icon: '🎁', text: 'Brindes surpresa mensais' },
  { icon: '💬', text: 'Suporte prioritário via chat' },
];

export function ProModal({ visible, onClose, onSubscribe }: ProModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                backgroundColor: COLORS.verdeAgua,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 20,
                marginBottom: 12,
              }}
            >
              <Text style={{ color: COLORS.noite, fontSize: 13, fontWeight: '800' }}>
                CLEANBY PRO
              </Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.noite, textAlign: 'center' }}>
              Eleve sua experiência
            </Text>
            <Text style={{ color: COLORS.gray600, marginTop: 6, textAlign: 'center', fontSize: 14 }}>
              Todos os benefícios por apenas
            </Text>
            <Text style={{ fontSize: 32, fontWeight: '800', color: COLORS.chuva, marginTop: 4 }}>
              R$ {PRO_PRICE.toFixed(2).replace('.', ',')}/mês
            </Text>
          </View>

          <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={false}>
            {PRO_BENEFITS.map((b, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Text style={{ fontSize: 22 }}>{b.icon}</Text>
                <Text style={{ flex: 1, color: COLORS.gray800, fontSize: 14, fontWeight: '500' }}>
                  {b.text}
                </Text>
              </View>
            ))}
          </ScrollView>

          <Button label="Assinar PRO agora" onPress={onSubscribe} variant="pro" fullWidth size="lg" />
          <TouchableOpacity onPress={onClose} style={{ marginTop: 14, alignItems: 'center' }}>
            <Text style={{ color: COLORS.gray400, fontSize: 14 }}>Continuar no plano Free</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
