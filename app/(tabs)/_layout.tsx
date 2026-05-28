import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { COLORS } from '../../src/lib/constants';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 3, paddingTop: 8 }}>
      <View style={{
        width: 44, height: 32, borderRadius: 16,
        backgroundColor: focused ? `${COLORS.chuva}25` : 'transparent',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 18 }}>{emoji}</Text>
      </View>
      <Text style={{
        fontSize: 10,
        color: focused ? COLORS.chuva : 'rgba(255,255,255,0.35)',
        fontWeight: focused ? '700' : '500',
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
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 76,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" label="Buscar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" label="Mapa" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="agendamentos"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="📅" label="Agenda" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Perfil" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
