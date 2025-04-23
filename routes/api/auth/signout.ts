import { Handlers } from "$fresh/server.ts";
import { getSupabaseClient } from "../../../clients/browserClient.ts";
import { clearCookies } from "../../../sdk/auth.tsx";

export const handler: Handlers = {
  async POST(req) {
    const client = getSupabaseClient();
    await client.auth.signOut();
    
    // Also clear cookies directly in case we're on the server side
    if (typeof document !== "undefined") {
      clearCookies();
    }
    
    // Redirect to login page after signout
    const headers = new Headers();
    headers.set("location", "/login");
    return new Response(null, {
      status: 302,
      headers,
    });
  },
}; 