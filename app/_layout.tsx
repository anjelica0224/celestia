import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export const AppContext = {
  hideSplash: () => {},
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  AppContext.hideSplash = () => {
    SplashScreen.hideAsync();
    setShowSplash(false);
  };

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="event" />
      </Stack>
      {showSplash && (
        <View style={styles.splash} pointerEvents="none">
          <Image
            source={require("../assets/images/splash.png")}
            style={styles.splashImage}
            resizeMode="cover"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    backgroundColor: "#000000",
  },
  splashImage: {
    width: "100%",
    height: "100%",
  },
});
