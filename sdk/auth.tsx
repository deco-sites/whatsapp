import { AuthChangeEvent, Session } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { useEffect } from "preact/hooks";
import { getSupabaseClient } from "../clients/browserClient.ts";

export const useAuthStateChange = (
  callback: (
    event: AuthChangeEvent,
    session: Session | null,
    res?: Response,
  ) => void,
) => {
  useEffect(() => {
    const client = getSupabaseClient();
    let hasSignedOut = false;
    const { data: authListener } = client.auth.onAuthStateChange(
      (event, session) => {
        // This code is based on: https://supabase.com/docs/guides/auth/server-side-rendering
        if (event === "SIGNED_OUT") {
          if (!hasSignedOut) {
            hasSignedOut = true;
            signOut();
          }
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setTokensCookies(session?.access_token, session?.refresh_token);
          hasSignedOut = false;
        }

        callback(event, session);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [callback]);
};

export const setTokensCookies = (
  accessToken?: string,
  refreshToken?: string,
) => {
  const policy = globalThis.window.location.hostname === "localhost"
    ? "None"
    : "Lax";
  const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
  document.cookie =
    `whatsapp-access-token=${accessToken}; path=/; max-age=${maxAge}; SameSite=${policy}; secure`;
  document.cookie =
    `whatsapp-refresh-token=${refreshToken}; path=/; max-age=${maxAge}; SameSite=${policy}; secure`;
};

export function clearCookies() {
  const policy = globalThis.window.location.hostname === "localhost"
    ? "None"
    : "Lax";
  const expires = new Date(0).toUTCString();
  document.cookie =
    `whatsapp-access-token=; path=/; expires=${expires}; SameSite=${policy}; secure`;
  document.cookie =
    `whatsapp-refresh-token=; path=/; expires=${expires}; SameSite=${policy}; secure`;
}

export function signOut(redirectUrl: string = "/") {
  clearCookies();
  const client = getSupabaseClient();
  client.auth.signOut().then(() => {
    if (redirectUrl.startsWith("http")) {
      globalThis.window.open(redirectUrl, "_self");
    } else {
      globalThis.window.location.replace(redirectUrl);
    }
  }).catch((error) => {
    console.error("Sign out failed", error);
  });
} 