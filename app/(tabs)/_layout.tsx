import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../src/lib/constants';

const TAB_ITEMS = [
  { name: 'index',       emoji: '⊹',  label: 'Home'    },
  { name: 'buscar',      emoji: '◎',  label: 'Buscar'  },
  { name: 'mapa',        emoji: '◈',  label: 'Mapa'    },
  { name: 'agendamentos',emoji: '▦',  label: 'Agenda'  },
  { name: 'perfil',      emoji: '◉',  label: 'Perfil'  },
];

const EMOJIS: Record<string, string> = {
  index: '🏠', buscar: '🔍', mapa: '🗺️', agendamentos: '📅', perfil: '👤',
};

function TabIcon({ name, label, focused }: { name: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 4, paddingTop: 10 }}>
      {focused && (
        <View style={{
          position: 'absolute', top: 6,
          width: 48, height: 30, borderRadius: 15,
          backgroundColor: `${COLORS.chuva}20`,
        }} />
      )}
      <Text style={{ fontSize: 20, lineHeight: 24 }}>{EMOJIS[name]}</Text>
      <Text style={{
        fontSize: 10, fontWeight: focused ? '700' : '500',
        color: focused ? COLORS.chuva : 'rgba(255,255,255,0.3)',
        letterSpacing: 0.3,
      }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.noite,
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: Platform.OS === 'web' ? 72 : 80,
          paddingBottom: Platform.OS === 'web' ? 8 : 16,
          paddingTop: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      {TAB_ITEMS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name={t.name} label={t.label} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
