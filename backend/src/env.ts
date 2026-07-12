import { config as loadEnv } from "dotenv";
import { z } from "zod";

// Load backend/.env before we read anything.
loadEnv();

/**
 * Centralised, validated backend environment.
 *
 * Mirrors the frontend's philosophy: Supabase vars are OPTIONAL so the API can
 * boot for smoke-testing even before Supabase is wired up. Endpoints that truly
 * need Supabase call `requireSupabase()` and fail loudly if it's missing.
 */
const schema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  ACADEMIC_YEAR: z.string().default("2025-26"),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
});

export const env = schema.parse(process.env);

/** Origins allowed by CORS. "*" (any) is supported for local dev. */
export const corsOrigins = env.CORS_ORIGIN.split(",")
  .map((o) => o.trim())
  .filter(Boolean);

/** True once the public Supabase pair is present. Gate auth/DB code on this. */
export const isSupabaseConfigured =
  !!env.SUPABASE_URL && !!env.SUPABASE_ANON_KEY;

/** Assert the public Supabase pair, returning non-optional values. */
export function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env."
    );
  }
  return { url: env.SUPABASE_URL!, anonKey: env.SUPABASE_ANON_KEY! };
}

/** Assert the service-role key (needed for public form leads). */
export function requireServiceRole() {
  const { url } = requireSupabase();
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set in backend/.env (server-only)."
    );
  }
  return { url, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY };
}
