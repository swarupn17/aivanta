import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnv } from "@/lib/env";
import * as schema from "@/lib/db/schema";

/**
 * Drizzle DB client for SERVER-SIDE queries that need typed SQL beyond what the
 * Supabase client offers (joins, aggregates, migrations-backed schema).
 *
 * Auth/storage/realtime → use the Supabase client.
 * Heavy typed queries & migrations → use this Drizzle client.
 *
 * Lazily instantiated so importing this module never crashes client bundles
 * or builds where DATABASE_URL isn't set.
 */
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;

  const { DATABASE_URL } = serverEnv();
  if (!DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local (Supabase → Database → Connection string)."
    );
  }

  // `prepare: false` is required for Supabase's transaction pooler (pgBouncer).
  const client = postgres(DATABASE_URL, { prepare: false });
  _db = drizzle(client, { schema });
  return _db;
}
