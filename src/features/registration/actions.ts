"use server";

import { registrationSchema, type RegistrationInput } from "./schema";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewRegistrationAdminAlert } from "@/lib/email";

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
      // Dev: surface the real Postgres error (e.g. "column ... does not exist")
      // so schema/RLS problems are obvious immediately. Production: stay generic
      // — never leak DB internals to the public.
      const detail =
        process.env.NODE_ENV === "production" ? "" : ` [dev: ${error.message}]`;
      return {
        ok: false,
        error: `Something went wrong. Please email us directly.${detail}`,
      };
    }

    // Best-effort admin notification. Never blocks the applicant's success
    // (the sender is guarded and won't throw).
    await sendNewRegistrationAdminAlert({
      applicantName: d.applicantName,
      applicantEmail: d.applicantEmail,
      applicantMobile: d.applicantMobile,
      schoolName: d.schoolName,
      city: d.city,
      state: d.state,
    });
  }

  return {
    ok: true,
    message:
      "Thank you! Your request has been received. An Aivanta representative will contact you to assist with registration and issue your school code.",
  };
}
