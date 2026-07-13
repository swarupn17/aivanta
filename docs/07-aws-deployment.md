# 07 — Deploying to AWS (migrating off Vercel)

This is the step-by-step runbook for moving Aivanta from Vercel to AWS:

- **Frontend (Next.js)** → **S3 + CloudFront + Lambda** via **OpenNext**
- **Backend (Express API)** → **Lambda** ("elastic serverless"), wrapped with
  `serverless-http`
- **Database + Auth** → **unchanged** (still Supabase — nothing to host on AWS)

> ⏱ First deploy: ~1–2 hours. Re-deploys after that: one command, ~3–5 min.

---

## 0. The most important thing to understand first

**Aivanta's frontend is not a static site.** It uses Server Components, Server
Actions (login/OTP, approve lead) and `middleware.ts` (Supabase session refresh
+ `/portal` gating). You **cannot** `next export` it to plain S3 — auth and the
portal would break.

The correct way to get "S3 + CloudFront" for a *dynamic* Next app is
**[OpenNext](https://opennext.js.org)**, which splits the build into:

| Piece | Runs on |
|-------|---------|
| Static assets (`/_next/static`, images, public/) | **S3**, served via **CloudFront** |
| SSR / React Server Components / Server Actions | **Lambda** (the "server function") |
| `next/image` optimization | **Lambda** |
| `middleware.ts` | Lambda (or Lambda@Edge) |
| Routing + caching glue | **CloudFront** |

We orchestrate all of this with **[SST v3](https://sst.dev)**, which wraps
OpenNext + CloudFront + S3 + Lambda + ACM + Route 53 into one `sst.config.ts`.
Hand-rolling OpenNext output into raw CloudFront + Lambda@Edge is possible but
brutal and error-prone — SST is the sane path and produces the exact same AWS
resources. (A manual outline is in the appendix if you insist.)

### Target architecture

```
                         ┌───────────────────────────── AWS ─────────────────────────────┐
   Browser ──HTTPS──▶ CloudFront (aivanta.com)                                            │
                         │   ├─ /_next/static/*, /img/*  ─▶ S3 bucket (static assets)      │
                         │   └─ everything else          ─▶ Lambda  (Next server: SSR,     │
                         │                                   Server Actions, middleware)   │
                         │                                                                 │
   Browser ──HTTPS──▶ API Gateway (api.aivanta.com) ─▶ Lambda (Express via serverless-http)│
                         └─────────────────────────────────────────────────────────────────┘
                                       │                         │
                                       └──────────┬──────────────┘
                                                  ▼
                                       Supabase (Postgres + Auth + RLS)   ← unchanged
```

Auth cookies are set by the **Next server Lambda** (Supabase SSR). The browser
calls the **Express Lambda** directly with a `Bearer` token (see `src/lib/api.ts`),
so RLS is preserved exactly as today.

---

## 1. Prerequisites (one-time)

1. **AWS account** with billing set up.
2. **AWS CLI** installed and configured with an IAM user/role that can create
   S3/CloudFront/Lambda/IAM/ACM/Route 53 resources (admin access is easiest for
   the first deploy; tighten later).
   ```bash
   aws configure           # access key, secret, default region (e.g. ap-south-1)
   aws sts get-caller-identity   # confirm you're authenticated
   ```
3. **Node 20+** and **pnpm/npm** locally.
4. Your **domain**. Easiest if it's in **Route 53** (SST auto-manages DNS + certs).
   If it's registered elsewhere (GoDaddy/Namecheap), you can either delegate the
   domain to a Route 53 hosted zone, or manage DNS records manually (covered in §7).
5. Your **Supabase keys** handy (URL, anon key, service-role key).

> **Region note:** deploy everything in one region close to your users
> (`ap-south-1` = Mumbai is ideal for India). CloudFront is global regardless.
> **ACM certificates for CloudFront MUST live in `us-east-1`** — SST handles this
> for you automatically.

---

## 2. One-time code changes

These are the only source changes needed. Two small files.

### 2a. Backend: add a Lambda handler

Your Express app already separates `createApp()` (in `backend/src/app.ts`) from
`app.listen()` (in `backend/src/index.ts`). That makes this trivial — we reuse
`createApp()` and wrap it for Lambda. `index.ts` stays for local `npm run dev`.

Install the wrapper:
```bash
cd backend
npm install serverless-http
npm install --save-dev @types/aws-lambda
```

Create `backend/src/lambda.ts`:
```ts
import serverless from "serverless-http";
import { createApp } from "./app";

// API Gateway / Lambda entrypoint. Reuses the exact same Express app as local
// dev — only the transport changes (HTTP server → Lambda invocation).
export const handler = serverless(createApp());
```

That's it for the backend. `env.ts` already reads `process.env`, which Lambda
populates from the function's environment variables (set in §4).

### 2b. Frontend: nothing required

OpenNext handles the Next build itself — **do not** add `output: "export"` or
`output: "standalone"` to `next.config.ts` (either would break OpenNext). Leave
`next.config.ts` as-is. Your `images.remotePatterns` for `*.supabase.co` is fine.

---

## 3. Add SST to the repo

From the **repo root**:
```bash
npx sst@latest init
```
Choose the **Next.js** preset when prompted. This creates `sst.config.ts` and
adds SST to `package.json`. Then replace `sst.config.ts` with the config below
(adjust names/domains):

```ts
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aivanta",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: { aws: { region: "ap-south-1" } },
    };
  },
  async run() {
    // ---- Secrets (set via `npx sst secret set ...`, never commit these) ----
    const supabaseUrl = new sst.Secret("SupabaseUrl");
    const supabaseAnon = new sst.Secret("SupabaseAnonKey");
    const supabaseServiceRole = new sst.Secret("SupabaseServiceRoleKey");

    const isProd = $app.stage === "production";
    const rootDomain = "aivanta.com";
    const webDomain = isProd ? rootDomain : `${$app.stage}.${rootDomain}`;
    const apiDomain = isProd ? `api.${rootDomain}` : `api-${$app.stage}.${rootDomain}`;

    // ---- Backend: Express on Lambda behind API Gateway (custom domain) ----
    const api = new sst.aws.ApiGatewayV2("Api", {
      domain: apiDomain,
    });
    api.route("$default", {
      handler: "backend/src/lambda.handler",
      runtime: "nodejs20.x",
      environment: {
        SUPABASE_URL: supabaseUrl.value,
        SUPABASE_ANON_KEY: supabaseAnon.value,
        SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRole.value,
        CORS_ORIGIN: `https://${webDomain}`,
        ACADEMIC_YEAR: "2025-26",
      },
    });

    // ---- Frontend: Next.js via OpenNext → S3 + CloudFront + Lambda ----
    const web = new sst.aws.Nextjs("Web", {
      path: ".",
      domain: { name: webDomain },
      environment: {
        // NEXT_PUBLIC_* are inlined at BUILD time — must be present here.
        NEXT_PUBLIC_SUPABASE_URL: supabaseUrl.value,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnon.value,
        NEXT_PUBLIC_SITE_URL: `https://${webDomain}`,
        NEXT_PUBLIC_API_URL: `https://${apiDomain}`,
        // Server-only (used by src/lib/supabase/admin.ts in Server Actions):
        SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRole.value,
      },
    });

    return { web: web.url, api: api.url };
  },
});
```

> **SST versions drift.** Component names (`sst.aws.Nextjs`, `sst.aws.ApiGatewayV2`)
> are stable, but if a property errors, check the current
> [SST docs](https://sst.dev/docs/component/aws/nextjs/). The *concepts* above
> don't change.

---

## 4. Set secrets

Never hard-code Supabase keys. Set them per stage:
```bash
npx sst secret set SupabaseUrl              "https://YOURPROJECT.supabase.co"       --stage production
npx sst secret set SupabaseAnonKey          "eyJ...ANON..."                          --stage production
npx sst secret set SupabaseServiceRoleKey   "eyJ...SERVICE_ROLE..."                  --stage production
```
(Repeat with `--stage dev` if you want a separate staging environment.)

---

## 5. Deploy

Deploy a **staging** stage first to smoke-test, before you touch the real domain:
```bash
npx sst deploy --stage dev
```
SST prints the CloudFront URL + API URL. Open the CloudFront URL and test:

- Marketing pages load
- `/registration` submits (hits the API Lambda → Supabase lead)
- `/login` → **Staff** tab (password) and **School** tab (code + email + OTP)
- `/portal` gates correctly and shows role-aware cards

When happy, deploy production:
```bash
npx sst deploy --stage production
```

---

## 6. Wire up domains, CORS & Supabase

### 6a. CORS
Because the browser calls `api.aivanta.com` from `aivanta.com` (cross-origin),
the API must allow it. That's already handled — `CORS_ORIGIN` is set to the web
domain in `sst.config.ts`, and `backend/src/app.ts` reads it. 

> **Want zero CORS instead?** Serve the API under the *same* domain
> (`aivanta.com/api/*`) using an `sst.aws.Router` with two routes (S3/Next +
> API). Then set `NEXT_PUBLIC_API_URL=/api`. Slightly more config; eliminates
> CORS entirely. Optional — the subdomain approach is simpler to start.

### 6b. Supabase Auth URLs (don't skip — OTP/redirects break otherwise)
In Supabase → **Authentication → URL Configuration**:
- **Site URL** → `https://aivanta.com`
- **Redirect URLs** → add `https://aivanta.com/**` (and your staging domain)

This keeps the magic-link/`/auth/confirm` and OTP flows pointing at the new host.

---

## 7. DNS cutover from Vercel (the actual migration moment)

Until now, nothing user-facing changed — Vercel still serves `aivanta.com`. Cut
over when your AWS staging tests pass.

**If your domain is in Route 53:** SST already created the A/AAAA alias records
to CloudFront when you deployed with `domain`. Nothing to do — it's live once DNS
propagates.

**If DNS is elsewhere (GoDaddy/Namecheap/Cloudflare):**
1. In the AWS Console → CloudFront, copy your distribution domain
   (`dxxxx.cloudfront.net`).
2. At your registrar, change the `aivanta.com` record:
   - Remove the Vercel record (`cname.vercel-dns.com` / Vercel A record).
   - Add a `CNAME` (or ALIAS/ANAME at apex) → your CloudFront domain.
   - Add `api` → your API Gateway domain (SST prints it).
3. Lower the TTL to 300s a day *before* cutover so changes propagate fast.
4. Wait for propagation (minutes to a couple hours), verify HTTPS + the site.

> Certificates: SST provisions and validates ACM certs automatically (via DNS).
> If DNS is external, SST will output the validation CNAME records you must add
> at your registrar — add them or cert issuance hangs.

---

## 8. Decommission Vercel

Only after AWS is serving traffic and verified for ~24–48h:
1. Remove the custom domain from the Vercel project.
2. Pause/delete the Vercel project.
3. Remove Vercel-specific env vars/integrations if any.
4. Keep the Vercel project *paused* (not deleted) for a week as a rollback net.

---

## 9. Gotchas checklist (Aivanta-specific)

- [ ] **`NEXT_PUBLIC_*` are build-time.** They must be in SST's `environment`
      for the `Nextjs` component, not just at runtime. Already handled above.
- [ ] **`SUPABASE_SERVICE_ROLE_KEY` on the Next server Lambda.** Server Actions
      (`approveLead`, `requestSchoolOtp`) use `src/lib/supabase/admin.ts`. Set it
      (done above). Never expose it as `NEXT_PUBLIC_`.
- [ ] **Auth cookies over CloudFront.** OpenNext configures the CloudFront cache
      policy to forward cookies/headers to the server function and *not* cache
      authenticated responses — so Supabase SSR sessions work. This is automatic
      with SST/OpenNext; just don't override the cache behavior manually.
- [ ] **Lambda cold starts.** First request after idle is slower (~0.5–1.5s).
      Fine for this app. If it bothers you later, enable provisioned concurrency.
- [ ] **API Gateway payload limit ~10MB.** Your CSV roster upload posts JSON;
      Express is capped at 2MB (`app.ts`), well under the limit. 
- [ ] **Region for ACM/CloudFront cert = `us-east-1`.** SST handles it; just
      don't be surprised to see a us-east-1 cert while everything else is in
      ap-south-1.
- [ ] **Run the DB migration** `supabase/06_school_code_sequence.sql` on the
      Supabase project this deploy points at (it's Supabase-side, not AWS).
- [ ] **Resend SMTP** for OTP lives in Supabase's dashboard — unaffected by the
      AWS move.

---

## 10. Cost estimate (rough, low traffic)

Supabase is separate (its own plan). On AWS, at early-stage traffic you're
largely inside the free tier / single-digit dollars:

| Service | Ballpark/mo |
|---------|-------------|
| S3 (static assets) | < $1 |
| CloudFront | ~$1–5 (first 1TB egress cheap; free tier covers a lot) |
| Lambda (Next server + API) | ~$0–5 (scales to zero; free tier = 1M req) |
| API Gateway | ~$1 per million requests |
| Route 53 | $0.50 per hosted zone + tiny query cost |
| ACM certs | **free** |

**Realistically ~$3–15/month** at your stage, and it *scales to zero* when quiet
(unlike a Lightsail box). Costs grow with traffic, not with idle time.

---

## 11. Re-deploys & CI/CD (optional)

Day-to-day, a deploy is just:
```bash
npx sst deploy --stage production
```

To auto-deploy on push to `main`, add a GitHub Actions workflow that configures
AWS credentials (prefer **OIDC role assumption** over long-lived keys) and runs
`npx sst deploy --stage production`. Ask and I'll scaffold `.github/workflows/deploy.yml`.

---

## Appendix — manual (no-SST) path, if you really want raw control

1. `npx open-next@latest build` → produces `.open-next/` with `assets/`,
   `server-function/`, `image-optimization-function/`, `middleware/`.
2. Upload `.open-next/assets/*` to an **S3** bucket.
3. Create **Lambda** functions from `server-function` (+ image + middleware).
4. Create a **CloudFront** distribution with behaviors:
   - `/_next/static/*`, static files → S3 origin (long cache)
   - default `*` → server Lambda (via Lambda Function URL origin, no cache)
5. Wrap `backend` with `serverless-http` (as in §2a), deploy as its own Lambda +
   API Gateway HTTP API.
6. Provision an **ACM** cert in `us-east-1`, attach to CloudFront; point **Route
   53** at the distribution.

This is exactly what SST automates. Unless you have a hard requirement to own
every resource by hand, use §3–§7.
