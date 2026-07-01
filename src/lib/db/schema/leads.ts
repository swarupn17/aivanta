import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { approvalStatus } from "./enums";

/**
 * Public lead-capture tables — submissions from the marketing site BEFORE an
 * account exists. Admins review/convert these. Written server-side.
 */

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  role: text("role"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const registrationLeads = pgTable("registration_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Applicant (person filling the form)
  applicantRole: text("applicant_role"), // Principal | Teacher | Parent | Student | Other
  applicantName: text("applicant_name").notNull(),
  applicantEmail: text("applicant_email").notNull(),
  applicantMobile: text("applicant_mobile").notNull(),
  // School
  schoolName: text("school_name").notNull(),
  schoolAddress: text("school_address"),
  city: text("city"),
  district: text("district"),
  state: text("state"),
  country: text("country"),
  pincode: text("pincode"),
  schoolEmail: text("school_email"),
  schoolPhone: text("school_phone"),
  // Principal
  principalName: text("principal_name"),
  principalContact: text("principal_contact"),
  status: approvalStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type RegistrationLead = typeof registrationLeads.$inferSelect;
export type NewRegistrationLead = typeof registrationLeads.$inferInsert;
