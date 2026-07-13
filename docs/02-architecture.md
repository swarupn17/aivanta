# 02 — Architecture

## Big picture

Aivanta is a **single Next.js application** that serves both the frontend and the
backend. There is no separate API server: **Server Components** read data
directly, and **Server Actions** (`"use server"`) are the write/mutation layer.
All data lives in **Supabase Postgres**, and the **database itself enforces
authorization** via Row-Level Security (RLS).

```
        Browser
          │
          ▼
   Next.js (Vercel)
   ├── Server Components ──► Supabase (SSR client, user's session)  ──► Postgres + RLS
   ├── Server Actions ─────► Supabase (SSR client) or Admin client        │
   └── middleware.ts ──────► refreshes the auth session cookie             │
                                                                     RLS policies
                                                                     decide access
```

Two ways the server talks to Supabase:

1. **Session client** (`src/lib/supabase/server.ts`) — acts *as the logged-in
   user*. RLS applies. This is the default and the safe choice.
2. **Admin (service-role) client** (`src/lib/supabase/admin.ts`) — bypasses RLS.
   Used only for trusted operations that legitimately need it: inserting public
   leads (no user yet), approving a lead (creates a school with no owner), and
   the school-claim/role-change. **Never import this into client code.**

## Rendering model

- **Server Components** by default (data fetching, no JS shipped).
- **Client Components** (`"use client"`) only where interactivity is needed:
  forms, toggles, filter bars, file upload.
- **Server Actions** for all mutations — called directly from client components
  as if they were functions; Next handles the RPC. They re-validate input with
  Zod (never trust the client) and call `revalidatePath` to refresh data.

## Folder layout (`src/`)

```
src/
├── app/                      # Next.js App Router (routes = folders)
│   ├── (marketing)/          # Public site: home, about, assessments, registration, syllabus, legal...
│   ├── (auth)/               # /login (its own minimal layout)
│   ├── (portal)/             # Authenticated app; layout guards the session
│   │   └── portal/
│   │       ├── page.tsx      # Role-aware dashboard
│   │       ├── leads/        # Admin: review & approve school requests
│   │       ├── students/     # School: enrol students (CSV/manual), fees, roster
│   │       └── admin/schools # Admin: Year>State>District>City browser + per-school detail
│   ├── auth/confirm/         # OTP/magic-link confirm route (kept for future OTP)
│   ├── layout.tsx            # Root layout (fonts, metadata)
│   └── globals.css           # Tailwind v4 + brand theme tokens
│
├── components/
│   ├── layout/               # Header, Footer, LanguageToggle
│   ├── marketing/            # Hero, Ticker, forms, syllabus explorer, page chrome
│   ├── portal/               # Portal-only UI (lead rows, uploader, admin tables, filters)
│   └                 # Primitives: Container, Reveal, form fields, icons, counters
│
├── config/
│   ├── site.ts               # Org identity, contact, social, fees, announcements (edit content here)
│   └── navigation.ts         # Header/footer nav structure
│
├── features/                 # Domain logic grouped by feature (the "backend")
│   ├── auth/                 # actions (sign in/up/out), queries (getCurrentUser)
│   ├── contact/              # contact form schema + action
│   ├── registration/         # school code-request schema + action
│   ├── schools/              # approve/reject actions, link (login-time binding), admin browser queries + actions
│   └── students/             # CSV parse, enrol/commit actions, roster + fee queries
│
└── lib/
    ├── db/
    │   ├── schema/           # Drizzle table definitions (source of truth for migrations & types)
    │   └── client.ts         # Drizzle runtime client (currently unused; app uses supabase-js)
    ├── supabase/             # client.ts (browser), server.ts (SSR), middleware.ts, admin.ts
    ├── env.ts                # Zod-validated environment variables
    └── utils.ts              # cn() class-merge helper
```

### Why `features/`?
Domain code (validation schemas, Server Actions, queries) is grouped by feature,
not by technical type. This keeps a change ("edit how registration works")
localized to one folder instead of scattered across `/actions`, `/schemas`, etc.
It's the app's de-facto backend layer.

## Route groups

Parentheses folders like `(marketing)` and `(portal)` are **route groups** — they
organize routes and share a layout **without** adding a URL segment. So
`(portal)/portal/leads/page.tsx` serves `/portal/leads`.

- `(marketing)` — public, uses the site Header/Footer.
- `(auth)` — `/login`, minimal centered layout.
- `(portal)` — everything under `/portal`; its `layout.tsx` checks the session
  server-side and redirects to `/login` if absent.

## Request lifecycle (example: a school enrols students)

1. School opens `/portal/students` (Server Component). The `(portal)` layout has
   already confirmed a session; the page calls `getMySchool()` + `listRoster()`
   using the **session client** — RLS ensures they only see their own school.
2. They upload a CSV. The **client** component reads the file text and calls the
   `parseStudentsCsv` **Server Action**, which validates and returns a preview
   (nothing saved).
3. They edit/confirm. `commitEnrolments` (Server Action) re-validates with Zod,
   inserts `students` + `enrollments` via the **session client**. RLS's
   `owns_school()` check guarantees they can only write to their own school.
4. `revalidatePath("/portal/students")` refreshes the roster + fee totals.

## Key architectural decisions

- **RLS-first security.** Authorization lives in the database. Even if a bug sent
  the wrong query, Postgres refuses to return rows the user can't see. See
  [Auth & RBAC](./05-auth-and-rbac.md).
- **Server Actions as the API.** Fewer moving parts than a separate REST/GraphQL
  layer; type-safe end to end.
- **Money in paise.** All money is stored as integer paise (₹ × 100) in the DB to
  avoid floating-point bugs (`fee_per_student_paise`, `amount_paise`).
- **Config over hardcoding.** Everyday content (contact, fees, announcements)
  lives in `src/config/site.ts`.
- **Drizzle for schema + types; supabase-js for runtime.** Drizzle defines tables
  and generates migrations & TS types. Runtime data access uses `supabase-js`
  (so RLS + the user session apply automatically).
