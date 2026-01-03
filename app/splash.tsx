import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAuth } from "../src/hooks/useAuth";

export default function Splash() {
  const { user, loading } = useAuth();
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinDelayDone(true), 1700);
    return () => clearTimeout(t);
  }, []);

  if (minDelayDone && !loading) {
    return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.root} testID="splash-root">
      <Image
        source={require("../src/assets/images/LogoBasdat.png")}
        style={styles.logo}
        testID="splash-logo"
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 220,
    height: 220,
  },
});
