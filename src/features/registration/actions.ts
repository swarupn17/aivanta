"use server";

import { siteConfig } from "@/config/site";
import { registrationSchema, type RegistrationInput } from "./schema";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export type RegistrationResult =
  | { ok: true; message: string; totalRupees: number }
  | { ok: false; error: string };

/**
 * Server Action: submit a school registration lead.
 *
 * Validates server-side, computes the authoritative fee (never trust a
 * client-sent total), and stores a `registration_leads` row (status: pending)
 * via the service-role client. Admins convert leads into real school accounts +
 * enrollments and kick off payment. Falls back to logging when Supabase is off.
 */
export async function submitRegistration(
  input: RegistrationInput
): Promise<RegistrationResult> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  const { fiaCount, ciaCount, aiaCount } = parsed.data;
  const totalStudents = fiaCount + ciaCount + aiaCount;
  const totalRupees = totalStudents * siteConfig.fees.perSubject;
  const totalPaise = totalRupees * 100;

  if (!isSupabaseConfigured) {
    console.info("[registration] (not persisted — Supabase off)", {
      ...parsed.data,
      totalRupees,
    });
  } else {
    const supabase = createAdminClient();
    const { error } = await supabase.from("registration_leads").insert({
      school: parsed.data.school,
      udise: parsed.data.udise ?? null,
      board: parsed.data.board,
      school_type: parsed.data.type,
      address: parsed.data.address ?? null,
      contact_person: parsed.data.contact,
      phone: parsed.data.phone,
      email: parsed.data.email,
      fia_count: fiaCount,
      cia_count: ciaCount,
      aia_count: aiaCount,
      total_paise: totalPaise,
    });
    if (error) {
      console.error("[registration] insert failed", error);
      return { ok: false, error: "Something went wrong. Please email us directly." };
    }
  }

  return {
    ok: true,
    totalRupees,
    message:
      "Thank you! Your registration details have been captured. Our team will contact you shortly to confirm. (Online payment is coming soon.)",
  };
}
