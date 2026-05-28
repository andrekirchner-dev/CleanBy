import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { COLORS } from '../../src/lib/constants';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 2, paddingTop: 6 }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, color: focused ? COLORS.chuva : COLORS.gray400, fontWeight: focused ? '700' : '400' }}>
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
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.gray200,
          borderTopWidth: 1,
          height: 72,
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
