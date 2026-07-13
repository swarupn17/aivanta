"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/features/auth/queries";
import { canApprove } from "./queries";

export type ActionResult =
  | { ok: true; message: string; code?: string }
  | { ok: false; error: string };

/**
 * ADMIN: approve a registration request. Creates the school (auto-filled from
 * the request, status 'approved'); the DB assigns a unique, incremental 5-digit
 * `school_code` via the `next_school_code()` default. Marks the lead approved
 * and returns the code to hand to the school.
 */
export async function approveLead(leadId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!canApprove(user?.profile?.role)) {
    return { ok: false, error: "Not authorised." };
  }

  const admin = createAdminClient();

  const { data: lead, error: leadErr } = await admin
    .from("registration_leads")
    .select("*")
    .eq("id", leadId)
    .single();
  if (leadErr || !lead) return { ok: false, error: "Request not found." };
  if (lead.status === "approved") {
    return { ok: false, error: "This request is already approved." };
  }

  // Omit school_code so the DB default (next_school_code()) assigns it, then
  // read it back to display to the admin.
  const { data: created, error: insErr } = await admin
    .from("schools")
    .insert({
      name: lead.school_name,
      contact_person: lead.principal_name || lead.applicant_name,
      contact_phone: lead.school_phone || lead.applicant_mobile,
      contact_email: lead.school_email || lead.applicant_email,
      address_line: lead.school_address ?? null,
      city: lead.city ?? null,
      district: lead.district ?? null,
      state: lead.state ?? null,
      country: lead.country ?? null,
      pincode: lead.pincode ?? null,
      status: "approved",
    })
    .select("school_code")
    .single();
  if (insErr || !created) {
    return { ok: false, error: insErr?.message ?? "Could not create the school." };
  }
  const code = created.school_code as string;

  await admin
    .from("registration_leads")
    .update({ status: "approved" })
    .eq("id", leadId);

  revalidatePath("/portal/leads");
  return { ok: true, message: `Approved. School code: ${code}`, code };
}

/** ADMIN: reject a registration request. */
export async function rejectLead(leadId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!canApprove(user?.profile?.role)) {
    return { ok: false, error: "Not authorised." };
  }
  const admin = createAdminClient();
  const { error } = await admin
    .from("registration_leads")
    .update({ status: "rejected" })
    .eq("id", leadId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/portal/leads");
  return { ok: true, message: "Request rejected." };
}

