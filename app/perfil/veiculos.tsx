import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Car, Plus, Trash2, X } from 'lucide-react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { useVehicleStore } from '../../src/stores/vehicleStore';
import { COLORS } from '../../src/lib/constants';

export default function VeiculosScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { vehicles, loading, fetch: fetchVehicles, add, remove } = useVehicleStore();

  const [showModal, setShowModal] = useState(false);
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) fetchVehicles(user.id); }, [user?.id]);

  const handleAdd = async () => {
    if (!user || !plate.trim() || !model.trim() || !color.trim()) return;
    setSaving(true);
    try {
      await add({
        user_id: user.id,
        plate: plate.trim().toUpperCase(),
        model: model.trim(),
        color: color.trim(),
        year: year ? parseInt(year, 10) : undefined,
      });
      setShowModal(false);
      setPlate(''); setModel(''); setColor(''); setYear('');
    } catch {
      Alert.alert('Erro', 'Não foi possível adicionar o veículo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, model: string) => {
    Alert.alert(
      'Remover veículo',
      `Remover "${model}" da sua lista?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => remove(id) },
      ],
    );
  };

  const resetModal = () => {
    setShowModal(false);
    setPlate(''); setModel(''); setColor(''); setYear('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{
          paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16,
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
          <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: '700', flex: 1 }}>Meus veículos</Text>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: COLORS.chuva, borderRadius: 100, paddingHorizontal: 14, paddingVertical: 8,
            }}
          >
            <Plus size={14} color={COLORS.white} strokeWidth={2.5} />
            <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={COLORS.chuva} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }} showsVerticalScrollIndicator={false}>
            {vehicles.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 60, gap: 16 }}>
                <View style={{
                  width: 80, height: 80, borderRadius: 40,
                  backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Car size={36} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                </View>
                <View style={{ alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: '700' }}>Nenhum veículo</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, textAlign: 'center' }}>
                    Adicione seu carro para agendar serviços
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowModal(true)}
                  style={{ backgroundColor: COLORS.chuva, borderRadius: 100, paddingHorizontal: 24, paddingVertical: 12 }}
                >
                  <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 14 }}>Adicionar veículo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              vehicles.map((v) => (
                <View key={v.id} style={{
                  backgroundColor: COLORS.noiteSurface, borderRadius: 18, padding: 18,
                  flexDirection: 'row', alignItems: 'center', gap: 16,
                  borderWidth: 1, borderColor: COLORS.border,
                }}>
                  <View style={{
                    width: 48, height: 48, borderRadius: 14,
                    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Car size={22} color={COLORS.chuva} strokeWidth={1.8} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15 }}>{v.model}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>
                      {v.plate}{v.color ? ` · ${v.color}` : ''}{v.year ? ` · ${v.year}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(v.id, v.model)}
                    style={{
                      width: 36, height: 36, borderRadius: 12,
                      backgroundColor: 'rgba(226,75,74,0.1)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.2)',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={15} color={COLORS.error} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </SafeAreaView>

      {/* Add vehicle modal */}
      <Modal visible={showModal} animationType="slide" transparent presentationStyle="overFullScreen">
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{
            backgroundColor: '#0D1829', borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: 24, paddingBottom: 36, gap: 16,
            borderTopWidth: 1, borderColor: COLORS.border,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: '800' }}>Novo veículo</Text>
              <TouchableOpacity onPress={resetModal}>
                <X size={20} color="rgba(255,255,255,0.4)" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {[
              { label: 'Modelo *', value: model, set: setModel, placeholder: 'Ex: Honda Civic' },
              { label: 'Placa *', value: plate, set: (t: string) => setPlate(t.toUpperCase()), placeholder: 'Ex: ABC-1234' },
              { label: 'Cor *', value: color, set: setColor, placeholder: 'Ex: Prata' },
              { label: 'Ano', value: year, set: setYear, placeholder: 'Ex: 2022', numeric: true },
            ].map(({ label, value, set: setter, placeholder, numeric }) => (
              <View key={label}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
                <TextInput
                  value={value}
                  onChangeText={setter}
                  placeholder={placeholder}
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  keyboardType={numeric ? 'numeric' : 'default'}
                  style={{
                    backgroundColor: COLORS.surface, borderRadius: 12,
                    borderWidth: 1, borderColor: COLORS.border,
                    color: COLORS.white, fontSize: 15, padding: 14,
                  }}
                />
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAdd}
              disabled={!plate.trim() || !model.trim() || !color.trim() || saving}
              style={{
                backgroundColor: (!plate.trim() || !model.trim() || !color.trim()) ? 'rgba(26,122,200,0.4)' : COLORS.chuva,
                borderRadius: 100, paddingVertical: 15, alignItems: 'center', marginTop: 4,
              }}
              activeOpacity={0.8}
            >
              {saving
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 15 }}>Adicionar veículo</Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
