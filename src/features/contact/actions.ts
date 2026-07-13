"use server";

import { contactSchema, type ContactInput } from "./schema";
import { isSupabaseConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

/**
 * Server Action: submit a contact message.
 *
 * Runs ON THE SERVER. Persists to `contact_messages` via the service-role client
 * (public form, no authenticated user). Falls back to logging when Supabase
 * isn't configured yet, so the form always works in dev.
 */
export async function submitContactMessage(
  input: ContactInput
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  if (!isSupabaseConfigured) {
    console.info("[contact] (not persisted — Supabase off)", parsed.data);
  } else {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      role: parsed.data.role,
      message: parsed.data.message,
    });
    if (error) {
      console.error("[contact] insert failed", error);
      return { ok: false, error: "Something went wrong. Please email us directly." };
    }
  }

  return {
    ok: true,
    message:
      "Thank you! Your message has been received. Our team will get back to you shortly.",
  };
}
