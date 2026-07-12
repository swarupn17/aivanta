import { z } from "zod";

/**
 * Server-side validation schemas — the API's trust boundary. These MUST mirror
 * the frontend schemas (src/features/<name>/schema.ts). Keep them in sync; the client
 * validates for UX, the server validates for safety. Never trust the client.
 */

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string().min(1),
  message: z.string().min(10),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const registrationSchema = z.object({
  applicantRole: z.enum(["Principal", "Teacher", "Parent", "Student", "Other"]),
  applicantName: z.string().min(2),
  applicantEmail: z.string().email(),
  applicantMobile: z.string().regex(/^\d{10}$/),
  schoolName: z.string().min(2),
  schoolAddress: z.string().min(3),
  city: z.string().min(2),
  district: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  pincode: z.string().regex(/^\d{4,6}$/),
  schoolEmail: z.string().email(),
  schoolPhone: z.string().min(7),
  principalName: z.string().min(2),
  principalContact: z.string().min(7),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;

export const commitRowSchema = z.object({
  fullName: z.string().min(1),
  classLevel: z.number().int().min(1).max(10),
  section: z.string().optional().default(""),
  dob: z.string().optional().default(""),
  parentName: z.string().optional().default(""),
  parentContact: z.string().optional().default(""),
  fia: z.boolean(),
  cia: z.boolean(),
  aia: z.boolean(),
});
export type CommitRow = z.infer<typeof commitRowSchema>;

export const commitBodySchema = z.object({
  rows: z.array(commitRowSchema),
});
