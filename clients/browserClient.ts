import { Database } from "./types.ts";
import * as supabase from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { IS_BROWSER } from "$fresh/runtime.ts";

// Get the values directly from environment variables
export const SUPABASE_URL = typeof Deno !== "undefined"
  ? Deno.env.get("SUPABASE_URL") ?? ""
  : "";
  
export const SUPABASE_ANON_KEY = typeof Deno !== "undefined"
  ? Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  : "";

// Store the client instance to reuse
let client: supabase.SupabaseClient;

// Helper to get all cookies as an object
export const getAllCookies = <T extends Record<string, string>>() =>
  document.cookie.split(";").reduce(
    (ac, str) =>
      Object.assign(ac, { [str.split("=")[0].trim()]: str.split("=")[1] }),
    {} as T,
  );

/**
 * Get a Supabase client for browser usage
 * @param accessToken Optional access token to override the default anon key
 */
export function getSupabaseClient(accessToken?: string) {
  if (!client) {
    client = supabase.createClient<Database>(
      SUPABASE_URL,
      accessToken || SUPABASE_ANON_KEY,
      {
        auth: { autoRefreshToken: false },
      },
    );
  }
  return client;
}

/**
 * Set the Supabase session from cookies if available
 */
export async function setSessionFromCookies(client: supabase.SupabaseClient) {
  if (IS_BROWSER) {
    const {
      "whatsapp-access-token": access_token,
      "whatsapp-refresh-token": refresh_token,
    } = getAllCookies<
      { "whatsapp-access-token"?: string; "whatsapp-refresh-token"?: string }
    >();

    if (access_token && refresh_token) {
      return await client.auth.setSession({
        access_token,
        refresh_token,
      });
    }
  }
} 