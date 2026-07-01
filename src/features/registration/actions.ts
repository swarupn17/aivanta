"use server";

import { siteConfig } from "@/config/site";
import { registrationSchema, type RegistrationInput } from "./schema";

export type RegistrationResult =
  | { ok: true; message: string; totalRupees: number }
  | { ok: false; error: string };

/**
 * Server Action: submit a school registration.
 *
 * Validates server-side, computes the authoritative fee (never trust a
 * client-sent total), and returns a confirmation. Next steps (drop-in):
 * insert the school (status "pending") + enrollments via the Supabase/Drizzle
 * layer, then kick off a Razorpay order for the total.
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

  // TODO(persist): insert school (pending) + per-subject enrollments,
  //   then create a payment order for `totalRupees`.
  console.info("[registration] new school", { ...parsed.data, totalRupees });

  return {
    ok: true,
    totalRupees,
    message:
      "Thank you! Your registration details have been captured. Our team will contact you shortly to confirm. (Online payment is coming soon.)",
  };
}
