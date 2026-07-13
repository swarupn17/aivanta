import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { siteConfig } from "@/config/site";
import { listRegistrationLeads, type LeadRowData } from "./queries";
import { getAdminSchools } from "./admin";

/**
 * Aggregated numbers for the admin command-center dashboard. One place so the
 * dashboard stays a dumb renderer. Admin RLS lets the session client read all
 * students/enrolments, so the counts are global (head-counts, not row pulls).
 */
export type AdminStats = {
  leads: { pending: number; approved: number; rejected: number; total: number };
  schools: { total: number; approved: number };
  students: number;
  enrolments: { total: number; paid: number };
  revenue: { collectedRupees: number; estimatedRupees: number; perSubject: number };
  recentPending: LeadRowData[];
};

const EMPTY: AdminStats = {
  leads: { pending: 0, approved: 0, rejected: 0, total: 0 },
  schools: { total: 0, approved: 0 },
  students: 0,
  enrolments: { total: 0, paid: 0 },
  revenue: { collectedRupees: 0, estimatedRupees: 0, perSubject: siteConfig.fees.perSubject },
  recentPending: [],
};

export async function getAdminStats(): Promise<AdminStats> {
  const perSubject = siteConfig.fees.perSubject;
  if (!isSupabaseConfigured) return EMPTY;

  const supabase = await createClient();
  const [leads, schools, totalEnr, paidEnr] = await Promise.all([
    listRegistrationLeads(),
    getAdminSchools(),
    supabase.from("enrollments").select("*", { count: "exact", head: true }),
    supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "paid"),
  ]);

  const byStatus = (s: string) => leads.filter((l) => l.status === s).length;
  const totalEnrolments = totalEnr.count ?? 0;
  const paidEnrolments = paidEnr.count ?? 0;

  return {
    leads: {
      pending: byStatus("pending"),
      approved: byStatus("approved"),
      rejected: byStatus("rejected"),
      total: leads.length,
    },
    schools: {
      total: schools.length,
      approved: schools.filter((s) => s.status === "approved").length,
    },
    students: schools.reduce((n, s) => n + s.students, 0),
    enrolments: { total: totalEnrolments, paid: paidEnrolments },
    revenue: {
      collectedRupees: paidEnrolments * perSubject,
      estimatedRupees: totalEnrolments * perSubject,
      perSubject,
    },
    recentPending: leads.filter((l) => l.status === "pending").slice(0, 5),
  };
}

/**
 * Map for retrieving an approved lead's assigned school code WITHOUT a schema
 * change. `approveLead` creates the school with name = school_name and
 * contact_email = school_email || applicant_email, so we key on both.
 * Returns { "name|email": code }.
 */
export async function getLeadCodeIndex(): Promise<Record<string, string>> {
  if (!isSupabaseConfigured) return {};
  const supabase = await createClient();
  const { data } = await supabase
    .from("schools")
    .select("name, contact_email, school_code");

  const idx: Record<string, string> = {};
  const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();
  for (const s of (data ?? []) as {
    name: string;
    contact_email: string | null;
    school_code: string | null;
  }[]) {
    if (!s.school_code) continue;
    idx[`${norm(s.name)}|${norm(s.contact_email)}`] = s.school_code;
    // Fallback key on name alone, so a slightly different email still resolves.
    idx[norm(s.name)] = s.school_code;
  }
  return idx;
}

/** Look up a lead's code in the index built above. */
export function codeForLead(
  index: Record<string, string>,
  lead: Pick<LeadRowData, "school_name" | "school_email" | "applicant_email">
): string | null {
  const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();
  const email = norm(lead.school_email) || norm(lead.applicant_email);
  return (
    index[`${norm(lead.school_name)}|${email}`] ??
    index[norm(lead.school_name)] ??
    null
  );
}
