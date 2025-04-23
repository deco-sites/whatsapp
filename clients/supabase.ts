import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Database } from "./types.ts";
import { importSecret } from "../utils/jwt.ts";

// Get the values directly from environment variables
export const SUPABASE_URL = typeof Deno !== "undefined"
  ? Deno.env.get("SUPABASE_URL") ?? ""
  : "";
  
export const SUPABASE_ANON_KEY = typeof Deno !== "undefined"
  ? Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  : "";

// For service role operations
const serviceToken = Deno.env.get("SUPABASE_SERVICE_KEY") ?? SUPABASE_ANON_KEY;

export { getSupabaseClient } from "./browserClient.ts";

export const customFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const url = typeof input === "string" ? input : (input as Request)?.url;
  const fetchResponse = fetch(input, init);
  if (url.includes("storage")) {
    return fetchResponse;
  }
  return fetchResponse.finally(() => { });
};

/**
 * This supabase client should be used in the server only.
 * This method creates a supabase client that doesn't persist session, doesn't auto refresh token and detect session in URL.
 */
export function getSupabaseClientForServer() {
  const client = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      global: { fetch: customFetch },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  return client;
}

// Create a client with service role token for admin operations
export const supabaseClientWithServerToken = createClient<Database>(
  SUPABASE_URL,
  serviceToken,
);

let supabaseJWTCryptoKey: Promise<CryptoKey> | null = null;

// Create a JWT for impersonating users
export const createJWT = async (
  userId: string,
  userClaims: Record<string, any> = {},
) => {
  const supabaseJWTSecret = Deno.env.get("SUPABASE_JWT_SECRET");
  if (!supabaseJWTSecret) {
    throw new Error("supabaseJWTSecret is required to use impersonated users");
  }
  supabaseJWTCryptoKey ??= importSecret(supabaseJWTSecret);
  const now = Math.floor(Date.now() / 1000);

  const TEN_MINUTES_DURATION = 600;
  const claims = {
    iat: now,
    exp: now + TEN_MINUTES_DURATION,
    sub: userId,
    ...userClaims,
  };
  
  // Import the create function from your JWT library
  const { create } = await import("https://deno.land/x/djwt@v2.8/mod.ts");
  
  const jwt = await create(
    { alg: "HS256", typ: "JWT" },
    claims,
    await supabaseJWTCryptoKey,
  );

  return jwt;
};

// Impersonate a user for admin operations
export const impersonateUser = async (userId: string) => {
  const jwt = await createJWT(userId);

  const impersonatedClient = createClient<Database>(
    SUPABASE_URL,
    serviceToken,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } },
  );
  return impersonatedClient;
}; 