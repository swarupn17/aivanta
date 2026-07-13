# Aivanta Scholar Foundation — Developer Documentation

This is the technical reference for the Aivanta platform: a Next.js + Supabase
web application for running the FIA / CIA / AIA school assessments (Classes 1–10)
across India.

> New to the codebase? Read these in order: **Overview → Architecture →
> Local Setup → Supabase Setup**, then dip into Features / Database as needed.

## Contents

| # | Doc | What's inside |
|---|-----|----------------|
| 01 | [Overview](./01-overview.md) | What the product is, who uses it, the core flows |
| 02 | [Architecture](./02-architecture.md) | High-level design, folder layout, request lifecycle |
| 03 | [Tech Stack & Third-Party Services](./03-tech-stack.md) | Every dependency and external service, and why |
| 04 | [Database & Data Model](./04-database.md) | Tables, enums, relationships, migrations |
| 05 | [Authentication & Access Control (RBAC + RLS)](./05-auth-and-rbac.md) | Login, roles, Row-Level Security |
| 06 | [Features & User Flows](./06-features.md) | Registration → approval → login/link → enrolment → admin |
| 07 | [Local Development Setup](./07-local-setup.md) | Get it running on your machine |
| 08 | [Supabase Setup](./08-supabase-setup.md) | Project creation, SQL files, auth config (step by step) |
| 09 | [Deployment](./09-deployment.md) | Shipping to Vercel + production checklist pointer |
| 10 | [Coding Conventions & Patterns](./10-conventions.md) | How we write code here |
| 11 | [Roadmap & Known Gaps](./11-roadmap.md) | What's built, what's next, what to watch out for |

## The 30-second summary

- **Framework:** Next.js 16 (App Router, React 19, Server Components + Server Actions), TypeScript strict.
- **Backend:** Supabase — Postgres (data), Auth (email OTP for schools, email+password for staff), Storage (future), all behind Row-Level Security.
- **Styling:** Tailwind CSS v4 with a "Classic Blue" brand theme + logo orange accent.
- **One codebase** does both frontend and backend (Server Actions are the API layer). No separate backend service.
- **Security model:** the database enforces access via RLS policies keyed on the user's role — the app cannot accidentally leak data it isn't allowed to read.

## Repository map (top level)

```
aivanta/
├── src/                  # All application code (see Architecture)
├── drizzle/              # Generated SQL migrations (schema history)
├── supabase/             # Hand-applied SQL: RLS, seeds, ad-hoc migrations + setup README
├── scripts/              # Dev/ops helper scripts (db check, apply-sql, etc.)
├── public/img/           # Logos + subject images
├── docs/                 # <-- you are here
├── temp/                 # Internal-only (gitignored): PRD, strategy, launch checklist
├── middleware.ts         # Session refresh + route protection
├── package.json          # Scripts + dependencies
└── drizzle.config.ts     # Drizzle Kit config (migrations)
```

> **Internal / non-public material** (PRD, business strategy, the launch
> checklist) lives in `temp/` and is gitignored on purpose. Don't move it into
> `docs/`.
