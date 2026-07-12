# Migration: Next.js monolith → Next (frontend) + Node (backend)

This repo used to be a single Next.js app where the "backend" was **Server
Actions** and **Server Components** talking to Supabase. We've split the backend
into a standalone **Node + Express** service under [`/backend`](./backend).

## What changed (phase 1 — done)

### New: `/backend` (Node + Express + Supabase)

A small REST API that owns the server-side logic. Auth is preserved by
forwarding the caller's Supabase JWT so **RLS still enforces everything**
(details in [`backend/README.md`](./backend/README.md)).

### Frontend rewired to call the API

| Area           | Before (Server Action)                    | After                                        |
| -------------- | ----------------------------------------- | -------------------------------------------- |
| Contact form   | `features/contact/actions.ts`             | `features/contact/api.ts` → `POST /api/contact` |
| Registration   | `features/registration/actions.ts`        | `features/registration/api.ts` → `POST /api/registration` |
| Student commit | `features/students/actions.ts`            | `features/students/api.ts` → `POST /api/students/commit` |
| Remove student | `features/students/actions.ts`            | `features/students/api.ts` → `DELETE /api/students/:id` |
| CSV parse      | `parseStudentsCsv` (Server Action)        | `parseCsv` called **directly in the browser** (it's pure) |

Supporting additions:

- `src/lib/api.ts` — browser → API client; attaches the Supabase bearer token
  for authed calls and normalizes results to `{ ok } | { ok:false, error }`.
- `NEXT_PUBLIC_API_URL` — new env var (defaults to `http://localhost:4000`).

Deleted (now dead): the three `features/*/actions.ts` files above.

### Tooling guards

`backend/` is excluded from the frontend's `tsconfig`, ESLint, and Prettier —
it has its own toolchain in `backend/`.

## What's NOT changed (phase 2 — TODO)

The portal's **reads** are still React Server Components hitting Supabase
directly. They keep working because the browser still has a Supabase session:

- `features/auth/queries.ts` → `getCurrentUser`
- `features/schools/queries.ts` → `getMySchool`, `listRegistrationLeads`, `listContactMessages`
- `features/students/queries.ts` → `listRoster`, `summarise`
- `features/schools/actions.ts`, `admin-actions.ts` (claim school, admin ops)

The API endpoints for the main reads already exist (`GET /api/me`,
`GET /api/students/roster`). To finish the split:

1. Make the portal pages Client Components (or keep them server components but
   `fetch` the API with the token) and call `/api/me` + `/api/students/roster`.
2. Port `features/schools/actions.ts` + `admin-actions.ts` into new backend
   routes (`/api/schools/*`), mirroring the students pattern.
3. Move the `summarise` fee helper into the backend (or a shared package) so the
   API can return the fee summary too.
4. Once nothing in `src/` imports Supabase for data, you can drop the
   server-only Supabase/Drizzle wiring from the Next app.

## Auth still relies on cookies (by design)

Login/logout (`features/auth/actions.ts`) stays in the Next app: it uses the
Supabase SSR cookie flow. The browser session is the source of truth; the API
just reads the token from it. **No auth emails are triggered by the backend.**

## Running locally

```bash
# terminal 1 — backend
cd backend && cp .env.example .env   # fill in Supabase values
npm install && npm run dev           # :4000

# terminal 2 — frontend (repo root)
# add NEXT_PUBLIC_API_URL=http://localhost:4000 to .env.local
npm run dev                          # :3000
```
