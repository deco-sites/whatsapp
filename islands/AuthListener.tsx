import { AuthChangeEvent } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { useAuthStateChange } from "../sdk/auth.tsx";
import { RETURN_URL_QUERY_PARAM } from "../utils/auth.ts";

export const DEFAULT_RETURN_URL = "/dashboard";

export default function AuthListener() {
  useAuthStateChange((event: AuthChangeEvent) => {
    if (event === "SIGNED_IN") {
      const query = new URLSearchParams(globalThis.window.location?.search);
      const returnUrl = query.get(RETURN_URL_QUERY_PARAM);

      globalThis.window.location.replace(
        returnUrl || DEFAULT_RETURN_URL,
      );
    } else if (event === "SIGNED_OUT") {
      globalThis.window.location.replace("/login");
    }
  });
  return <span></span>;
} 