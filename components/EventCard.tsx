import { CONFIG } from "@/constants/keys";
import { fetchImages } from "@/services/api";
import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";

interface EventCardProps {
  event: Events;
  onPress?: () => void;
}

export default async function EventCard({ event, onPress }: EventCardProps) {
  const [imageUrl, setImageUrl] = useState<string>(CONFIG.DEFAULT_IMAGE);
  const [imageLoading, setImageLoading] = useState(true);
  useEffect(() => {
    const loadImage = async () => {
      try {
        setImageLoading(true);
        const url = await fetchImages(event.keywords || event.event_name);
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image:", error);
        setImageUrl(CONFIG.DEFAULT_IMAGE);
      } finally {
        setImageLoading(false);
      }
    };

    loadImage();
  }, [event.keywords, event.event_name]);
  return (
    // <TouchableOpacity className="w-48 mr-4 bg-gray-900 rounded-2xl overflow-hidden shadow-md">
    //   <Image source={{ uri: "https://i.pinimg.com/736x/8e/1c/18/8e1c18e08df9e22ede87d3fb438c8b18.jpg" }} className=" w-full rounded-lg"/>
    //   <View className="p-3">
    //     <Text className="text-white font-semibold text-base" numberOfLines={1}>hello</Text>
    //   </View>
    // </TouchableOpacity>
    <TouchableOpacity 
      className="w-72 mr-4 bg-gray-900 rounded-2xl overflow-hidden shadow-md"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="relative w-full h-40">
        {imageLoading ? (
          <View className="w-full h-full items-center justify-center bg-gray-800">
            <ActivityIndicator size="small" color="#00BFFF" />
          </View>
        ) : (
          <Image 
            source={{ uri: imageUrl }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
        {/* Gradient overlay for better text visibility */}
        <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900" />
      </View>
      
      <View className="p-4">
        <Text className="text-white font-semibold text-base mb-1" numberOfLines={2}>
          {event.event_name}
        </Text>
        <Text className="text-gray-400 text-xs mb-2">
          {event.date_display}
        </Text>
        <Text className="text-gray-300 text-sm" numberOfLines={3}>
          {event.description}
        </Text>
        
        {/* Tags */}
        <View className="flex-row flex-wrap mt-3 gap-2">
          <View className="bg-blue-500/20 px-2 py-1 rounded-full">
            <Text className="text-blue-400 text-xs">{event.category}</Text>
          </View>
          {event.constellation && (
            <View className="bg-purple-500/20 px-2 py-1 rounded-full">
              <Text className="text-purple-400 text-xs">{event.constellation}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
