'use client';

import { images } from "@/constants/images";
import { fetchAllEvents } from "@/services/api";
import { useFetch } from "@/services/usefetch";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number) {
  return n < 10 ? "0" + n : String(n);
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function todayStr() {
  const n = new Date();
  return toDateStr(n.getFullYear(), n.getMonth(), n.getDate());
}

export default function CalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: events, loading } = useFetch(fetchAllEvents);

  const today = todayStr();
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const eventsByDate = useMemo(() => {
    const map: Record<string, Events[]> = {};
    for (const e of events ?? []) {
      (map[e.date] ??= []).push(e);
    }
    return map;
  }, [events]);

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  const selectedEvents = eventsByDate[selectedDate] ?? [];

  const changeMonth = (delta: number) => {
    setViewDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#050B1A] items-center justify-center">
        <ActivityIndicator size="large" color="#7AD6FF" />
        <Text className="text-white/80 mt-4">Loading calendar...</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={images.bg} className="flex-1" resizeMode="cover">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Header */}
        <Text className="text-white/60 uppercase tracking-[6px] text-xs">
          Celestia
        </Text>
        <Text className="text-white text-3xl font-light mt-2">
          Sky Calendar
        </Text>

        {/* Month Nav */}
        <View className="flex-row items-center justify-between mt-8">
          <TouchableOpacity
            onPress={() => changeMonth(-1)}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold tracking-wide">
            {MONTHS[month]} {year}
          </Text>
          <TouchableOpacity
            onPress={() => changeMonth(1)}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Weekday headers */}
        <View className="flex-row mt-6">
          {WEEKDAYS.map((wd) => (
            <View key={wd} className="flex-1 items-center">
              <Text className="text-white/50 text-xs uppercase tracking-widest">
                {wd}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View className="mt-3">
          {weeks.map((wk, wi) => (
            <View key={wi} className="flex-row">
              {wk.map((day, di) => {
                if (day === null) {
                  return <View key={`e${di}`} className="flex-1 h-12" />;
                }
                const ds = toDateStr(year, month, day);
                const isToday = ds === today;
                const isSelected = ds === selectedDate;
                const hasEvents = (eventsByDate[ds]?.length ?? 0) > 0;

                return (
                  <TouchableOpacity
                    key={ds}
                    onPress={() => setSelectedDate(ds)}
                    className={`flex-1 h-12 items-center justify-center rounded-xl mx-[2px] my-[2px] ${
                      isSelected
                        ? "bg-[#6592AB]"
                        : isToday
                          ? "bg-white/10 border border-[#6592AB]"
                          : ""
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        isSelected
                          ? "text-white font-bold"
                          : isToday
                            ? "text-[#7AD6FF] font-semibold"
                            : "text-white/80"
                      }`}
                    >
                      {day}
                    </Text>
                    {hasEvents && (
                      <View
                        className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                          isSelected ? "bg-white" : "bg-[#7AD6FF]"
                        }`}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Selected date events */}
        <View className="mt-8">
          <Text className="text-white/60 text-xs uppercase tracking-[4px]">
            {selectedDate === today
              ? "Today"
              : new Date(selectedDate + "T12:00:00").toLocaleDateString(
                  "en-US",
                  { weekday: "long", month: "long", day: "numeric" },
                )}
          </Text>

          {selectedEvents.length === 0 ? (
            <View className="mt-4 p-6 rounded-2xl border border-white/10 bg-white/5 items-center">
              <Text className="text-white/50">
                No celestial events on this date.
              </Text>
            </View>
          ) : (
            selectedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() =>
                  router.push({
                    pathname: "/event/[id]",
                    params: { id: event.id.toString() },
                  })
                }
                activeOpacity={0.8}
                className="mt-4 p-5 rounded-2xl border border-white/10 bg-white/5"
              >
                <View className="flex-row items-center justify-between">
                  <View className="bg-white/10 rounded-full px-3 py-1">
                    <Text className="text-[#7AD6FF] text-xs uppercase tracking-wider">
                      {event.category.replace("_", " ")}
                    </Text>
                  </View>
                  <Text className="text-white/40 text-xs">
                    {event.viewing_time}
                  </Text>
                </View>
                <Text className="text-white text-base font-semibold mt-3">
                  {event.event_name}
                </Text>
                <Text className="text-white/60 text-sm mt-1" numberOfLines={2}>
                  {event.description}
                </Text>
                <View className="flex-row items-center mt-3">
                  <Ionicons
                    name="eye-outline"
                    size={14}
                    color="rgba(255,255,255,0.4)"
                  />
                  <Text className="text-white/40 text-xs ml-1">
                    {event.requires_equipment}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
