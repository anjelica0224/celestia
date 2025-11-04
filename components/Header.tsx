import EvilIcons from "@expo/vector-icons/EvilIcons";
import { View, Text} from "react-native";

export default function Header() {
  return (
    <View className="flex-row justify-center items-center mt-6">
      <EvilIcons name="location" size={20} color="white" />
      <Text className="text-white text-lg font-extralight">Seattle</Text>
    </View>
  );
}


