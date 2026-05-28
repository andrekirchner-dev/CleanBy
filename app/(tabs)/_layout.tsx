import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { Home, Search, Map, Calendar, User } from 'lucide-react-native';
import { COLORS } from '../../src/lib/constants';

const TAB_ITEMS = [
  { name: 'index',        Icon: Home,     label: 'Home'   },
  { name: 'buscar',       Icon: Search,   label: 'Buscar' },
  { name: 'mapa',         Icon: Map,      label: 'Mapa'   },
  { name: 'agendamentos', Icon: Calendar, label: 'Agenda' },
  { name: 'perfil',       Icon: User,     label: 'Perfil' },
];

function TabIcon({ Icon, label, focused }: { Icon: React.ComponentType<any>; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 4, paddingTop: 10 }}>
      {focused && (
        <View style={{
          position: 'absolute', top: 6,
          width: 48, height: 30, borderRadius: 15,
          backgroundColor: `${COLORS.chuva}20`,
        }} />
      )}
      <Icon
        size={22}
        color={focused ? COLORS.chuva : 'rgba(255,255,255,0.3)'}
        strokeWidth={focused ? 2.2 : 1.8}
      />
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
              <TabIcon Icon={t.Icon} label={t.label} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
