# Aivanta Scholar Foundation — Platform

Production codebase for **Aivanta Scholar Foundation (ASF)** — a national student
awareness initiative running annual assessments in **Financial Intelligence (FIA)**,
**Cyber Intelligence (CIA)** and **Artificial Intelligence (AIA)** for Classes 1–10,
aligned with Viksit Bharat 2047.

This is a **single Next.js app** serving both the frontend and the backend
(App Router + Server Actions + Route Handlers), backed by **Supabase**.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | One deployable for FE + BE |
| Language | **TypeScript** (strict) | Type safety across the whole stack |
| Styling | **Tailwind CSS v4** | Brand tokens via `@theme`; utility-first |
| Auth | **Supabase Auth** | Native OTP + Row-Level Security for RBAC |
| Database | **Supabase Postgres** | Managed Postgres + Storage + Realtime |
| DB access | **Drizzle ORM** | Type-safe queries + in-repo migrations |
| Forms | **react-hook-form + Zod** | Client UX + server-side re-validation |
| Deploy | **Vercel** (target) | Zero-config Next.js hosting |

> **Design note:** Supabase provides Auth, Storage and Realtime, so we lean on
> those instead of bolting on a second auth system. Drizzle handles typed SQL and
> migrations against the same Postgres.

---

## Project structure

```
src/
  app/
    layout.tsx              # root layout (fonts, metadata)
    globals.css             # Tailwind v4 @theme brand tokens + component CSS
    (marketing)/            # public site — shared header/footer layout
      layout.tsx
      page.tsx              # homepage
      about/ assessments/ syllabus/ viksit-bharat/
      social-welfare/ publications/ registration/ contact/
      privacy/ terms/
  components/
    layout/                 # Header, Footer, LanguageToggle
    marketing/              # HeroCarousel, Ticker, PageHeader, CTABand,
                            #   ContactForm, RegistrationForm, SyllabusExplorer …
    ui/                     # Container, Reveal, AnimatedCounter, form primitives
  config/
    site.ts                 # ← EDIT HERE: org, contact, social, fees, notices
    navigation.ts           # header + footer nav (single source of truth)
  features/                 # business logic per domain (schema + server actions)
    contact/  registration/  syllabus/
  lib/
    env.ts                  # zod-validated env (safe when Supabase not yet set up)
    utils.ts                # cn() class merger
    supabase/               # browser + server + middleware clients
    db/                     # Drizzle client + schema/ (modular tables)
middleware.ts               # refreshes Supabase session, guards /portal
drizzle/                    # generated migrations (committed)
legacy/                     # the old static HTML site (reference only)
temp/                       # INTERNAL ONLY — gitignored (PRDs, brand art, source dumps)
```

---

## Getting started

```bash
# 1. Install deps
npm install

# 2. (Optional now) configure Supabase — the marketing site runs WITHOUT this.
cp .env.example .env.local
#   fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#   SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL

# 3. Run the dev server
npm run dev            # http://localhost:3000
```

> The app is **zero-config**: without Supabase env vars the public site runs fine;
> auth/DB features light up automatically once you add the keys.

### Useful scripts

| Script | Does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (type-check + lint) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier write |
| `npm run db:generate` | Generate a Drizzle migration from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Drizzle Studio (DB browser) |

---

## Edit everyday content in ONE place

`src/config/site.ts` holds org name, contact details, social links, fees, and the
homepage notice ticker. `src/config/navigation.ts` holds the menu. No need to touch
page components for routine content updates.

---

## How the "backend" works (Next.js as backend)

Forms submit to **Server Actions** (`src/features/*/actions.ts`) that:

1. re-validate input with the shared Zod schema (never trust the client),
2. compute authoritative values server-side (e.g. registration fees),
3. (next step) persist via Supabase/Drizzle and trigger notifications.

The trust boundaries and data model (`src/lib/db/schema/`) are already in place,
so wiring persistence + payments is incremental, not a rewrite.

---

## Roadmap (per PRD)

- **Now:** public site , contact + registration Server Actions  (persistence TODO)
- **Next:** Supabase Auth (OTP) + `/portal` for schools/students/coordinators/admin
- **Then:** payments (Razorpay), hall tickets & certificates (PDF jobs), results engine

See `temp/olympiad-platform-prd.md` (internal) for the full plan.

---

## Brand

"Classic Blue" trust palette - minimalist, elegant, instantly trust-building:

- Primary  Navy `#0D3B66`
- Accent   Dusty blue `#7F9DB1` (labels use a darker `#4A6884` for AA contrast)
- Soft     Sky blue `#B4D6E3`
- Fonts: Poppins (display) + Inter (body)
- Subtle blue gradient hairline across the top (calm, not busy)
