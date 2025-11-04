import { Tabs } from "expo-router";
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function _Layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#6592AB', tabBarItemStyle: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }, tabBarStyle: { backgroundColor: '#080A0B', padding: 10, paddingHorizontal: 20, borderColor: '#080A0B' } }}>
      <Tabs.Screen name="index" options={{ headerShown: false, tabBarIcon: ({color, focused}) => <Octicons name={focused ? 'home-fill' : 'home'} size={24} color={color}/>, tabBarShowLabel: false }} />
      <Tabs.Screen name="explore" options={{ headerShown: false, tabBarIcon: ({color, focused}) => <Ionicons name={focused ? 'planet' : 'planet-outline'} color={color} size={24}/>, tabBarShowLabel: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false, tabBarIcon: ({color, focused}) => <Octicons name={focused ? 'person-fill' : 'person'} size={24} color={color}/>, tabBarShowLabel: false }} />
    </Tabs>
  );
}
