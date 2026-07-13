# 03 — Tech Stack & Third-Party Services

Every dependency and external service, what it does, and why it's here.

## Core framework

| Package | Version | Role |
|---------|---------|------|
| `next` | ^16.2.9 | Full-stack React framework (App Router, Server Components, Server Actions, routing, bundling via Turbopack) |
| `react` / `react-dom` | ^19 | UI library |
| `typescript` | ^5.6 | Types. Config is **strict** incl. `noUncheckedIndexedAccess` (array access can be `undefined`) |

## Data & backend

| Package | Version | Role |
|---------|---------|------|
| `@supabase/supabase-js` | ^2.45 | Client for Supabase (Postgres queries, Auth). Respects RLS + session |
| `@supabase/ssr` | ^0.5 | Cookie-based session handling for Server Components / Actions / middleware |
| `drizzle-orm` | ^0.36 | Type-safe schema definitions + inferred TS types |
| `drizzle-kit` | ^0.28 | CLI: generates SQL migrations from the schema |
| `postgres` | ^3.4 | Postgres driver used by the (currently unused) Drizzle runtime client + helper scripts |

> **Division of labour:** Drizzle owns the *schema definition* and *migration
> generation*. Actual runtime reads/writes go through `supabase-js` so that Row
> Level Security and the logged-in user's session apply automatically.

## Forms & validation

| Package | Version | Role |
|---------|---------|------|
| `zod` | ^3.23 | Schema validation. Used on the client (UX) **and** re-run in every Server Action (trust boundary) |
| `react-hook-form` | ^7.53 | Form state management (registration, contact) |
| `@hookform/resolvers` | ^3.9 | Bridges Zod schemas into react-hook-form |

## Styling

| Package | Version | Role |
|---------|---------|------|
| `tailwindcss` | ^4.0 | Utility-first CSS. v4 uses CSS-based config (`@theme` in `globals.css`) |
| `@tailwindcss/postcss` | ^4.0 | PostCSS plugin for Tailwind v4 |
| `clsx` + `tailwind-merge` | — | `cn()` helper in `lib/utils.ts` for conditional, conflict-free class names |
| `prettier-plugin-tailwindcss` | ^0.6 | Auto-sorts Tailwind classes on format |

Brand theme (colors, fonts) is defined in `src/app/globals.css`. See
[Conventions](./10-conventions.md) for the palette.

## Tooling

| Package | Role |
|---------|------|
| `eslint` + `eslint-config-next` | Linting |
| `prettier` | Formatting |
| `@tailwindcss/postcss`, `postcss` | CSS pipeline |

## npm scripts (`package.json`)

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the dev server (http://localhost:3000) |
| `npm run build` | Production build + full TypeScript check |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` (types only) |
| `npm run format` / `format:check` | Prettier write / check |
| `npm run db:generate` | Generate a SQL migration from the Drizzle schema |
| `npm run db:migrate` | Apply Drizzle migrations (needs `DATABASE_URL`) |
| `npm run db:push` | Push schema directly (dev convenience) |
| `npm run db:studio` | Open Drizzle Studio (DB browser) |

## External / third-party services

| Service | Status | Used for | Notes |
|---------|--------|----------|-------|
| **Supabase** | Active | Postgres database, Auth, (future) Storage | The backend. Free tier fine for now. See [Supabase Setup](./08-supabase-setup.md) |
| **Vercel** | Target | Hosting/deploy of the Next.js app | Auto-deploys on push to `main`. See [Deployment](./09-deployment.md) |
| **GitHub** | Active | Source control | Repo: `swarupn17/aivanta` (public) |
| **Razorpay** | Planned | Payments (school fee collection) | Not built yet. Will use order creation + webhook verification |
| **Email/SMTP (Resend or AWS SES)** | Planned | Transactional email (OTP, password reset, notifications) | Required before enabling email confirmation / OTP; Supabase's built-in email is rate-limited (testing only) |

## Not currently used (but referenced)

- **`exceljs`** — intended for native `.xlsx` student imports. The corporate
  proxy blocked its install, so imports are **CSV-first** for now (see
  [Features](./06-features.md)). Adding it later is a one-function change in
  `src/features/students/parse.ts`.
- **`src/lib/db/client.ts`** — a Drizzle runtime client that is not currently
  imported anywhere (the app uses `supabase-js`). Left in place for teams that
  may want to use Drizzle queries directly.

## Environment variables

Validated at startup by `src/lib/env.ts` (Zod). See [Local Setup](./07-local-setup.md)
for the full list and `.env.example` in the repo root.
