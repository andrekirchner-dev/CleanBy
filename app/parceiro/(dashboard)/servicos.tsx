import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, Alert, Switch, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Pencil, Trash2, X, Check, Clock, DollarSign, Tag } from 'lucide-react-native';
import { usePartnerStore } from '../../../src/stores/partnerStore';
import { COLORS } from '../../../src/lib/constants';
import type { Service, ServiceCategory } from '../../../src/types';

const CATEGORIES: { key: ServiceCategory; label: string }[] = [
  { key: 'lavagem_simples',      label: 'Lavagem Simples'      },
  { key: 'lavagem_completa',     label: 'Lavagem Completa'     },
  { key: 'higienizacao_interna', label: 'Higienização Interna' },
  { key: 'polimento',            label: 'Polimento'            },
  { key: 'cristalizacao',        label: 'Cristalização'        },
  { key: 'blindagem_pintura',    label: 'Blindagem de Pintura' },
  { key: 'estetica_completa',    label: 'Estética Completa'    },
  { key: 'vai_ate_voce',         label: 'Vai até você'         },
];

const EMPTY_FORM = {
  name: '', description: '', price: '', duration_min: '',
  category: 'lavagem_simples' as ServiceCategory,
  pro_discount_eligible: false, has_special_slots: false,
};

export default function ParceiroServicosScreen() {
  const { establishment, services, loading, addService, editService, deleteService } = usePartnerStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showCatPicker, setShowCatPicker] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description ?? '',
      price: service.price.toString(),
      duration_min: service.duration_min.toString(),
      category: service.category,
      pro_discount_eligible: service.pro_discount_eligible,
      has_special_slots: service.has_special_slots,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { Alert.alert('Atenção', 'Informe o nome do serviço'); return; }
    const price = parseFloat(form.price.replace(',', '.'));
    if (isNaN(price) || price <= 0) { Alert.alert('Atenção', 'Informe um valor válido'); return; }
    const duration = parseInt(form.duration_min);
    if (isNaN(duration) || duration <= 0) { Alert.alert('Atenção', 'Informe a duração em minutos'); return; }
    if (!establishment) return;

    setSaving(true);
    const data = {
      establishment_id: establishment.id,
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price,
      duration_min: duration,
      category: form.category,
      pro_discount_eligible: form.pro_discount_eligible,
      has_special_slots: form.has_special_slots,
    };

    if (editingId) {
      await editService(editingId, data);
    } else {
      await addService(data as Omit<Service, 'id'>);
    }

    setSaving(false);
    setModalVisible(false);
  };

  const handleDelete = (service: Service) => {
    Alert.alert('Excluir serviço', `Deseja excluir "${service.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteService(service.id) },
    ]);
  };

  const selectedCatLabel = CATEGORIES.find((c) => c.key === form.category)?.label ?? '';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
            Painel do Parceiro
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: COLORS.white, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>Serviços</Text>
            <TouchableOpacity
              onPress={openCreate}
              style={{
                backgroundColor: COLORS.verdeAgua, borderRadius: 100,
                paddingHorizontal: 16, paddingVertical: 10,
                flexDirection: 'row', alignItems: 'center', gap: 6,
              }}
            >
              <Plus size={14} color={COLORS.white} strokeWidth={2.5} />
              <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={COLORS.verdeAgua} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 24, gap: 12, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            {services.length === 0 ? (
              <View style={{ alignItems: 'center', marginTop: 60, gap: 16 }}>
                <View style={{
                  width: 80, height: 80, borderRadius: 40,
                  backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Tag size={32} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>Nenhum serviço cadastrado</Text>
                <TouchableOpacity
                  onPress={openCreate}
                  style={{ backgroundColor: COLORS.verdeAgua, borderRadius: 100, paddingHorizontal: 24, paddingVertical: 12 }}
                >
                  <Text style={{ color: COLORS.white, fontWeight: '700' }}>Adicionar primeiro serviço</Text>
                </TouchableOpacity>
              </View>
            ) : (
              services.map((service) => (
                <View key={service.id} style={{
                  backgroundColor: COLORS.noiteSurface, borderRadius: 16, padding: 16,
                  borderWidth: 1, borderColor: COLORS.border,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 15, marginBottom: 4 }}>
                        {service.name}
                        {service.has_special_slots && <Text style={{ color: COLORS.verdeAgua }}> ✦</Text>}
                      </Text>
                      {service.description ? (
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 18, marginBottom: 8 }} numberOfLines={2}>
                          {service.description}
                        </Text>
                      ) : null}
                      <View style={{ flexDirection: 'row', gap: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <DollarSign size={12} color="rgba(255,255,255,0.35)" strokeWidth={1.8} />
                          <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 14 }}>
                            R$ {service.price.toFixed(2).replace('.', ',')}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <Clock size={12} color="rgba(255,255,255,0.35)" strokeWidth={1.8} />
                          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{service.duration_min} min</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => openEdit(service)}
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Pencil size={14} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(service)}
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          backgroundColor: 'rgba(226,75,74,0.1)', borderWidth: 1, borderColor: 'rgba(226,75,74,0.2)',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={14} color={COLORS.error} strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.06)' }}>
                      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '600' }}>
                        {CATEGORIES.find((c) => c.key === service.category)?.label ?? service.category}
                      </Text>
                    </View>
                    {service.pro_discount_eligible && (
                      <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 100, backgroundColor: 'rgba(0,201,160,0.1)' }}>
                        <Text style={{ color: COLORS.verdeAgua, fontSize: 11, fontWeight: '600' }}>10% PRO</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* Modal — create/edit */}
        <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: COLORS.noite }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
              <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                  <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: '800' }}>
                    {editingId ? 'Editar serviço' : 'Novo serviço'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      width: 36, height: 36, borderRadius: 18,
                      backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <X size={16} color="rgba(255,255,255,0.6)" strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                {/* Name */}
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Nome do serviço</Text>
                <TextInput
                  value={form.name}
                  onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
                  placeholder="Lavagem Completa"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={{
                    backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                    color: COLORS.white, fontSize: 15, borderWidth: 1, borderColor: COLORS.border, marginBottom: 18,
                  }}
                />

                {/* Description */}
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Descrição (opcional)</Text>
                <TextInput
                  value={form.description}
                  onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
                  placeholder="Descreva o serviço..."
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  multiline numberOfLines={3}
                  style={{
                    backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                    color: COLORS.white, fontSize: 15, borderWidth: 1, borderColor: COLORS.border,
                    textAlignVertical: 'top', minHeight: 80, marginBottom: 18,
                  }}
                />

                {/* Price + Duration */}
                <View style={{ flexDirection: 'row', gap: 14, marginBottom: 18 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Valor (R$)</Text>
                    <TextInput
                      value={form.price}
                      onChangeText={(v) => setForm((f) => ({ ...f, price: v }))}
                      placeholder="80,00"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      keyboardType="decimal-pad"
                      style={{
                        backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                        color: COLORS.white, fontSize: 15, borderWidth: 1, borderColor: COLORS.border,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Duração (min)</Text>
                    <TextInput
                      value={form.duration_min}
                      onChangeText={(v) => setForm((f) => ({ ...f, duration_min: v }))}
                      placeholder="60"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      keyboardType="numeric"
                      style={{
                        backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                        color: COLORS.white, fontSize: 15, borderWidth: 1, borderColor: COLORS.border,
                      }}
                    />
                  </View>
                </View>

                {/* Category */}
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600', marginBottom: 8 }}>Categoria</Text>
                <TouchableOpacity
                  onPress={() => setShowCatPicker(!showCatPicker)}
                  style={{
                    backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                    borderWidth: 1, borderColor: showCatPicker ? COLORS.verdeAgua : COLORS.border,
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
                  }}
                >
                  <Text style={{ color: COLORS.white, fontSize: 15 }}>{selectedCatLabel}</Text>
                  <Tag size={16} color="rgba(255,255,255,0.3)" strokeWidth={1.8} />
                </TouchableOpacity>
                {showCatPicker && (
                  <View style={{
                    backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
                    marginBottom: 18, overflow: 'hidden',
                  }}>
                    {CATEGORIES.map((cat, i) => (
                      <TouchableOpacity
                        key={cat.key}
                        onPress={() => { setForm((f) => ({ ...f, category: cat.key })); setShowCatPicker(false); }}
                        style={{
                          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                          paddingHorizontal: 16, paddingVertical: 13,
                          borderBottomWidth: i < CATEGORIES.length - 1 ? 1 : 0, borderBottomColor: COLORS.border,
                          backgroundColor: form.category === cat.key ? 'rgba(0,201,160,0.08)' : 'transparent',
                        }}
                      >
                        <Text style={{ color: form.category === cat.key ? COLORS.verdeAgua : 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                          {cat.label}
                        </Text>
                        {form.category === cat.key && <Check size={14} color={COLORS.verdeAgua} strokeWidth={2.5} />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Toggles */}
                <View style={{ gap: 12, marginBottom: 28, marginTop: showCatPicker ? 0 : 10 }}>
                  {[
                    { key: 'pro_discount_eligible', label: 'Desconto PRO (10%)', sub: 'Assinantes PRO ganham 10% de desconto' },
                    { key: 'has_special_slots', label: 'Horário exclusivo PRO', sub: 'Slots reservados para assinantes PRO' },
                  ].map(({ key, label, sub }) => (
                    <View key={key} style={{
                      backgroundColor: COLORS.noiteSurface, borderRadius: 14, padding: 14,
                      borderWidth: 1, borderColor: COLORS.border,
                      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <View style={{ flex: 1, marginRight: 12 }}>
                        <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 14 }}>{label}</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 }}>{sub}</Text>
                      </View>
                      <Switch
                        value={(form as any)[key]}
                        onValueChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
                        trackColor={{ false: COLORS.surface, true: 'rgba(0,201,160,0.5)' }}
                        thumbColor={(form as any)[key] ? COLORS.verdeAgua : 'rgba(255,255,255,0.3)'}
                      />
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={saving}
                  style={{
                    backgroundColor: COLORS.verdeAgua, borderRadius: 16,
                    paddingVertical: 17, alignItems: 'center',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 16 }}>
                    {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar serviço'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
