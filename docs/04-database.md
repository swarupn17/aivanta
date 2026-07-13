# 04 — Database & Data Model

Postgres, hosted by Supabase. Schema is defined in Drizzle
(`src/lib/db/schema/*`) and applied through a mix of generated migrations
(`drizzle/`) and hand-applied SQL (`supabase/`).

## Enums (`schema/enums.ts`)

| Enum | Values |
|------|--------|
| `user_role` | `super_admin`, `admin`, `school`, `student`, `coordinator`, `parent` |
| `approval_status` | `pending`, `approved`, `rejected`, `suspended` |
| `education_board` | `cbse`, `icse`, `state`, `other` |
| `subject_code` | `fia`, `cia`, `aia` |
| `payment_status` | `pending`, `paid`, `failed`, `refunded` |

## Tables

### `profiles` — app-owned user data (`schema/profiles.ts`)
One row per authenticated user, keyed 1:1 to Supabase `auth.users.id`.
Supabase Auth owns credentials/sessions; this table owns the **role** and is what
RLS policies join against.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | = `auth.users.id` |
| `role` | user_role | default `student` |
| `full_name` | text | populated from signup metadata |
| `phone` | text | |
| `created_at` / `updated_at` | timestamptz | |

Created automatically by a `handle_new_user()` trigger on `auth.users` insert.

### `schools` — the B2B customer (`schema/schools.ts`)
Created by an admin on approval; claimed by a school via `school_code`.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `owner_profile_id` | uuid | the user who claimed/administers it; null until claimed |
| `school_code` | text unique | unique **incremental 5-digit** code (e.g. `10001`), assigned by the `next_school_code()` sequence on approval |
| `code_claimed_at` | timestamptz | set when linked at first login |
| `name` | text | |
| `board` | education_board | default `cbse` |
| `affiliation_no` | text | |
| `contact_person` / `contact_phone` / `contact_email` | text | `contact_email` is the OTP login address |
| `address_line`, `city`, `district`, `country`, `state`, `pincode` | text | `district`/`country` power the admin hierarchy |
| `academic_year` | text | default `2025-26`; hierarchy top level |
| `coordinator_id` | uuid FK → coordinators | |
| `status` | approval_status | default `pending` |
| `created_at` / `updated_at` | timestamptz | |

### `coordinators` — regional agents (`schema/schools.ts`)
`commission_rate_bps` stored in **basis points** (1000 = 10.00%) to avoid float
money bugs. Mostly future-facing.

### `students` — enrolled by a school (`schema/students.ts`)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `school_id` | uuid FK → schools (cascade delete) | |
| `full_name` | text | |
| `class_level` | integer | 1–10 |
| `section`, `dob`, `parent_name`, `parent_contact`, `photo_url` | | |
| `created_at` | timestamptz | |

### `exams` — assessment catalog (`schema/exams.ts`)
One row per subject per academic year (e.g. FIA 2025-26).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `subject` | subject_code | fia/cia/aia |
| `name` | text | |
| `academic_year` | text | |
| `min_class` / `max_class` | integer | default 1 / 10 |
| `fee_per_student_paise` | integer | **money in paise** (₹150 = 15000) |
| `is_active` | boolean | |

Seeded via `supabase/04_seed_exams.sql`.

### `exam_dates` — scheduled sittings (`schema/exams.ts`)
`exam_id` FK, `exam_date`, `registration_deadline`.

### `enrollments` — a student registered for an exam (`schema/exams.ts`)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `student_id` | uuid FK → students (cascade) | |
| `exam_id` | uuid FK → exams (cascade) | |
| `exam_date_id` | uuid FK → exam_dates | |
| `roll_no` | text | generated on payment (future) |
| `payment_status` | payment_status | default `pending` (= draft/unpaid) |

This is the join between students and exams. A student with FIA+CIA has two
enrollment rows. Fee = count of enrollments × per-subject fee.

### `payments` — bulk school fee payment (`schema/exams.ts`)
`amount_paise`, `gst_paise`, `gateway_ref`, `status`, `invoice_pdf_url`.
Wired up when Razorpay is added.

### Lead tables (`schema/leads.ts`) — public submissions, no account yet

**`contact_messages`** — from the public contact form: `name`, `email`, `phone`,
`role`, `message`.

**`registration_leads`** — SOF-style school code-requests:
| Group | Columns |
|-------|---------|
| Applicant | `applicant_role`, `applicant_name`, `applicant_email`, `applicant_mobile` |
| School | `school_name`, `school_address`, `city`, `district`, `state`, `country`, `pincode`, `school_email`, `school_phone` |
| Principal | `principal_name`, `principal_contact` |
| Meta | `status` (approval_status), `created_at` |

Written via the **admin (service-role) client** (no user exists yet); readable
only by admins (RLS).

## Relationships (text ERD)

```
auth.users (Supabase) ─1:1─ profiles
profiles ─(owner_profile_id)─ schools ─1:many─ students ─1:many─ enrollments ─many:1─ exams
                                   │                                     │
                             coordinators                          exam_dates
schools ─1:many─ payments
registration_leads / contact_messages   (standalone lead capture; converted to schools on approval)
```

## Migrations & applying schema

Two mechanisms — know the difference:

1. **`drizzle/` (generated).** `npm run db:generate` reads `schema/*` and writes
   SQL to `drizzle/`. These are the canonical schema history and are committed.
2. **`supabase/*.sql` (hand-applied).** RLS, seeds, and a few ad-hoc migrations
   that were applied directly in the Supabase SQL Editor. Run in numeric order.

Apply order for a fresh database (details in [Supabase Setup](./08-supabase-setup.md)):

```
drizzle/0000_init_schema.sql   (tables)
drizzle/0001_leads.sql
drizzle/0002_school_codes.sql
supabase/02_auth_rls.sql       (trigger, is_admin(), owns_school(), RLS policies)
supabase/03_school_codes.sql   (claim-code columns + role-guard patch)
supabase/04_seed_exams.sql     (FIA/CIA/AIA for 2025-26)
supabase/05_registration_fields.sql  (SOF lead fields + schools district/country/academic_year)
supabase/06_school_code_sequence.sql (5-digit incremental school_code: sequence + default)
```

> **Known drift:** the SOF registration reshape and `schools` hierarchy columns
> currently live only in `supabase/05_*.sql` — a matching `drizzle/0003` was not
> generated (the CLI hit an interactive prompt). If you rely on `db:migrate`
> alone, regenerate a clean `0003` from the schema. See [Roadmap](./11-roadmap.md).
