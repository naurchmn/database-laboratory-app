import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID =
  "328211649729-labn29ppved0t2u95brg8rlbstnaj1mm.apps.googleusercontent.com";

// harus sama persis dengan redirect di Google Console:
// https://auth.expo.dev/@nona-project/DatabaseLaboratory
const EXPO_PROXY_PROJECT = "@nona-project/DatabaseLaboratory";

export function useGoogleLogin() {
  console.log("App ownership:", Constants.appOwnership);

  // Selalu gunakan Expo auth proxy untuk semua environment
  // Ini yang sudah terdaftar di Google Console
  const redirectUri = `https://auth.expo.dev/${EXPO_PROXY_PROJECT}`;

  console.log("Redirect URI:", redirectUri);

  const googleConfig = {
    clientId: WEB_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
    redirectUri,
    responseType: AuthSession.ResponseType.IdToken,
  };

  const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);

  async function signInWithGoogle() {
    console.log("AuthSession redirectUri variable:", redirectUri);
    console.log("AuthRequest redirectUri in request:", request?.redirectUri);

    const res = await promptAsync();

    if (res.type !== "success") {
      return { ok: false as const, reason: res.type };
    }

    // sekarang aman akses params karena udah success
    const idToken = res.params.id_token;

    if (!idToken) {
      console.log("Redirect URI used:", redirectUri);
      console.log("Auth params:", res.params);
      throw new Error("No id_token returned from Google");
    }

    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);

    return { ok: true as const };
  }

  return { request, response, signInWithGoogle };
}
