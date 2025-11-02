import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';



export default function _Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: true, tabBarIcon: ({color, focused}) => <Feather name={focused ? "home" : "home-outline"} size={24} color={color} />, tabBarShowLabel: false, tabBarActiveTintColor: '#ffd33d'}} />
      <Tabs.Screen name="explore" options={{ headerShown: false, tabBarIcon: ({focused}) => <FontAwesome5 name="wpexplorer" size={24}/>, tabBarShowLabel: false}} />
      <Tabs.Screen name="profile" options={{ headerShown: false, tabBarIcon: ({focused}) => <Octicons name="person" size={24}/>, tabBarShowLabel: false}} />
    </Tabs>
  );
}
