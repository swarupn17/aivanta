import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { userRole } from "./enums";

/**
 * `profiles` — one row per authenticated user, keyed to Supabase `auth.users.id`.
 *
 * Supabase Auth owns the `auth.users` table (email/phone, OTP, sessions).
 * This app-owned table stores the ROLE and profile data we control, and is the
 * table RLS policies join against to enforce access. Create the row via a
 * Postgres trigger on `auth.users` insert (see /drizzle or Supabase SQL editor).
 */
export const profiles = pgTable("profiles", {
  // Matches auth.users.id 1:1 (no FK here since auth schema is Supabase-managed).
  id: uuid("id").primaryKey(),
  role: userRole("role").notNull().default("student"),
  fullName: text("full_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
