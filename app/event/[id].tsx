"use client";

import { images } from "@/constants/images";
import { CONFIG } from "@/constants/keys";
import { fetchEventById, fetchImages } from "@/services/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import ShareButton from "@/components/ShareButton";
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Share
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
          setError("We couldn't find this event anymore.");
        } else {
          setEvent(found);
          try {
            const hero = await fetchImages(found.allKeywords, found.id);
            setImageUrl(hero);
          } catch {
            setImageUrl(CONFIG.DEFAULT_IMAGE);
          }
        }
      } catch {
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
        <Text className="text-white/80 mt-3">Loading event details…</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="flex-1 bg-[#03071E] items-center justify-center px-10">
        <Text className="text-white/80 text-center">
          {error ?? "Event not available."}
        </Text>
        <TouchableOpacity
          className="mt-6 px-6 py-3 rounded-full bg-white/20"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ImageBackground source={images.bg} className="flex-1" resizeMode="cover">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 48 }}>

        {/* Hero image */}
        <View className="h-[420px]">
          <ImageBackground
            source={{ uri: imageUrl }}
            className="flex-1"
            resizeMode="cover"
          >
            <View className="absolute inset-0 bg-black/30" />
            <View className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

            {/* Nav */}
            <View
              className="px-6 flex-row justify-between items-center"
              style={{ paddingTop: insets.top + 16 }}
            >
              <TouchableOpacity
                className="w-11 h-11 rounded-full bg-black/50 border border-white/20 items-center justify-center"
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={22} color="#fff" />
              </TouchableOpacity>
              <ShareButton event={event} />
            </View>

            {/* Title overlay */}
            <View className="absolute bottom-8 px-6">
              <View className="bg-black/40 self-start rounded-full px-3 py-1 border border-white/20 mb-3">
                <Text className="text-[#7AD6FF] text-xs uppercase tracking-[3px]">
                  {event.category.replace(/_/g, " ")}
                </Text>
              </View>
              <Text className="text-white/70 text-sm">{event.date_display}</Text>
              <Text className="text-white text-3xl font-semibold mt-1 leading-9">
                {event.event_name}
              </Text>
              {(event.constellation || event.visibility) ? (
                <Text className="text-white/60 mt-1 text-sm">
                  {event.constellation || event.visibility}
                </Text>
              ) : null}
            </View>
          </ImageBackground>
        </View>

        {/* Body */}
        <View className="px-6 mt-8">

          {/* Description */}
          <Text className="text-white/80 leading-7 text-base">
            {event.description}
          </Text>

          {/* Viewing tips */}
          <View className="mt-8 border-t border-white/10 pt-6">
            <Text className="text-white/50 text-xs uppercase tracking-[4px] mb-4">
              Viewing tips
            </Text>
            <View className="gap-4">
              <View className="flex-row items-start gap-3">
                <Ionicons name="time-outline" size={18} color="#7AD6FF" />
                <Text className="text-white/80 flex-1 leading-5">
                  {event.viewing_time || "Check local times"}
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="eye-outline" size={18} color="#7AD6FF" />
                <Text className="text-white/80 flex-1 leading-5">
                  {event.visibility || "Varies by location"}
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="sunny-outline" size={18} color="#7AD6FF" />
                <Text className="text-white/80 flex-1 leading-5">
                  {event.brightness || "Brightness varies"}
                </Text>
              </View>
              <View className="flex-row items-start gap-3">
                <Ionicons name="telescope-outline" size={18} color="#7AD6FF" />
                <Text className="text-white/80 flex-1 leading-5">
                  {event.requires_equipment || "No special gear needed"}
                </Text>
              </View>
            </View>
          </View>

          {/* Read more */}
          {event.detail_url ? (
            <View className="mt-8 border-t border-white/10 pt-6">
              <Text className="text-white/50 text-xs uppercase tracking-[4px] mb-4">
                Read more
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(event.detail_url!)}
                className="flex-row items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-4"
              >
                <Ionicons name="globe-outline" size={18} color="#7AD6FF" />
                <Text className="text-[#7AD6FF] flex-1">
                  View on In-The-Sky.org
                </Text>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
              </TouchableOpacity>
            </View>
          ) : null}

        </View>
      </ScrollView>
    </ImageBackground>
  );
}