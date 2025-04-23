import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { getSupabaseClient } from "../clients/browserClient.ts";
import { redirectUserToLogin } from "../utils/auth.ts";

interface State {
  accessToken?: string;
}

// Add routes that should be protected by authentication here
const PROTECTED_ROUTES = [
  "/dashboard",
  "/clients",
];

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  // Allow the login route to be accessible without authentication
  const { pathname } = new URL(req.url);
  
  // Check if the requested page is in the protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return ctx.next();
  }

  // Check for user session on protected routes
  const client = getSupabaseClient();
  const { data: { session } } = await client.auth.getSession();

  if (!session) {
    return new Response(null, redirectUserToLogin(req));
  }

  // User is authenticated, continue to protected route
  return ctx.next();
} 