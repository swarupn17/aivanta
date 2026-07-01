import {
  pgTable,
  uuid,
  text,
  integer,
  date,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { subjectCode, paymentStatus } from "./enums";
import { schools } from "./schools";
import { students } from "./students";

/**
 * `exams` — a catalog entry (e.g. FIA for the 2025-26 cycle).
 * `feePerStudent` stored in paise (INR × 100) to avoid float money bugs.
 */
export const exams = pgTable("exams", {
  id: uuid("id").primaryKey().defaultRandom(),
  subject: subjectCode("subject").notNull(),
  name: text("name").notNull(),
  academicYear: text("academic_year").notNull(),
  minClass: integer("min_class").notNull().default(1),
  maxClass: integer("max_class").notNull().default(10),
  feePerStudentPaise: integer("fee_per_student_paise").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** `examDates` — scheduled sittings for an exam, each with a registration deadline. */
export const examDates = pgTable("exam_dates", {
  id: uuid("id").primaryKey().defaultRandom(),
  examId: uuid("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  examDate: date("exam_date").notNull(),
  registrationDeadline: date("registration_deadline"),
});

/**
 * `enrollments` — a student registered for a specific exam sitting.
 * `rollNo` is auto-generated per student per exam per year.
 */
export const enrollments = pgTable("enrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  examId: uuid("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  examDateId: uuid("exam_date_id").references(() => examDates.id),
  rollNo: text("roll_no"),
  paymentStatus: paymentStatus("payment_status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * `payments` — a bulk fee payment made by a school. `amountPaise`/`gstPaise` in paise.
 */
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  amountPaise: integer("amount_paise").notNull(),
  gstPaise: integer("gst_paise").notNull().default(0),
  gatewayRef: text("gateway_ref"),
  status: paymentStatus("status").notNull().default("pending"),
  invoicePdfUrl: text("invoice_pdf_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Exam = typeof exams.$inferSelect;
export type NewExam = typeof exams.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
