import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseEnv, serverEnv } from "@/lib/env";

/**
 * ADMIN Supabase client — uses the service_role key and BYPASSES Row-Level
 * Security. Server-only. Use sparingly for privileged operations that have no
 * authenticated user (e.g. capturing public form leads, admin batch jobs).
 *
 * NEVER import this into a Client Component.
 */
export function createAdminClient() {
  const { url } = requireSupabaseEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = serverEnv();
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (server-only)."
    );
  }
  return createSupabaseClient(url, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
