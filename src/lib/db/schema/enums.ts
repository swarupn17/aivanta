import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Shared enums — the vocabulary of the platform.
 * Keep these in one place so every table speaks the same language.
 */

/** Who someone is on the platform (drives RBAC via RLS). */
export const userRole = pgEnum("user_role", [
  "super_admin",
  "admin",
  "school",
  "student",
  "coordinator",
  "parent",
]);

/** Approval lifecycle shared by schools & coordinators. */
export const approvalStatus = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

/** Education boards supported at launch. */
export const educationBoard = pgEnum("education_board", [
  "cbse",
  "icse",
  "state",
  "other",
]);

/** The three flagship assessments: Financial / Cyber / Artificial Intelligence. */
export const subjectCode = pgEnum("subject_code", ["fia", "cia", "aia"]);

/** Payment lifecycle. */
export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);
