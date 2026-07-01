import { z } from "zod";

/** Shared registration schema — client validation + server trust boundary. */
export const registrationSchema = z.object({
  school: z.string().min(2, "Enter the school name."),
  udise: z.string().optional(),
  board: z.enum(["State Board", "CBSE", "ICSE", "Other"]),
  type: z.enum(["Government", "Private", "Aided"]),
  address: z.string().optional(),
  contact: z.string().min(2, "Enter a contact name."),
  phone: z.string().min(7, "Enter a valid phone number."),
  email: z.string().email("Enter a valid email address."),
  fiaCount: z.coerce.number().int().min(0).default(0),
  ciaCount: z.coerce.number().int().min(0).default(0),
  aiaCount: z.coerce.number().int().min(0).default(0),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const BOARDS = ["State Board", "CBSE", "ICSE", "Other"] as const;
export const SCHOOL_TYPES = ["Government", "Private", "Aided"] as const;
