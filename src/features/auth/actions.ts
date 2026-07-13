"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { linkSchoolByCodeEmail } from "@/features/schools/link";
import { isSupabaseConfigured } from "@/lib/env";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8, "Password must be at least 8 characters.");
const codeSchema = z.string().regex(/^\d{5}$/, "Enter your 5-digit school code.");
const otpSchema = z.string().regex(/^\d{6}$/, "Enter the 6-digit code from your email.");

export type AuthResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

const NOT_CONFIGURED =
  "Login is not available yet — Supabase isn't configured. See supabase/README.md.";

/** Best-effort readable message from any thrown value (never yields "{}"). */
function errMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err) return err;
  return "Something went wrong. Please try again.";
}

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

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: e.data,
      password,
    });
    if (error) return { ok: false, error: error.message };
  } catch (err) {
    console.error("[signInWithPassword] unexpected", err);
    return { ok: false, error: errMessage(err) };
  }
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

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: e.data,
      password: p.data,
      options: { data: { full_name: fullName?.trim() || undefined } },
    });
    if (error) return { ok: false, error: error.message };
    if (!data.session) {
      return {
        ok: true,
        message: "Account created. Please check your email to confirm, then sign in.",
      };
    }
  } catch (err) {
    console.error("[signUpWithPassword] unexpected", err);
    return { ok: false, error: errMessage(err) };
  }
  redirect("/portal");
}

/**
 * SCHOOL OTP LOGIN, step 1: verify the school code + email match an approved
 * school, then send a 6-digit one-time code to that email. No password.
 *
 * We check the pairing with the service-role client (RLS blocks anon reads of
 * `schools`). `shouldCreateUser: true` lets Supabase create the auth user on
 * first login — safe, because we only get here after the code+email check.
 */
export async function requestSchoolOtp(
  code: string,
  email: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED };

  const c = codeSchema.safeParse(code.trim());
  const e = emailSchema.safeParse(email.trim());
  if (!c.success) return { ok: false, error: "Enter your 5-digit school code." };
  if (!e.success) return { ok: false, error: "Enter a valid email address." };

  const cleanEmail = e.data.toLowerCase();

  try {
    // Verify the code + email belong to an approved school before sending an OTP.
    const admin = createAdminClient();
    const { data: school, error: schoolErr } = await admin
      .from("schools")
      .select("contact_email, status")
      .eq("school_code", c.data)
      .eq("status", "approved")
      .maybeSingle();
    if (schoolErr) {
      console.error("[requestSchoolOtp] school lookup failed", schoolErr);
      return { ok: false, error: schoolErr.message };
    }

    if (!school || (school.contact_email ?? "").toLowerCase() !== cleanEmail) {
      return {
        ok: false,
        error: "That school code and email don't match an approved school.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: true },
    });
    if (error) {
      console.error("[requestSchoolOtp] signInWithOtp failed", error);
      return { ok: false, error: error.message };
    }
  } catch (err) {
    console.error("[requestSchoolOtp] unexpected", err);
    return { ok: false, error: errMessage(err) };
  }

  return { ok: true, message: `We've emailed a 6-digit code to ${cleanEmail}.` };
}

/**
 * SCHOOL OTP LOGIN, step 2: verify the 6-digit code. On success the session
 * cookie is set; we then link the account to the school (code+email re-checked)
 * and redirect into the portal.
 */
export async function verifySchoolOtp(
  code: string,
  email: string,
  token: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED };

  const c = codeSchema.safeParse(code.trim());
  const e = emailSchema.safeParse(email.trim());
  const t = otpSchema.safeParse(token.trim());
  if (!c.success) return { ok: false, error: "Enter your 5-digit school code." };
  if (!e.success) return { ok: false, error: "Enter a valid email address." };
  if (!t.success) return { ok: false, error: "Enter the 6-digit code from your email." };

  const cleanEmail = e.data.toLowerCase();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: t.data,
      type: "email",
    });
    if (error || !data.user) {
      return { ok: false, error: error?.message ?? "That code is invalid or expired." };
    }

    // Session is now set. Bind the account to its school (elevates role).
    const linked = await linkSchoolByCodeEmail(c.data, data.user.id, cleanEmail);
    if (!linked.ok) {
      // Don't leave a half-authenticated session dangling on a linking failure.
      await supabase.auth.signOut();
      return { ok: false, error: linked.error };
    }
  } catch (err) {
    console.error("[verifySchoolOtp] unexpected", err);
    return { ok: false, error: errMessage(err) };
  }

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
