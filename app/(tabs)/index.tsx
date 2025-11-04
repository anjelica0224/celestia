import { useFetch } from "@/services/usefetch";
'use client'
import { fetchEvents, fetchImages, fetchOtherEvents } from "@/services/api";
import { Text, Image, ScrollView, View, ActivityIndicator, FlatList } from "react-native";
import Header from "@/components/Header";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import EventCard from "@/components/EventCard";
import { useEffect, useState } from "react";
import { images } from "@/constants/images";
import HorizontalTransaction from "@/components/HorizontalTransaction";
import { CONFIG } from "@/constants/keys";
import Carousel from 'react-native-reanimated-carousel';

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

  const renderEventItem = ({item}: {item: Events}) => {
    return <EventCard event={item} />;
  };



  return (
    <View className="bg-primary w-full h-full">
      <Image source={images.bg} className="w-full z-0 absolute"/>
      <ScrollView className="p-12">
        <Header />
        <Text className="text-white text-2xl font-extralight mt-10 mb-4">Good evening, Anjelica!</Text>
        {/* <Text className="text-white font-RobotaThin text-xl mb-2"  style={{fontFamily: 'RobotaThin'}}>Today’s Events:</Text> */}
        
        {todayEvents && todayEvents.length > 0 ? (
          todayEvents.map((event, i) => (
            <Carousel
              loop={false}
              width={280} // Account for padding
              height={320}
              data={todayEvents}
              scrollAnimationDuration={1000}
              onSnapToItem={(index: number) => console.log('Today event:', index)}
              renderItem={renderEventItem}
            />
          ))
        ) : (
          <Text className="text-gray-400">No events found for today.</Text>
        )}

        {/* <Text className="text-white text-xl mt-6 mb-2">Upcoming Events:</Text>
        {upcomingEvents && upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, i) => (
          //  <Carousel
          //     loop={false}
          //     width={280}
          //     height={320}
          //     data={upcomingEvents}
          //     scrollAnimationDuration={1000}
          //     autoPlay={true}
          //     autoPlayInterval={5000}
          //     onSnapToItem={(index: number) => console.log('Upcoming event:', index)}
          //     renderItem={EventCard({ event, onPress: () => {} })}
          //   />
          )
          )
        ) : (
          <Text className="text-gray-400">No upcoming events.</Text>
        )} */}
      </ScrollView>
    </View>
  );
}

