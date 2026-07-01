import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseEnv } from "@/lib/env";

/**
 * Supabase client for the SERVER (Server Components, Route Handlers, Server Actions).
 * Reads/writes the auth session via Next's cookie store so RLS knows who the user is.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = requireSupabaseEnv();

  return createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` was called from a Server Component — safe to ignore when
            // middleware is refreshing sessions (the standard Supabase pattern).
          }
        },
      },
    }
  );
}
