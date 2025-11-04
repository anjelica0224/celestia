import { CONFIG } from "@/config";
import { fetchImages } from "@/services/api";
import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default async function EventCard({object, url}: {object: Event, url: any}) {
  return (
    <TouchableOpacity className="w-48 mr-4 bg-gray-900 rounded-2xl overflow-hidden shadow-md">
      <Image source={{ uri: "https://i.pinimg.com/736x/8e/1c/18/8e1c18e08df9e22ede87d3fb438c8b18.jpg" }} className=" w-full rounded-lg"/>
      <View className="p-3">
        <Text className="text-white font-semibold text-base" numberOfLines={1}>hello</Text>
      </View>
    </TouchableOpacity>
  );
}
