'use client';

import EventPreviewCard from "@/components/EventPreviewCard";
import Header from "@/components/Header";
import { images } from "@/constants/images";
import { fetchAllEvents } from "@/services/api";
import { useFetch } from "@/services/usefetch";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;
const DAYS_TO_SHOW = 5;

function dateFormat() {
  const now = new Date();
  let year = now.getFullYear();
  let month: string | number = now.getMonth() + 1;
  let day: string | number = now.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  return `${year}-${month}-${day}`;
}

function addDays(base: string, days: number) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

const HUMAN_DATE = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export default function Index() {
  const router = useRouter();
  const today = dateFormat();
  const carouselRef = useRef<ICarouselInstance>(null);
  const { data: events, loading, error } = useFetch(fetchAllEvents);
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const sections = useMemo(() => {
    const collection = events ?? [];
    return Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
      const targetDate = addDays(today, index);
      const label =
        index === 0 ? "Tonight" : index === 1 ? "Tomorrow" : HUMAN_DATE.format(new Date(targetDate));
      return {
        date: targetDate,
        label,
        events: collection.filter((event) => event.date === targetDate),
      };
    });
  }, [events, today]);

  if (loading) {
    return (
      <View className="flex-1 bg-[#050B1A] items-center justify-center">
        <ActivityIndicator size="large" color="#7AD6FF" />
        <Text className="text-white/80 mt-4">Calibrating tonight&apos;s map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#050B1A] items-center justify-center px-8">
        <Text className="text-white/80 text-center">
          Couldn&apos;t download the sky guide. Please pull to refresh or try again shortly.
        </Text>
      </View>
    );
  }

  const activeSection = sections[activeIndex] ?? sections[0];
  const activeEvents = activeSection?.events ?? [];

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    carouselRef.current?.scrollTo({ index, animated: true });
  };

  return (
    <ImageBackground source={images.bg} className="flex-1" resizeMode="cover" >
      <View className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/95" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <Header />
        <View className="mt-10">
          <Text className="text-white/60 uppercase tracking-[6px] text-xs">Celestia</Text>
          <Text className="text-white text-4xl font-light mt-2">Stargaze tonight</Text>
          <Text className="text-white/70 mt-3 leading-6">
            Here&apos;s what to watch this week.
          </Text>
        </View>

        <View className="flex-row mt-8 flex-wrap">
          {sections.map((section, index) => {
            const isActive = index === activeIndex;
            return (
              <TouchableOpacity
                key={section.date}
                className={`mr-3 mb-3 px-5 py-2 rounded-full border ${
                  isActive ? "bg-white/30 border-transparent" : "border-white/40"
                }`}
                onPress={() => handleTabPress(index)}
              >
                <Text
                  className={`text-sm tracking-wide ${isActive ? "text-white" : "text-white/70"}`}
                  numberOfLines={1}
                >
                  {section.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="bg-white/5 border border-white/10 rounded-3xl p-6 mt-4">
          <Text className="text-white/70 text-sm">{activeSection?.label}</Text>
          <Text className="text-white text-2xl font-semibold mt-1" numberOfLines={2}>
            {activeEvents[0]?.event_name ?? "Clear skies ahead"}
          </Text>
          <Text className="text-white/60 mt-2" numberOfLines={3}>
            {activeEvents[0]?.description ??
              "We’ll notify you the moment this night receives a fresh celestial event."}
          </Text>
        </View>

        <View style={{ height: 440 }} className="mt-10">
          <Carousel
            ref={carouselRef}
            width={screenWidth - 48}
            height={440}
            data={sections}
            loop={false}
            pagingEnabled
            onSnapToItem={setActiveIndex}
            renderItem={({ item }) => (
              <View className="flex-1 gap-6">
                {item.events.length > 0 ? (
                  item.events.map((event) => (
                    <EventPreviewCard
                      key={event.id}
                      event={event}
                      onPress={() =>
                        router.push({ pathname: "/event/[id]", params: { id: event.id.toString() } })
                      }
                    />
                  ))
                ) : (
                  <View className="flex-1 items-center justify-center rounded-[32px] border border-white/10 bg-white/5">
                    <Text className="text-white/60">No events forecast for this night.</Text>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

