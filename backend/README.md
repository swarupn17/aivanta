# Aivanta API (Node + Express)

The backend for Aivanta, **split out from the Next.js app**. It owns the
server-side business logic that used to live in Next Server Actions
(`src/features/*/actions.ts`) and exposes it as a small REST API.

Next.js is now the **frontend**; this is the **backend**. They talk over HTTP.

## Why this split preserves your security model

The old app leaned on **Supabase Row-Level Security (RLS)**: the logged-in
user's JWT was passed to Postgres and the database decided what they could
touch. We keep that exactly:

1. The browser already holds a Supabase session (cookie-based, unchanged).
2. For protected calls, the frontend reads the session's **access token** and
   sends it as `Authorization: Bearer <jwt>` (see `src/lib/api.ts`).
3. `requireAuth` (see `src/middleware/auth.ts`) verifies the token and builds a
   **per-request Supabase client that forwards that same token**. Postgres sees
   the real user → RLS applies as before.

The **service-role key** is used _only_ for the two public, unauthenticated
writes (contact + registration leads) — never for user requests, and it never
leaves the server.

## Endpoints

| Method | Path                     | Auth        | Replaces (old action)          |
| ------ | ------------------------ | ----------- | ------------------------------ |
| GET    | `/api/health`            | none        | —                              |
| POST   | `/api/contact`           | none        | `submitContactMessage`         |
| POST   | `/api/registration`      | none        | `submitRegistration`           |
| GET    | `/api/me`                | Bearer JWT  | `getCurrentUser` + `getMySchool` |
| GET    | `/api/students/roster`   | Bearer JWT  | `listRoster`                   |
| POST   | `/api/students/commit`   | Bearer JWT  | `commitEnrolments`             |
| DELETE | `/api/students/:id`      | Bearer JWT  | `removeStudent`                |

## Local setup

> Run these on the machine where you develop/test (your personal laptop).

```bash
cd backend
cp .env.example .env          # then fill in the Supabase values
npm install
npm run dev                    # http://localhost:4000
```

Fill `backend/.env` with the **same** Supabase project as the frontend:

- `SUPABASE_URL` = your `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY` = your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` = your existing service-role key
- `CORS_ORIGIN` = `http://localhost:3000` (the Next dev origin)

And add to the **frontend** `.env.local`:

```
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## Running both apps together

Two terminals (two servers now — that's the tradeoff of the split):

```bash
# terminal 1 — backend
cd backend && npm run dev

# terminal 2 — frontend (repo root)
npm run dev
```

## Smoke test (no frontend needed)

```bash
curl http://localhost:4000/api/health
# {"ok":true,"service":"aivanta-api","supabaseConfigured":true,...}

curl -X POST http://localhost:4000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Asha","email":"a@x.com","role":"Parent","message":"Hello there!"}'
```

For authed routes, grab an access token from the browser (DevTools →
Application → Local Storage → the `sb-*-auth-token` entry → `access_token`) and:

```bash
curl http://localhost:4000/api/students/roster \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Scripts

| Script              | What it does                            |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Watch mode via `tsx`                     |
| `npm run build`     | Compile TypeScript → `dist/`            |
| `npm start`         | Run the compiled server (`dist/`)       |
| `npm run typecheck` | Type-check only, no emit                 |

## What's still in the Next server (phase 2)

The portal's **reads** are still React Server Components calling Supabase
directly (`getCurrentUser`, `getMySchool`, `listRoster`). They work as-is. To
finish the split, swap those for the API (`/api/me`, `/api/students/roster`) —
the endpoints already exist. See `MIGRATION.md` in the repo root for the plan.
