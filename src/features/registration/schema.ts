import { z } from "zod";

/**
 * School registration = a code-request lead (SOF-style). Captures who's asking +
 * the school details. Subjects/fees are handled later in the school portal.
 */
export const registrationSchema = z.object({
  applicantRole: z.enum(["Principal", "Teacher", "Parent", "Student", "Other"]),
  applicantName: z.string().min(2, "Enter your name."),
  applicantEmail: z.string().email("Enter a valid email address."),
  applicantMobile: z
    .string()
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number."),
  schoolName: z.string().min(2, "Enter the complete school name."),
  schoolAddress: z.string().min(3, "Enter the complete school address."),
  city: z.string().min(2, "Enter the school city."),
  district: z.string().min(2, "Enter the school district."),
  state: z.string().min(2, "Enter the school state."),
  country: z.string().min(2, "Enter the school country."),
  pincode: z.string().regex(/^\d{4,6}$/, "Enter a valid pincode."),
  schoolEmail: z.string().email("Enter a valid school email id."),
  schoolPhone: z.string().min(7, "Enter a valid school phone number."),
  principalName: z.string().min(2, "Enter the principal's name."),
  principalContact: z.string().min(7, "Enter a valid contact number."),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const APPLICANT_ROLES = [
  "Principal",
  "Teacher",
  "Parent",
  "Student",
  "Other",
] as const;
