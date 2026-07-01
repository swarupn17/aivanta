import { pgTable, uuid, text, integer, date, timestamp } from "drizzle-orm/pg-core";
import { schools } from "./schools";

/**
 * `students` — enrolled by a school. `classLevel` is 1–10 (Aivanta covers Classes 1–10).
 */
export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  classLevel: integer("class_level").notNull(),
  section: text("section"),
  dob: date("dob"),
  parentName: text("parent_name"),
  parentContact: text("parent_contact"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
