"use server";

import { contactSchema, type ContactInput } from "./schema";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

/**
 * Server Action: submit a contact message.
 *
 * This runs ON THE SERVER (the "backend" half of our Next.js app). Right now it
 * validates and logs; wiring it to Supabase (insert into a `contact_messages`
 * table + email notification) is a drop-in next step — the boundary is already here.
 */
export async function submitContactMessage(
  input: ContactInput
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check the form and try again." };
  }

  // TODO(persist): const supabase = await createClient();
  //   await supabase.from("contact_messages").insert(parsed.data);
  //   + trigger transactional email via Supabase Edge Function.
  console.info("[contact] new message", parsed.data);

  return {
    ok: true,
    message:
      "Thank you! Your message has been received. Our team will get back to you shortly.",
  };
}
