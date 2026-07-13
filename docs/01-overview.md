# 01 — Overview

## What is Aivanta?

Aivanta Scholar Foundation runs three school assessments for **Classes 1–10**:

- **FIA** — Financial Intelligence Assessment (money, savings, banking, economic sense)
- **CIA** — Cyber Intelligence Assessment (internet safety, digital ethics)
- **AIA** — Artificial Intelligence Assessment (AI concepts, ML basics, future thinking)

The platform is the digital home for this: a public marketing site plus a portal
where schools register students, admins manage everything, and (soon) payments,
results and certificates flow.

Fee model: **₹150 per student, per subject** (configurable in `src/config/site.ts`).

## Who uses it (roles)

The platform recognises six roles (see `user_role` enum). Access is enforced by
the database, not just the UI.

| Role | Who | Can do |
|------|-----|--------|
| `super_admin` | Foundation leadership | Everything admins can, plus (future) system-level settings |
| `admin` | Foundation staff | Review/approve school requests, generate school codes, browse & edit all schools/students |
| `school` | A registered school's coordinator | Enrol students, view fees, manage their own roster |
| `coordinator` | Regional agents (future) | Recruit schools, track commissions |
| `student` | A student (future portal) | View own results & certificates |
| `parent` | A parent (future portal) | Track their child |

New sign-ups default to `student`. A school user becomes `school` only after
logging in with an **admin-issued code + their school email + an email OTP**
(see below).

## The core journey (anti-fake-registration by design)

Schools **cannot self-provision** an account. The flow is deliberately gated so
that only real, admin-verified schools get in:

```
1. School submits a REQUEST         (public /registration form -> registration_leads, status: pending)
2. Admin reviews & APPROVES         (/portal/leads) -> a school record is created + the DB assigns a unique 5-digit code
3. Admin shares the CODE            (e.g. 10001) with the school
4. School LOGS IN                   (code + school email + 6-digit email OTP) -> account auto-links, role becomes 'school'
5. School ENROLS students           (/portal/students: CSV import or manual) -> per-subject enrolments + fees
6. (future) School PAYS             (Razorpay) -> enrolments marked paid, roll numbers generated
```

Admins can also browse everything via a hierarchy: **Year → State → District →
City → School → Exams → Class → Students**, with full read/write.

## What exists today vs. later

**Built:** marketing site, auth (school code+email+OTP for schools, email+password
for staff), the full request→approve→login/link→enrol journey, admin schools
browser, lead capture, CSV student import with review/edit.

**Not yet:** payments (Razorpay), hall tickets, results/ranking, certificates,
coordinator portal, email notifications. See
[Roadmap](./11-roadmap.md) and the internal launch checklist in `temp/`.

## Business & product context

Deeper product/business context (PRD, competitive analysis, revenue model) lives
in `temp/olympiad-platform-prd.md` — **internal only, gitignored.** This docs/
folder is intentionally limited to technical/engineering reference.
