import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { auth } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useGoogleLogin } from "../../lib/googleAuth";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const isRegister = mode === "register";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signInWithGoogle } = useGoogleLogin();

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

  async function onGoogle() {
    setError(null);
    setGoogleBusy(true);
    try {
      const res = await signInWithGoogle();
      if (res.ok) router.replace("/(tabs)");
      else setError(res.error ?? "Google sign-in failed");
    } catch (e: any) {
      setError(e?.message ?? "Google sign-in failed");
    } finally {
      setGoogleBusy(false);
    }
  }

  return (
    <View style={{ gap: 14 }}>
      {isRegister && (
        <TextInput
          placeholder="Full name"
          placeholderTextColor="#9A9A9A"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
          autoCapitalize="words"
        />
      )}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#9A9A9A"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#9A9A9A"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
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
            <ActivityIndicator />
          ) : (
            <Text style={styles.primaryText}>
              {isRegister ? "Sign Up" : "Login"}
            </Text>
          )}
        </LinearGradient>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Sign in with</Text>
        <View style={styles.divider} />
      </View>

      <Pressable
        onPress={onGoogle}
        disabled={googleBusy}
        style={[styles.googleBtn, { opacity: googleBusy ? 0.6 : 1 }]}
      >
        {googleBusy ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.googleText}>G</Text>
        )}
      </Pressable>

      <Text style={styles.bottomText}>
        {isRegister ? "Already have an account? " : "Don’t have an account? "}
        <Link
          href={isRegister ? "/(auth)/login" : "/(auth)/register"}
          style={styles.link}
        >
          {isRegister ? "Sign In" : "Sign Up"}
        </Link>
      </Text>
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#D0D0D0" },
  dividerText: { color: "#757575", fontSize: 12, fontWeight: "600" },
  googleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  googleText: { fontSize: 18, fontWeight: "800" },
  bottomText: { textAlign: "center", color: "#666", marginTop: 4 },
  link: { fontWeight: "800" },
});
