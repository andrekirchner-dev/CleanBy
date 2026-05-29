import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { COLORS } from '../../src/lib/constants';

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuthStore();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [saving, setSaving] = useState(false);

  const hasChanges = name.trim() !== (user?.name ?? '') || phone.trim() !== (user?.phone ?? '');

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const data: { name?: string; phone?: string } = {};
      if (name.trim() !== user?.name) data.name = name.trim();
      if (phone.trim() !== (user?.phone ?? '')) data.phone = phone.trim() || undefined;
      if (Object.keys(data).length > 0) await updateUserProfile(data);
      router.back();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.noite }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          <Text style={{ color: COLORS.white, fontSize: 17, fontWeight: '700', flex: 1 }}>Editar perfil</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!hasChanges || saving || !name.trim()}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: hasChanges && name.trim() ? COLORS.verdeAgua : 'rgba(0,201,160,0.3)',
              borderRadius: 100, paddingHorizontal: 14, paddingVertical: 8,
            }}
          >
            {saving
              ? <ActivityIndicator size="small" color={COLORS.white} />
              : <>
                  <Check size={14} color={COLORS.white} strokeWidth={2.5} />
                  <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>Salvar</Text>
                </>
            }
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }} showsVerticalScrollIndicator={false}>
          {/* Avatar placeholder */}
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <View style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: COLORS.chuva, alignItems: 'center', justifyContent: 'center',
              borderWidth: 3, borderColor: 'rgba(26,122,200,0.3)',
            }}>
              <Text style={{ color: COLORS.white, fontSize: 28, fontWeight: '800' }}>
                {name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}
              </Text>
            </View>
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}>
              NOME COMPLETO *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              placeholderTextColor="rgba(255,255,255,0.2)"
              style={{
                backgroundColor: COLORS.noiteSurface, borderRadius: 14,
                borderWidth: 1, borderColor: COLORS.border,
                color: COLORS.white, fontSize: 16, padding: 16,
              }}
            />
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}>
              E-MAIL
            </Text>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14,
              borderWidth: 1, borderColor: COLORS.border, padding: 16,
            }}>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>{user?.email}</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
              O e-mail não pode ser alterado
            </Text>
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}>
              TELEFONE
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="(00) 00000-0000"
              placeholderTextColor="rgba(255,255,255,0.2)"
              keyboardType="phone-pad"
              style={{
                backgroundColor: COLORS.noiteSurface, borderRadius: 14,
                borderWidth: 1, borderColor: COLORS.border,
                color: COLORS.white, fontSize: 16, padding: 16,
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
