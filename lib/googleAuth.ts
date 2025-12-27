import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

WebBrowser.maybeCompleteAuthSession();

// Isi ini dari Google Cloud Console
const ANDROID_CLIENT_ID = "328211649729-rpq58joquvkfligkaa9o4v5h62lps41q.apps.googleusercontent.com";
const WEB_CLIENT_ID = "328211649729-labn29ppved0t2u95brg8rlbstnaj1mm.apps.googleusercontent.com";

export function useGoogleLogin() {
  const redirectUri = makeRedirectUri({ scheme: "databaselaboratory" });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    redirectUri,
    scopes: ["profile", "email"],
  });

  async function maybeSignInWithGoogle() {
    if (response?.type !== "success") return;

    const { id_token } = response.params as any;
    if (!id_token) throw new Error("No id_token returned from Google");

    const credential = GoogleAuthProvider.credential(id_token);
    await signInWithCredential(auth, credential);
  }

  return { request, response, promptAsync, maybeSignInWithGoogle };
}
