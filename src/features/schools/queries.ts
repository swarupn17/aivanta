import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { School } from "@/lib/db/schema";

/**
 * Row shapes as returned by supabase-js (snake_case columns) — distinct from the
 * Drizzle camelCase inferred types, which describe the query-builder API.
 */
export type LeadRowData = {
  id: string;
  applicant_role: string | null;
  applicant_name: string;
  applicant_email: string;
  applicant_mobile: string;
  school_name: string;
  school_address: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  school_email: string | null;
  school_phone: string | null;
  principal_name: string | null;
  principal_contact: string | null;
  status: string;
  created_at: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string | null;
  message: string;
  created_at: string;
};

/** True if the given role may approve requests / generate codes. */
export function canApprove(role?: string | null): boolean {
  return role === "admin" || role === "super_admin";
}

/**
 * Admin reads. These use the SESSION client, so RLS enforces admin-only access
 * (policies: *_admin_read). Non-admins get empty lists, never an error.
 */

export async function listRegistrationLeads(): Promise<LeadRowData[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("registration_leads")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as LeadRowData[]) ?? [];
}

export async function listContactMessages(): Promise<ContactMessageRow[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as ContactMessageRow[]) ?? [];
}

/** Fast head-count of pending requests (for the nav badge). */
export async function countPendingLeads(): Promise<number> {
  if (!isSupabaseConfigured) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from("registration_leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}

/** The school owned by the current user (after they've claimed a code), or null. */
export async function getMySchool(userId: string): Promise<School | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("schools")
    .select("*")
    .eq("owner_profile_id", userId)
    .maybeSingle();
  return (data as School) ?? null;
}
