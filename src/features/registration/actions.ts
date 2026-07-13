"use server";

import { registrationSchema, type RegistrationInput } from "./schema";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export type RegistrationResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

/**
 * Server Action: submit a school code-request (SOF-style lead).
 *
 * Validates server-side and stores a `registration_leads` row (status: pending)
 * via the service-role client. An admin reviews, approves, and issues a school
 * code. Falls back to logging when Supabase is off.
 */
export async function submitRegistration(
  input: RegistrationInput
): Promise<RegistrationResult> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  const d = parsed.data;

  if (!isSupabaseConfigured) {
    console.info("[registration] (not persisted — Supabase off)", d);
  } else {
    const supabase = createAdminClient();
    const { error } = await supabase.from("registration_leads").insert({
      applicant_role: d.applicantRole,
      applicant_name: d.applicantName,
      applicant_email: d.applicantEmail,
      applicant_mobile: d.applicantMobile,
      school_name: d.schoolName,
      school_address: d.schoolAddress,
      city: d.city,
      district: d.district,
      state: d.state,
      country: d.country,
      pincode: d.pincode,
      school_email: d.schoolEmail,
      school_phone: d.schoolPhone,
      principal_name: d.principalName,
      principal_contact: d.principalContact,
    });
    if (error) {
      console.error("[registration] insert failed", error);
      return { ok: false, error: "Something went wrong. Please email us directly." };
    }
  }

  return {
    ok: true,
    message:
      "Thank you! Your request has been received. An Aivanta representative will contact you to assist with registration and issue your school code.",
  };
}
