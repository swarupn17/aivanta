# 05 — Authentication & Access Control (RBAC + RLS)

Security here is **defense in depth**: the UI hides what you can't do, the Server
Actions check your role, and — most importantly — the **database enforces access
with Row-Level Security** so nothing leaks even if app code is wrong.

## Authentication (login)

Two audiences, two mechanisms, one `/login` page (`components/auth/LoginForm.tsx`,
a **School / Staff** tab toggle):

- **Schools** — **school code + school email + 6-digit email OTP** (no password).
  A leaked code alone is not enough: the email must match the school's registered
  `contact_email`, and the OTP proves the user controls that inbox.
- **Staff** (admin / coordinator) — **email + password**.

Actions in `src/features/auth/actions.ts`:
  - `requestSchoolOtp(code, email)` — verifies the code+email map to an approved
    school (service-role read), then sends the OTP (`signInWithOtp`,
    `shouldCreateUser: true`).
  - `verifySchoolOtp(code, email, token)` — `verifyOtp({type:'email'})`, then
    links the account to its school and redirects to `/portal`.
  - `signInWithPassword(email, password)` — staff sign-in.
  - `signUpWithPassword(...)` — kept for **bootstrapping staff accounts**; not
    surfaced in the UI (schools cannot self-register).
  - `signOut()`.

- **Session:** managed by `@supabase/ssr` via cookies. `middleware.ts` refreshes
  the session on every request so Server Components always see a valid session.
- **Profile creation:** on `auth.users` insert, the `handle_new_user()` Postgres
  trigger creates a matching `profiles` row (default role `student`). A school's
  role is elevated to `school` when their account is linked (below).

### Email / OTP delivery
Supabase's built-in email sender is rate-limited (testing only). Configure custom
SMTP (Resend/SES) and add `{{ .Token }}` to the Magic Link email template so the
6-digit code is delivered — see [Supabase Setup](../supabase/README.md). Because
schools **type** the code (rather than clicking a link), corporate "Safe Links"
scanners no longer consume the token — which is why OTP is viable here now. The
`/auth/confirm` route remains for magic-link/confirmation use.

## The current user

`src/features/auth/queries.ts` → `getCurrentUser()` returns the Supabase user +
their `profiles` row (which carries `role` and `full_name`). Server Components and
Actions use this to branch on role.

## Roles (RBAC)

Roles live in `profiles.role` (`user_role` enum). See
[Overview](./01-overview.md) for the table. Two helpers:

- `canApprove(role)` (`features/schools/queries.ts`) — true for `admin` /
  `super_admin`. Used to gate the admin pages/actions.
- Role elevation to `school` happens **only** via claiming a code (below).

## Row-Level Security (the important part)

Defined in `supabase/02_auth_rls.sql`. RLS is **enabled on every table**. Policies
are written in terms of two `SECURITY DEFINER` helper functions:

- `is_admin()` → is the current user an admin/super_admin?
- `owns_school(school_id)` → does the current user own that school?

### Policy summary

| Table | Read | Write |
|-------|------|-------|
| `profiles` | own row or admin | own row or admin (role change blocked, see below) |
| `schools` | owner or admin | owner or admin; insert requires `owner = you`; delete admin-only |
| `students` | owner-of-school or admin | same |
| `enrollments` | via student's school owner, or admin | same |
| `payments` | owner-of-school or admin | same |
| `exams` / `exam_dates` | **public read** | admin only |
| `coordinators` | self or admin | admin only |
| `contact_messages` / `registration_leads` | **admin only** | inserted via service-role (bypasses RLS) |

Because reads go through the **session client**, a school querying `students`
simply *cannot* get another school's rows — Postgres filters them out.

### Role-change guard
A trigger (`prevent_role_change`) stops normal users from changing their own
`role`. It was patched (`supabase/03_school_codes.sql`) to allow changes when
`auth.uid()` is null — i.e. trusted **service-role** server code — so the
school-claim flow can elevate a user to `school`.

## The service-role (admin) client — use sparingly

`src/lib/supabase/admin.ts` creates a client with the **service-role key** that
**bypasses RLS**. It is used only where there is no user session to act as, or
where a privileged cross-user write is required:

- Inserting `registration_leads` / `contact_messages` (public, no account yet)
- `approveLead` — creates a `schools` row with no owner (DB assigns the code)
- `requestSchoolOtp` — verifies the code+email pairing before sending an OTP
- `linkSchoolByCodeEmail` — binds the school to the user and flips their role to `school`

**Rules:**
- Never import `admin.ts` into a Client Component.
- The `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never reach the browser.

## The school-link mechanism (how a user becomes a `school`)

Linking is folded into login — there is no separate "claim" step.

1. Admin approves a lead → `schools` row created (`status: approved`,
   `owner_profile_id: null`). The DB assigns a unique, **incremental 5-digit**
   `school_code` via the `next_school_code()` sequence default
   (`supabase/06_school_code_sequence.sql`).
2. The school logs in with **code + email + OTP**. After the OTP verifies,
   `verifySchoolOtp` calls `linkSchoolByCodeEmail(code, userId, email)`
   (`features/schools/link.ts` — a plain server module, **not** a callable
   server action, so the identity args can't be spoofed by a client):
   - finds the approved school for that code,
   - re-checks the email matches its `contact_email`,
   - sets `owner_profile_id` + `code_claimed_at` (idempotent on re-login),
   - updates their `profiles.role` to `school`.
3. From then on, RLS's `owns_school()` grants them access to exactly their school.

This is why schools **cannot self-register** — access requires an admin-issued
code *and* control of the registered email inbox.
