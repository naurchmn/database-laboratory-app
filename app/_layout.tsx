import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && ready) {
      SplashScreen.hideAsync();
    }
  }, [loading, ready]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
