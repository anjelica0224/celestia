import { Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get("screen");

export const AppContext = {
  hideSplash: () => {},
};

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  AppContext.hideSplash = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    setAppReady(true);
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) return null;

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="event" />
      </Stack>

      {showSplash && (
        <View style={styles.splash}>
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
  container: { flex: 1 },
  splash: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 999,
    backgroundColor: "#000000",
  },
  splashImage: {
    width: "100%",
    height: "100%",
  },
});