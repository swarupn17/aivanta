import { z } from "zod";

/**
 * Centralised, validated environment variables.
 *
 * Design goal: the marketing site must run with ZERO config (before Supabase is
 * set up). So Supabase vars are OPTIONAL here — we expose `isSupabaseConfigured`
 * and let auth/DB code no-op until real values are present. Once you add them to
 * `.env.local`, auth + DB light up automatically.
 *
 * NOTE: `NEXT_PUBLIC_*` vars are inlined by Next at build time and safe for the
 * browser. Server-only secrets must NEVER be prefixed with NEXT_PUBLIC_.
 */

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

/** True once both public Supabase vars are present. Gate auth/DB code on this. */
export const isSupabaseConfigured =
  !!clientEnv.NEXT_PUBLIC_SUPABASE_URL && !!clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Assert Supabase is configured, returning the non-optional values.
 * Call inside code paths that genuinely need Supabase (auth, portal, DB).
 */
export function requireSupabaseEnv() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (see .env.example)."
    );
  }
  return {
    url: clientEnv.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().url().optional(),
});

/** Server-only env. Parsed lazily so client bundles never touch it. */
export function serverEnv() {
  return serverSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  });
}

const emailSchema = z.object({
  // Resend API key (server-only). Get it from resend.com → API Keys.
  RESEND_API_KEY: z.string().min(1).optional(),
  // Verified sender, e.g. `Aivanta Scholar Foundation <noreply@aivanta.in>`.
  EMAIL_FROM: z.string().min(1).optional(),
  // Where new-registration alerts go. Falls back to siteConfig.contact.email.
  ADMIN_NOTIFICATION_EMAIL: z.string().email().optional(),
});

/** Server-only email (Resend) env. Parsed lazily. */
export function emailEnv() {
  return emailSchema.parse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
  });
}
