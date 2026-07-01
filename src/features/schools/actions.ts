"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/features/auth/queries";
import { canApprove } from "./queries";
import { newSchoolCode } from "./codes";

export type ActionResult =
  | { ok: true; message: string; code?: string }
  | { ok: false; error: string };

async function generateUniqueCode(
  admin: ReturnType<typeof createAdminClient>
): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = newSchoolCode();
    const { data } = await admin
      .from("schools")
      .select("id")
      .eq("school_code", code)
      .maybeSingle();
    if (!data) return code;
  }
  throw new Error("Could not generate a unique code, please retry.");
}

/**
 * ADMIN: approve a registration request. Creates the school (auto-filled from
 * the request, status 'approved') with a freshly generated claim code, and
 * marks the lead approved. Returns the code to hand to the school.
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

  const code = await generateUniqueCode(admin);

  const { error: insErr } = await admin.from("schools").insert({
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
    school_code: code,
    status: "approved",
  });
  if (insErr) return { ok: false, error: insErr.message };

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

/**
 * SCHOOL: claim an approved school with the admin-issued code. Binds the current
 * user as owner and flips their role to 'school'. Requires being logged in.
 */
export async function claimSchool(code: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in first." };

  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { ok: false, error: "Enter your school code." };

  const admin = createAdminClient();

  const { data: school } = await admin
    .from("schools")
    .select("*")
    .eq("school_code", trimmed)
    .eq("status", "approved")
    .is("owner_profile_id", null)
    .maybeSingle();

  if (!school) {
    return { ok: false, error: "Invalid code, or it has already been claimed." };
  }

  const { error: updErr } = await admin
    .from("schools")
    .update({ owner_profile_id: user.id, code_claimed_at: new Date().toISOString() })
    .eq("id", school.id);
  if (updErr) return { ok: false, error: updErr.message };

  // Elevate the user's role to 'school' (service-role bypasses the role guard).
  await admin.from("profiles").update({ role: "school" }).eq("id", user.id);

  revalidatePath("/portal");
  return { ok: true, message: `Welcome — ${school.name} is now linked to your account.` };
}
