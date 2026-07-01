import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit config — schema location, migration output, and DB credentials.
 * Migrations live in /drizzle and ARE committed (they're your schema history).
 */
export default defineConfig({
  schema: "./src/lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
