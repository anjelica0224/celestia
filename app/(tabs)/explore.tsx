'use client';
import { images } from "@/constants/images";
import { fetchImages } from "@/services/api";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PROMPTS = [
  { key: "saturn",     label: "Saturn" },
  { key: "horsehead",  label: "Horsehead" },
  { key: "orion dreamy stars",  label: "Orion nebula" },
  { key: "Galaxy Evolution Explorer GALEX", label: "Andromeda" },
  { key: "hubble",     label: "Hubble" },
  {key: "Hubble Discovery of Runaway Star Yields Clues to Breakup of Multiple-Star System", label: "Hubble runaway star" },
  { key: "jupiter great red spot", label: "Jupiter" },
  { key: "earthrise apollo", label: "Earthrise" },
  { key: "milky way hubble", label: "Milky Way" },
  { key: "butterfly nebula hubble", label: "Butterfly Nebula" },
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Explore() {
  const [gallery, setGallery] = useState<{ id: string; label: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const loadGallery = async () => {
    try {
      const items = await Promise.all(
        PROMPTS.map(async ({ key, label }) => {
          // Single-item array + eventId=0 → always the first NASA result for this exact query
          const url = await fetchImages([key], 0);
          return { id: key, label, url };
        })
      );
      setGallery(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={images.bg}
        className="flex-1"
        resizeMode="cover"
        imageStyle={{ opacity: 0.8 }}
      >
        <View className="flex-1 bg-black/60 items-center justify-center">
          <ActivityIndicator size="large" color="#7AD6FF" />
          <Text className="text-white/70 mt-3">Collecting NASA imagery...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <FlatList
        ref={flatListRef}
        data={gallery}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
            <Pressable
              onPress={() =>
                Linking.openURL(`${item.url}`)
              }
            >
              <Image
                source={{ uri: item.url }}
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                resizeMode="cover"
              />
            </Pressable>
            <View className="absolute top-20 left-0 right-0 items-center">
              <View className="bg-white/10 px-6 py-2 rounded-full border border-white/20">
                <Text className="text-white text-sm font-medium tracking-wider">
                  {item.label}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      <SafeAreaView className="absolute inset-x-0 top-0" pointerEvents="none">
        <View className="px-8 pt-4">
          <Text className="text-white/80 uppercase tracking-[6px] text-xs font-medium">
            CELESTIA
          </Text>
        </View>
      </SafeAreaView>

      <SafeAreaView className="absolute inset-x-0 bottom-0" pointerEvents="none">
        <View className="px-8 pb-8">
          <Text className="text-white text-2xl font-light mb-2">NASA Archive</Text>
          <Text className="text-white/70 text-sm leading-5 mb-6">
            Swipe through images from NASA's open archive
          </Text>
          <View className="flex-row justify-center items-center gap-2">
            {gallery.map((_, index) => {
              const inputRange = [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ];
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1, 0.8],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    opacity,
                    transform: [{ scale }],
                  }}
                />
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}