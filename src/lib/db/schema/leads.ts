import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
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
  school: text("school").notNull(),
  udise: text("udise"),
  board: text("board"),
  schoolType: text("school_type"),
  address: text("address"),
  contactPerson: text("contact_person").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  fiaCount: integer("fia_count").notNull().default(0),
  ciaCount: integer("cia_count").notNull().default(0),
  aiaCount: integer("aia_count").notNull().default(0),
  totalPaise: integer("total_paise").notNull().default(0),
  status: approvalStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
export type RegistrationLead = typeof registrationLeads.$inferSelect;
export type NewRegistrationLead = typeof registrationLeads.$inferInsert;
