import { CONFIG } from "@/constants/keys";
import { fetchImages } from "@/services/api";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface EventCardProps {
  event: Events;
  onPress?: () => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const [imageUrl, setImageUrl] = useState<string>(CONFIG.DEFAULT_IMAGE);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setImageLoading(true);
        const url = await fetchImages(event.allKeywords, event.id);
        if (mounted) setImageUrl(url);
      } catch {
        if (mounted) setImageUrl(CONFIG.DEFAULT_IMAGE);
      } finally {
        if (mounted) setImageLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [event.id, event.allKeywords]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="w-72 mr-4 rounded-[28px] overflow-hidden border border-white/10 bg-white/5"
    >
      {imageLoading ? (
        <View className="w-full h-44 items-center justify-center bg-black/30">
          <ActivityIndicator size="small" color="#7AD6FF" />
        </View>
      ) : (
        <ImageBackground
          source={{ uri: imageUrl }}
          className="w-full h-44"
          resizeMode="cover"
        >
          <View className="absolute inset-0 bg-black/20" />
          <View className="absolute top-3 left-3">
            <View className="bg-black/50 rounded-full px-3 py-1 border border-white/20">
              <Text className="text-white/90 text-xs uppercase tracking-[2px]">
                {event.category.replace(/_/g, " ")}
              </Text>
            </View>
          </View>
        </ImageBackground>
      )}

      <View className="p-4">
        <Text className="text-white/50 text-xs mb-1">{event.date_display}</Text>
        <Text
          className="text-white font-semibold text-base leading-5"
          numberOfLines={2}
        >
          {event.event_name}
        </Text>
        <Text className="text-white/60 text-sm mt-2 leading-5" numberOfLines={2}>
          {event.description}
        </Text>
        {event.brightness ? (
          <View className="mt-3 flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full bg-[#7AD6FF]" />
            <Text className="text-white/40 text-xs">{event.brightness}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}