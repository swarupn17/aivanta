import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { Profile } from "@/lib/db/schema";

export type SessionUser = {
  id: string;
  email: string | null;
  profile: Profile | null;
};

/**
 * Returns the current authenticated user + their profile row, or null.
 * Server-only. Safe to call when Supabase isn't configured (returns null).
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    profile: (profile as Profile) ?? null,
  };
}
