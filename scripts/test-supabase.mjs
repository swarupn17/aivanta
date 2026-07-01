// Supabase connectivity + setup check. No emails sent.
// Run: node --env-file=.env.local scripts/test-supabase.mjs
import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!rawUrl || !service) {
  console.error("Missing env. Need NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Normalise: strip any trailing /rest/v1/ or slash the user may have pasted.
const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
if (url !== rawUrl) console.log("NOTE: normalised URL from", rawUrl, "->", url);

console.log("Project:", url);
const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// 1. Auth reachable? (service role can list users)
try {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1 });
  if (error) throw error;
  console.log("Auth API:      OK  (users so far:", data.users.length >= 0 ? "reachable)" : "?)");
} catch (e) {
  console.log("Auth API:      FAIL —", e.message);
}

// 2. Which tables exist?
const tables = [
  "profiles",
  "schools",
  "students",
  "enrollments",
  "exams",
  "payments",
  "coordinators",
  "contact_messages",
  "registration_leads",
];

let existing = 0;
for (const t of tables) {
  const { error } = await admin.from(t).select("*", { count: "exact", head: true });
  if (error) {
    console.log(`Table ${t.padEnd(20)} MISSING — ${error.message}`);
  } else {
    existing++;
    console.log(`Table ${t.padEnd(20)} OK`);
  }
}

// 3. RLS helper functions present?
try {
  const { error } = await admin.rpc("is_admin");
  console.log("is_admin() fn: ", error ? `MISSING — ${error.message}` : "OK");
} catch (e) {
  console.log("is_admin() fn:  ERROR —", e.message);
}

console.log(`\nSummary: ${existing}/${tables.length} tables present.`);
if (existing === 0) {
  console.log("→ Tables not created yet. Run drizzle/*.sql then supabase/02_auth_rls.sql.");
} else if (existing < tables.length) {
  console.log("→ Some tables missing. Re-run the latest migration.");
} else {
  console.log("→ Schema looks complete.");
}

// 4. Direct Postgres connection (what Drizzle migrations use)
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    const { default: postgres } = await import("postgres");
    const sql = postgres(dbUrl, { prepare: false, connect_timeout: 15 });
    const rows = await sql`select 1 as ok`;
    await sql.end();
    console.log("\nDirect Postgres (DATABASE_URL):", rows[0]?.ok === 1 ? "OK" : "unexpected");
  } catch (e) {
    console.log("\nDirect Postgres (DATABASE_URL): FAIL -", e.message);
  }
} else {
  console.log("\nDirect Postgres: DATABASE_URL not set (needed for migrations).");
}
