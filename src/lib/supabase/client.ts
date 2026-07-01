import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "@/lib/env";

/**
 * Supabase client for the BROWSER (Client Components).
 * Uses the public anon key; all access is constrained by Row-Level Security.
 */
export function createClient() {
  const { url, anonKey } = requireSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
