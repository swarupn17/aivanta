# Supabase setup

One-time setup to bring auth + database online. ~10 minutes.

## 1. Create the project
1. Go to https://supabase.com → **New project**.
2. Note the **Project URL** and **anon key** (Project Settings → API) and the
   **service_role key** (keep this secret), plus the **connection string**
   (Project Settings → Database → Connection string → **URI**).

## 2. Add env vars
Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=...            # the "Transaction" pooler URI for runtime
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

On Vercel, add the same variables (Project → Settings → Environment Variables).

## 3. Create the tables
Two options — pick one:

**A. Drizzle (recommended, keeps migrations in-repo)**
```bash
npm run db:migrate      # applies drizzle/*.sql using DATABASE_URL
```

**B. Paste SQL** — open Supabase → **SQL Editor**, paste the contents of
`drizzle/0000_init_schema.sql`, run it.

## 4. Wire auth + Row-Level Security
In Supabase → **SQL Editor**, paste and run these **in order**:

| File | What it does |
|------|--------------|
| `supabase/02_auth_rls.sql` | links `profiles.id`→`auth.users.id`, profile-on-signup trigger, RLS + role policies, role-change guard |
| `supabase/03_school_codes.sql` | school claim-code columns + role-guard patch (lets trusted server code set roles) |
| `supabase/04_seed_exams.sql` | seeds FIA/CIA/AIA for 2025-26 |
| `supabase/05_registration_fields.sql` | SOF lead fields + schools hierarchy columns |
| `supabase/06_school_code_sequence.sql` | **5-digit incremental** `school_code` (sequence + `next_school_code()` default) |

> Already ran the old versions? All of these are idempotent — safe to re-run.
> `06` is the new one for the incremental code; run it once.

## 5. Configure login (schools use email OTP, staff use password)
Two login mechanisms now share the `/login` page:

- **Schools** sign in with **school code + school email + a 6-digit email OTP** (no password).
- **Staff** (admin/coordinator) sign in with **email + password**.

In Supabase → **Authentication**:

1. **Providers → Email:** keep **Email enabled**. You can leave **"Confirm email" OFF** —
   the OTP itself proves ownership, and password staff accounts sign in immediately.
2. **Email Templates:** add the code token to **both** templates, because a
   school's *first* login creates the user (→ **"Confirm signup"** template) while
   later logins use the **"Magic Link"** template. In each, include a line like:
   `Your Aivanta login code is: {{ .Token }}`. Without `{{ .Token }}` the email
   only contains a link and schools won't get a 6-digit code to type.
3. **SMTP (important for anything beyond local testing):** Supabase's built-in email
   sender is heavily rate-limited (a few messages/hour) and is for testing only. Wire a
   real provider under **Project Settings → Authentication → SMTP Settings** (Resend, SES,
   etc.) before real schools start logging in — otherwise OTP emails will silently
   throttle.

## 6. Make yourself an admin
After you log in once, run in the SQL Editor (replace the email):
```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

## Done
Restart `npm run dev`. The login flow (`/login`), session handling, and the
protected `/portal` area are now live. Contact/registration Server Actions can
now persist to the database (their `TODO(persist)` hooks are ready to wire).
