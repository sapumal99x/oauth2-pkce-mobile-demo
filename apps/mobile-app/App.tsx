import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, View } from "react-native";
import { generateCodeChallenge, generateCodeVerifier } from "./src/pkce";

const SERVER_BASE_URL = process.env.EXPO_PUBLIC_AUTH_SERVER_URL ?? "http://localhost:3000";
const CLIENT_ID = "mobile-demo-client";

type Screen = "login" | "dashboard";

type TokenResponse = {
  access_token: string;
  token_type: string;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const redirectUri = useMemo(() => AuthSession.makeRedirectUri({ scheme: "myapp", path: "callback" }), []);

  /**
   * Exchanges authorization code for a token.
   * Input: one-time authorization code and original PKCE verifier.
   * Output: token payload from /api/token.
   */
  async function exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await fetch(`${SERVER_BASE_URL}/api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload.error ?? "Token exchange failed");
    }

    return (await response.json()) as TokenResponse;
  }

  /**
   * Starts browser login, handles deep-link callback, and stores access token.
   * Input: none (uses local PKCE and app config values).
   * Output: updates UI state to dashboard when login succeeds.
   */
  async function handleLogin() {
    try {
      setLoading(true);
      console.log("Starting OAuth2 PKCE login flow", { server: SERVER_BASE_URL });
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      const authUrl =
        `${SERVER_BASE_URL}/login?` +
        new URLSearchParams({
          client_id: CLIENT_ID,
          redirect_uri: redirectUri,
          code_challenge: codeChallenge,
        }).toString();

      // Open browser login and wait for deep-link callback to myapp://callback.
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      if (result.type !== "success") {
        throw new Error("Login canceled or did not complete");
      }

      // Parse deep-link callback URL and extract authorization code.
      const callbackUrl = new URL(result.url);
      const code = callbackUrl.searchParams.get("code");
      if (!code) {
        throw new Error("Authorization code missing from callback");
      }
      console.log("Authorization code received in mobile callback", { code });

      const token = await exchangeCodeForToken(code, codeVerifier);
      await SecureStore.setItemAsync("access_token", token.access_token);
      console.log("Access token stored in SecureStore");
      setAccessToken(token.access_token);
      setScreen("dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected login error";
      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Clears stored token and returns user to login screen.
   * Input: none.
   * Output: reset of auth-related local state.
   */
  async function handleLogout() {
    await SecureStore.deleteItemAsync("access_token");
    setAccessToken(null);
    setScreen("login");
  }

  return (
    <View style={styles.container}>
      {screen === "login" ? (
        <View style={styles.card}>
          <Text style={styles.title}>OAuth2 PKCE Mobile Demo</Text>
          <Text style={styles.text}>
            Tap login to open the browser, sign in on the Next.js page, and return via deep link.
          </Text>
          {loading ? <ActivityIndicator size="large" /> : <Button title="Login with OAuth2 PKCE" onPress={handleLogin} />}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.text}>Login succeeded. Access token is stored in SecureStore.</Text>
          <Text style={styles.token}>{accessToken}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  token: {
    fontFamily: "Courier",
    fontSize: 13,
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
  },
});
