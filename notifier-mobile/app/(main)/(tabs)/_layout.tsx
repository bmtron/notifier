import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import colorScheme from '@/assets/colorscheme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme.tokyoLaserBlue,
        tabBarInactiveTintColor: colorScheme.tokyoLaserBlueDulled,
        tabBarActiveBackgroundColor: colorScheme.background,
        tabBarInactiveBackgroundColor: colorScheme.background,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='home' color={color} />,
        }}
      />
      <Tabs.Screen
        name='notes'
        options={{
          title: 'Notes',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='sticky-note' color={color} />,
        }}
      />
      <Tabs.Screen
        name='todos'
        options={{
          title: 'Todos',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name='list' color={color} />,
        }}
      />
    </Tabs>
  );
}
