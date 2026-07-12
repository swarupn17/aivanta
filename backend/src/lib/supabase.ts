import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireSupabase, requireServiceRole } from "../env";

/**
 * Supabase clients for the Node API.
 *
 * THE KEY IDEA (why RLS still works after splitting off from Next):
 * We do NOT use the service-role key for user requests. Instead, each request
 * carries the caller's Supabase access token (JWT) in the Authorization header.
 * We build a per-request client that forwards that token to PostgREST, so the
 * database sees the real user and Row-Level Security enforces access exactly
 * like it did inside the Next server. Same security model, new transport.
 */

/**
 * Per-request, user-scoped client. The user's JWT is attached to every call,
 * so RLS applies. Use this for anything an authenticated user does.
 */
export function createUserClient(accessToken: string): SupabaseClient {
  const { url, anonKey } = requireSupabase();
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * ADMIN client — service-role key, BYPASSES RLS. Use ONLY for public writes
 * with no authenticated user (contact + registration leads). Never expose the
 * service-role key to the browser (that's the whole point of it living here).
 */
export function createAdminClient(): SupabaseClient {
  const { url, serviceRoleKey } = requireServiceRole();
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
