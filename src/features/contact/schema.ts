import { z } from "zod";

/**
 * Contact form schema — the single source of truth shared by the client form
 * (validation UX) and the server action (trust boundary). Never trust the client;
 * the server re-validates with this exact schema.
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  role: z.string().min(1, "Please tell us who you are."),
  message: z.string().min(10, "Message should be at least 10 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const CONTACT_ROLES = [
  "School / Principal",
  "Teacher",
  "Parent",
  "CSR / Corporate Partner",
  "Government / NGO",
  "Other",
] as const;
