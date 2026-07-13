import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { approvalStatus, educationBoard } from "./enums";

/**
 * `coordinators` — regional agents who recruit schools and earn commission.
 * `commissionRate` is stored as basis points (e.g. 1000 = 10.00%) to avoid
 * floating-point money bugs.
 */
export const coordinators = pgTable("coordinators", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Links to the auth user who logs in as this coordinator.
  profileId: uuid("profile_id"),
  name: text("name").notNull(),
  territory: text("territory"),
  commissionRateBps: text("commission_rate_bps").notNull().default("0"),
  status: approvalStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * `schools` — the B2B customer. Created by an ADMIN on approval of a
 * registration request. A school claims its account via `schoolCode` + email OTP.
 */
export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  // The auth user who administers this school (set when they claim the code).
  ownerProfileId: uuid("owner_profile_id"),
  // Unique, incremental 5-digit code assigned by the DB (next_school_code()
  // sequence default) when an admin approves the school.
  schoolCode: text("school_code").unique(),
  codeClaimedAt: timestamp("code_claimed_at", { withTimezone: true }),
  name: text("name").notNull(),
  board: educationBoard("board").notNull().default("cbse"),
  affiliationNo: text("affiliation_no"),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  addressLine: text("address_line"),
  city: text("city"),
  district: text("district"),
  state: text("state"),
  country: text("country"),
  pincode: text("pincode"),
  academicYear: text("academic_year").notNull().default("2025-26"),
  coordinatorId: uuid("coordinator_id").references(() => coordinators.id),
  status: approvalStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type School = typeof schools.$inferSelect;
export type NewSchool = typeof schools.$inferInsert;
export type Coordinator = typeof coordinators.$inferSelect;
export type NewCoordinator = typeof coordinators.$inferInsert;
