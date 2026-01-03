import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../../lib/firebase";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const isRegister = mode === "register";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password) return false;
    if (isRegister && !fullName.trim()) return false;
    return true;
  }, [email, password, fullName, isRegister]);

  async function onSubmit() {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);

    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        if (fullName.trim()) {
          await updateProfile(cred.user, { displayName: fullName.trim() });
        }
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }

      router.replace("/(tabs)");
    } catch (e: any) {
      setError(mapFirebaseError(e?.code) ?? e?.message ?? "Auth failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ gap: 14 }}>
      {isRegister && (
        <TextInput
          testID="auth-full-name"
          placeholder="Full name"
          placeholderTextColor="#9A9A9A"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          autoCapitalize="words"
        />
      )}

      <TextInput
        testID="auth-email"
        placeholder="Email"
        placeholderTextColor="#9A9A9A"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        testID="auth-password"
        placeholder="Password"
        placeholderTextColor="#9A9A9A"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {error ? (
        <Text testID="auth-error" style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Pressable
        testID="auth-submit"
        disabled={!canSubmit || busy}
        onPress={onSubmit}
        style={{ opacity: !canSubmit || busy ? 0.6 : 1 }}
      >
        <LinearGradient
          colors={["#652EC7", "#DF3983", "#FFD300"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.primaryBtn}
        >
          {busy ? (
            <ActivityIndicator testID="auth-busy" />
          ) : (
            <Text style={styles.primaryText}>
              {isRegister ? "Sign Up" : "Login"}
            </Text>
          )}
        </LinearGradient>
      </Pressable>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>
          {isRegister
            ? "Already have an account? "
            : "Don’t have an account? "}
        </Text>
        <Pressable
          testID={isRegister ? "auth-switch-to-login" : "auth-switch-to-register"}
          onPress={() =>
            router.push(isRegister ? "/(auth)/login" : "/(auth)/register")
          }
        >
          <Text style={[styles.bottomText, styles.link]}>
            {isRegister ? "Sign In" : "Sign Up"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function mapFirebaseError(code?: string) {
  switch (code) {
    case "auth/invalid-email":
      return "Email tidak valid.";
    case "auth/user-not-found":
      return "User tidak ditemukan.";
    case "auth/wrong-password":
      return "Password salah.";
    case "auth/email-already-in-use":
      return "Email sudah terdaftar.";
    case "auth/weak-password":
      return "Password terlalu lemah (min 6 karakter).";
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    paddingHorizontal: 12,
    color: "#111",
    backgroundColor: "#FFF",
  },
  error: { color: "#D11", fontWeight: "600" },
  primaryBtn: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { color: "white", fontWeight: "700", fontSize: 16 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  bottomText: { textAlign: "center", color: "#666" },
  link: { fontWeight: "800" },
});
