import { CONFIG } from "@/constants/keys";
import { fetchImages } from "@/services/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, Text, TouchableOpacity, View } from "react-native";

interface Props {
  event: Events;
  onPress?: () => void;
}

export default function EventPreviewCard({ event, onPress }: Props) {
  const [imageUrl, setImageUrl] = useState(CONFIG.DEFAULT_IMAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const url = await fetchImages(event.keywords || event.event_name);
        if (mounted) setImageUrl(url);
      } catch (error) {
        if (mounted) setImageUrl(CONFIG.DEFAULT_IMAGE);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [event.id, event.keywords, event.event_name]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="w-full h-80 rounded-[36px] overflow-hidden border border-white/15 bg-white/5 shadow-2xl shadow-black/40"
    >
      {loading ? (
        <View className="flex-1 items-center justify-center bg-black/30">
          <ActivityIndicator color="#7AD6FF" />
        </View>
      ) : (
        <ImageBackground
          source={{ uri: imageUrl }}
          className="flex-1 justify-between"
          resizeMode="cover"
          imageStyle={{ borderRadius: 36 }}
        >
          <View className="p-5 flex-row justify-between items-center">
            <View className="bg-black/45 rounded-full px-4 py-1 border border-white/20">
              <Text className="text-white/90 text-xs uppercase tracking-[3px]">
                {event.category.replace("_", " ")}
              </Text>
            </View>
            <Text className="text-white/70 text-xs">{event.date_display}</Text>
          </View>
          <View className="p-6 bg-black/45 rounded-[32px] m-4 border border-white/10">
            <Text className="text-white/70 text-sm">{event.visibility || "Visibility varies"}</Text>
            <Text className="text-white text-2xl font-semibold mt-2" numberOfLines={2}>
              {event.event_name}
            </Text>
          </View>
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
}

