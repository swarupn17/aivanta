"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8, "Password must be at least 8 characters.");

export type AuthResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

const NOT_CONFIGURED =
  "Login is not available yet — Supabase isn't configured. See supabase/README.md.";

/**
 * Sign in with email + password. On success the session cookie is set and we
 * redirect into the portal.
 */
export async function signInWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED };

  const e = emailSchema.safeParse(email.trim());
  if (!e.success) return { ok: false, error: "Enter a valid email address." };
  if (!password) return { ok: false, error: "Enter your password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: e.data,
    password,
  });
  if (error) return { ok: false, error: error.message };
  redirect("/portal");
}

/**
 * Create an account with email + password.
 * If "Confirm email" is OFF in Supabase, a session is created immediately and we
 * redirect. If it's ON, we ask the user to confirm via email.
 */
export async function signUpWithPassword(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED };

  const e = emailSchema.safeParse(email.trim());
  const p = passwordSchema.safeParse(password);
  if (!e.success) return { ok: false, error: "Enter a valid email address." };
  if (!p.success)
    return {
      ok: false,
      error: p.error.issues[0]?.message ?? "Password must be at least 8 characters.",
    };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: e.data,
    password: p.data,
    options: { data: { full_name: fullName?.trim() || undefined } },
  });
  if (error) return { ok: false, error: error.message };

  if (data.session) {
    redirect("/portal");
  }
  return {
    ok: true,
    message: "Account created. Please check your email to confirm, then sign in.",
  };
}

/** Sign the current user out and return to the homepage. */
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
