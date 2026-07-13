import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Result shape shared with the schools server actions.
 * (Type-only usage here; no runtime dependency on the "use server" module.)
 */
export type LinkResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

/**
 * Bind an authenticated user to their approved school using the code they
 * logged in with. The email is verified against the school's registered
 * `contact_email` so a leaked code alone can't hijack a school. Elevates the
 * user's role to 'school'. Idempotent (safe on every re-login).
 *
 * SECURITY: this is a PLAIN server module (NOT "use server"), so it is *not*
 * exposed as a callable server action. It must only be invoked by trusted
 * server code that has already proven the user's identity — currently
 * `verifySchoolOtp`, which passes the id/email from the just-verified OTP,
 * never from client input. Uses the service-role client because the row must
 * be mutated cross-user and the role guard only yields to trusted server code.
 */
export async function linkSchoolByCodeEmail(
  code: string,
  userId: string,
  userEmail: string
): Promise<LinkResult> {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, error: "Missing school code." };

  const admin = createAdminClient();

  const { data: school } = await admin
    .from("schools")
    .select("*")
    .eq("school_code", trimmed)
    .eq("status", "approved")
    .maybeSingle();

  if (!school) {
    return { ok: false, error: "No approved school found for that code." };
  }

  // The OTP proved the user owns userEmail; require it to match the school's
  // registered email so a valid code alone can't claim someone else's school.
  if ((school.contact_email ?? "").toLowerCase() !== userEmail.toLowerCase()) {
    return { ok: false, error: "That email doesn't match this school code." };
  }

  // Already linked to this user? Idempotent success (normal re-login).
  if (school.owner_profile_id === userId) {
    return { ok: true, message: `Welcome back — ${school.name}.` };
  }
  // Linked to a different account? Refuse.
  if (school.owner_profile_id) {
    return { ok: false, error: "This school is already linked to another account." };
  }

  const { error: updErr } = await admin
    .from("schools")
    .update({
      owner_profile_id: userId,
      code_claimed_at: new Date().toISOString(),
    })
    .eq("id", school.id);
  if (updErr) return { ok: false, error: updErr.message };

  // Elevate the user's role to 'school' (service-role bypasses the role guard).
  await admin.from("profiles").update({ role: "school" }).eq("id", userId);

  revalidatePath("/portal");
  return {
    ok: true,
    message: `Welcome — ${school.name} is now linked to your account.`,
  };
}
