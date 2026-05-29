import { Tabs } from 'expo-router';
import { LayoutDashboard, CalendarDays, Store, Settings } from 'lucide-react-native';
import { COLORS } from '../../../src/lib/constants';

const TAB_ITEMS = [
  { name: 'index',          label: 'Dashboard',     Icon: LayoutDashboard },
  { name: 'agendamentos',   label: 'Agenda',         Icon: CalendarDays    },
  { name: 'estabelecimento',label: 'Estabelecimento',Icon: Store           },
  { name: 'servicos',       label: 'Serviços',       Icon: Settings        },
];

export default function ParceiroDashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0D1728',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 14,
          paddingTop: 10,
        },
        tabBarActiveTintColor: COLORS.verdeAgua,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 },
      }}
    >
      {TAB_ITEMS.map(({ name, label, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ color, focused }) => (
              <Icon
                size={22}
                color={color as string}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
