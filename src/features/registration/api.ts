import { api } from "@/lib/api";
import { registrationSchema, type RegistrationInput } from "./schema";

export type RegistrationResult =
  { ok: true; message: string } | { ok: false; error: string };

/**
 * Submit a school code-request (SOF-style lead) via the Node backend (public).
 * Client validates for UX; the server re-validates as the trust boundary.
 */
export async function submitRegistration(
  input: RegistrationInput
): Promise<RegistrationResult> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  return api.post<{ message: string }>("/api/registration", parsed.data);
}
