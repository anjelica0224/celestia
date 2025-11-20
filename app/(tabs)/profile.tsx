'use client';

import { images } from "@/constants/images";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ImageBackground, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground source={images.bg} className="flex-1" resizeMode="cover" >
      <SafeAreaView
        style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
        className="justify-center px-8"
      >
        <View className="w-full align-middle items-center">
          <Text className="text-white/60 text-4xl uppercase font-light tracking-widest mt-6">Your cosmic Passport</Text>
          <View className="mt-10">
            <Text className="text-white/60 uppercase tracking-[6px] text-xs">Coming soon</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}