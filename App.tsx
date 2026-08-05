import "./global.css";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import Navigation from "./src/navigation";
import { useAuthStore } from "./src/store";


SplashScreen.preventAutoHideAsync();

export default function App() {
  const { initializeFromStorage } = useAuthStore();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    initializeFromStorage();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View className="flex-1 bg-background" onLayout={onLayoutRootView}>
      <Navigation />
    </View>
  );
}