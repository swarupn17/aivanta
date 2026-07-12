import { api } from "@/lib/api";
import { contactSchema, type ContactInput } from "./schema";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

/**
 * Submit a contact message via the Node backend (public endpoint).
 * Re-validates client-side first for a fast fail; the server re-validates too.
 */
export async function submitContactMessage(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }
  return api.post<{ message: string }>("/api/contact", parsed.data);
}
