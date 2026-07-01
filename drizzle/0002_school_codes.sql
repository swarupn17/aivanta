ALTER TABLE "schools" ADD COLUMN "school_code" text;--> statement-breakpoint
ALTER TABLE "schools" ADD COLUMN "code_claimed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_school_code_unique" UNIQUE("school_code");