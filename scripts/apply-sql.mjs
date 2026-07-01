// Apply a .sql file to the database over DATABASE_URL (use the POOLER host).
// Run: node --env-file=.env.local scripts/apply-sql.mjs supabase/02_auth_rls.sql
import { readFileSync } from "node:fs";
import postgres from "postgres";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node --env-file=.env.local scripts/apply-sql.mjs <file.sql>");
  process.exit(1);
}
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL not set (use the Session pooler URI from Supabase).");
  process.exit(1);
}

const text = readFileSync(file, "utf8");
console.log(`Applying ${file} (${text.length} bytes)...`);

const sql = postgres(dbUrl, { prepare: false, connect_timeout: 20, max: 1 });
try {
  await sql.unsafe(text); // simple-query protocol: runs multiple statements
  console.log("OK — applied successfully.");
} catch (e) {
  console.error("FAILED:", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
