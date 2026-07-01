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
In Supabase → **SQL Editor**, paste and run `supabase/02_auth_rls.sql`.
This:
- links `profiles.id` → `auth.users.id`
- auto-creates a `profiles` row on signup (trigger)
- enables RLS on every table and adds role-aware policies
- blocks non-admins from changing their own role

## 5. Configure email OTP
Supabase → **Authentication → Providers → Email**:
- Enable **Email OTP** (and/or magic links).
- Under **Email Templates → Magic Link**, make sure the template includes the
  `{{ .Token }}` (6-digit code) if you want code-based login. The default also
  works for the magic-link flow we support.
- Add your site URL + `.../auth/confirm` to **URL Configuration → Redirect URLs**
  (e.g. `http://localhost:3000/**` and your Vercel domain).

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
