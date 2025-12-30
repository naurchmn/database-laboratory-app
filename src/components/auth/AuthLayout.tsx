import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function AuthLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <LinearGradient
      colors={["#652EC7", "#DF3983", "#FFD300"]}
      start={{ x: 0, y: 0.1 }}
      end={{ x: 1, y: 0.1 }}
      style={styles.root}
    >
      <View style={styles.header}>
        {/* ✅ BACK BUTTON (BISA DIPENCET) */}
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={styles.backBtn}
          android_ripple={{ color: "rgba(255,255,255,0.2)", radius: 20 }}
        >
          <Text style={styles.arrow}>{"<"}</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/LogoBasdatShort.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.formWrap}>{children}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  header: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    position: "relative", // 🔑 penting buat absolute child
  },

  // 🔥 BACK BUTTON (LAYER PALING ATAS)
  backBtn: {
    position: "absolute",
    left: 24,          // ➜ ke kanan
    top: 42,           // ➜ ke atas
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 8,
    paddingHorizontal: 10,

    zIndex: 999,       // ✅ iOS
    elevation: 999,    // ✅ Android
  },

  // Panah <
  arrow: {
    color: "white",
    fontSize: 20,      // cukup gede
    fontWeight: "500",
    lineHeight: 22,
    marginRight: 2,
  },

  // Text Back (lebih kecil & rapi)
  backText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,      // optically sejajar panah
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
  },

  card: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 22,
    paddingTop: 22,
    alignItems: "center",
  },

  logo: {
    width: 180,
    height: 180,
    marginTop: 6,
    marginBottom: 4,
  },

  formWrap: {
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 10,
    paddingBottom: 24,
  },
});
