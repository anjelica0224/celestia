'use client';

import { images } from "@/constants/images";
import { CONFIG } from "@/constants/keys";
import { fetchEventById, fetchImages } from "@/services/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const numericId = id ? Number(id) : NaN;
  const insets = useSafeAreaInsets();

  const [event, setEvent] = useState<Events | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(CONFIG.DEFAULT_IMAGE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvent = async () => {
      if (!id || Number.isNaN(numericId)) {
        setError("Invalid event selected.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const found = await fetchEventById(numericId);
        if (!found) {
          setError("We couldn’t find this event anymore.");
        } else {
          setEvent(found);
          try {
            const hero = await fetchImages(found.keywords || found.event_name);
            setImageUrl(hero);
          } catch {
            setImageUrl(CONFIG.DEFAULT_IMAGE);
          }
        }
      } catch (err) {
        setError("Unable to load this event right now.");
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [id, numericId]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#03071E] items-center justify-center">
        <ActivityIndicator size="large" color="#7AD6FF" />
        <Text className="text-white/80 mt-3">Loading mission details…</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="flex-1 bg-[#03071E] items-center justify-center px-10">
        <Text className="text-white/80 text-center">{error ?? "Event not available."}</Text>
        <TouchableOpacity className="mt-6 px-6 py-3 rounded-full bg-white/20" onPress={() => router.back()}>
          <Text className="text-white font-semibold">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground source={images.bg} className="flex-1" resizeMode="cover" >
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}>
        <View className="relative h-[380px]">
          <ImageBackground
            source={{ uri: imageUrl }}
            className="flex-1"
            resizeMode="cover"
            imageStyle={{ opacity: 0.9 }}
          >
            <View className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black" />
            <View className="px-6 pt-14 flex-row justify-between items-center" style={{ paddingTop: insets.top + 20 }}>
              <TouchableOpacity
                className="w-11 h-11 rounded-full bg-black/50 border border-white/30 items-center justify-center"
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </TouchableOpacity>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </View>
            <View className="absolute bottom-10 px-6">
              <Text className="text-white/70 text-sm">{event.date_display}</Text>
              <Text className="text-white text-3xl font-semibold mt-2">{event.event_name}</Text>
              <Text className="text-white/60 mt-1">
                {event.constellation || event.visibility || "Sky-wide"}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View className="px-6 mt-8">
          <Text className="text-white/60 text-xs uppercase tracking-[4px]">This week&apos;s focus</Text>
          <Text className="text-white text-xl font-semibold mt-3">{event.category.replace("_", " ")}</Text>
          <Text className="text-white/80 leading-7 mt-4">{event.description}</Text>

          <View className="mt-8 border-t border-white/15 pt-6">
            <Text className="text-white/60 text-xs uppercase tracking-[4px]">Viewing tips</Text>
            <Text className="text-white mt-3">{event.viewing_time || "Check local times"}</Text>
            <Text className="text-white/80 mt-2">{event.visibility || "Varies"}</Text>
            <Text className="text-white/80 mt-2">
             {event.requires_equipment || "No special gear"}
            </Text>
          </View>

          <View className="mt-8 border-t border-white/15 pt-6">
            <Text className="text-white/60 text-xs uppercase tracking-[4px]">Story</Text>
            <Text className="text-white/75 leading-7">
              {event.raw_description ||
                "This celestial body has inspired countless observers. More lore will be logged soon."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

