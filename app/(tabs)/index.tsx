import { useFetch } from "@/services/usefetch";
import { fetchEvents, fetchImages, fetchOtherEvents } from "@/services/api";
import { Text, ScrollView, View, ActivityIndicator, FlatList } from "react-native";
import Header from "@/components/Header";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import EventCard from "@/components/EventCard";
import { useState } from "react";

function dateFormat() {
  const now = new Date();
  let year = now.getFullYear();
  let month: string | number = now.getMonth() + 1;
  let day: string | number = now.getDate();
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  return `${year}-${month}-${day}`;
}

export default function Index() {
  const today = dateFormat(); 
  const {data: todayEvents, loading: todayLoading, error: todayError} = useFetch(() => fetchEvents(today));
  const {data: upcomingEvents, loading: upcomingLoading, error: upcomingError} = useFetch(() => fetchOtherEvents(today));

  // if (todayLoading || upcomingLoading) {
  //   return (
  //     <View className="bg-primary items-center justify-center">
  //       <ActivityIndicator size="large" color="#00BFFF" />
  //     </View>
  //   );
  // }

  // if (todayError || upcomingError) {
  //   console.log(todayError, upcomingError)
  //   return (
  //     <View className=" bg-primary items-center justify-center">
  //       <Text className="text-blue-400">Error loading events.</Text>
  //     </View>
  //   );
  // }

  return (
    <ScrollView className="bg-primary p-12">
      <Header />
      <Text className="text-white text-2xl font-extralight mt-10 mb-4">Good evening, Anjelica!</Text>
      <Text className="text-white font-RobotaThin text-xl mb-2"  style={{fontFamily: 'RobotaThin'}}>Today’s Events:</Text>
      {todayEvents && todayEvents.length > 0 ? (
        todayEvents.map((event, i) => (
          <View key={i} className="mb-3">
            <Text className="text-lg font-semibold text-white">{event.event_name}</Text>
            <Text className="text-sm text-gray-300">{event.date_display}</Text>
            <Text className="text-gray-400">{event.description}</Text> 
          </View>
        ))
      ) : (
        <Text className="text-gray-400">No events found for today.</Text>
      )}

      <Text className="text-white text-xl mt-6 mb-2">Upcoming Events:</Text>
      {upcomingEvents && upcomingEvents.length > 0 ? (
        upcomingEvents.map((event, i) => (
          <View key={i} className="mb-3">
            <Text className="text-lg font-semibold text-white">{event.event_name}</Text>
            <Text className="text-sm text-gray-300">{event.date_display}</Text>
          </View>
        ))
      ) : (
        <Text className="text-gray-400">No upcoming events.</Text>
      )}
    </ScrollView>
  );
}

