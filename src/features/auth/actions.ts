"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, clientEnv } from "@/lib/env";

const emailSchema = z.string().email();
const otpSchema = z.string().regex(/^\d{6}$/, "Enter the 6-digit code.");

export type AuthResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

const NOT_CONFIGURED =
  "Login is not available yet — Supabase isn't configured. See supabase/README.md.";

/**
 * Step 1: email a 6-digit OTP (and magic link). Creates the user if new.
 */
export async function requestOtp(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED };

  const parsed = emailSchema.safeParse(email.trim());
  if (!parsed.success) return { ok: false, error: "Enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${clientEnv.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, message: "We've emailed you a 6-digit code and a sign-in link." };
}

/**
 * Step 2: verify the OTP code. On success the session cookie is set and we
 * redirect into the portal.
 */
export async function verifyOtp(email: string, token: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED };

  const e = emailSchema.safeParse(email.trim());
  const t = otpSchema.safeParse(token.trim());
  if (!e.success || !t.success) {
    return { ok: false, error: "Check the email and 6-digit code." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: e.data,
    token: t.data,
    type: "email",
  });

  if (error) return { ok: false, error: error.message };
  redirect("/portal");
}

/** Sign the current user out and return to the homepage. */
export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
