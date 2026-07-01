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
 * `schools` — the B2B customer. Self-registers, gets admin-approved, enrolls students.
 */
export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  // The auth user who administers this school.
  ownerProfileId: uuid("owner_profile_id"),
  name: text("name").notNull(),
  board: educationBoard("board").notNull().default("cbse"),
  affiliationNo: text("affiliation_no"),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  addressLine: text("address_line"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  coordinatorId: uuid("coordinator_id").references(() => coordinators.id),
  status: approvalStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type School = typeof schools.$inferSelect;
export type NewSchool = typeof schools.$inferInsert;
export type Coordinator = typeof coordinators.$inferSelect;
export type NewCoordinator = typeof coordinators.$inferInsert;
