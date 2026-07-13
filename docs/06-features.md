# 06 — Features & User Flows

Each feature maps to a folder under `src/features/` (logic) plus routes under
`src/app/` (pages) and components under `src/components/`.

---

## 1. Marketing site (public)

Routes under `(marketing)`: home `/`, `/about`, `/assessments`, `/syllabus`,
`/publications`, `/social-welfare`, `/viksit-bharat`, `/contact`,
`/registration`, `/privacy`, `/terms`.

- Content source: `src/config/site.ts` (org, contact, fees, announcements) and
  `src/config/navigation.ts` (menus).
- Syllabus data: `src/features/syllabus/data.ts` (large generated dataset),
  rendered by `SyllabusExplorer`.
- Notable components: `HeroCarousel`, `Ticker`, `PageHeader`, `CTABand`,
  `AnimatedCounter`, `Reveal` (scroll animation).

## 2. Contact form

- Schema/action: `src/features/contact/{schema,actions}.ts`
- Component: `components/marketing/ContactForm.tsx`
- Flow: validated client-side (Zod) → `submitContact` Server Action re-validates →
  inserts a `contact_messages` row via the service-role client. Admins read these
  on `/portal/leads`.

## 3. School registration = a code request (SOF-style)

Schools do **not** create accounts here — they submit a request.

- Schema: `src/features/registration/schema.ts`
- Action: `src/features/registration/actions.ts` → `submitRegistration`
- Component: `components/marketing/RegistrationForm.tsx` (route `/registration`)
- Fields (three groups):
  - **Your details:** Are you (Principal/Teacher/Parent/Student/Other), Name,
    Email, Mobile (10-digit)
  - **School:** Name, Address, City, District, State, Country, Pincode, School
    Email, School Phone
  - **Principal:** Name, Contact
- Result: a `registration_leads` row (`status: pending`). No subjects/fees here —
  those come later in the portal.

## 4. Admin: review & approve requests

- Page: `app/(portal)/portal/leads/page.tsx` (admin-gated)
- Queries: `features/schools/queries.ts` (`listRegistrationLeads`,
  `listContactMessages`)
- Actions: `features/schools/actions.ts`
  - `approveLead(id)` — creates a `schools` row (auto-filled from the request,
    `status: approved`); the DB assigns a unique, **incremental 5-digit**
    `school_code` via the `next_school_code()` sequence default. Marks the lead
    approved and returns the code to display/copy.
  - `rejectLead(id)`
- Component: `components/portal/LeadRow.tsx` (approve/reject buttons + reveals the
  generated code with a Copy button).

## 5. School: log in with code + email + OTP

Linking is folded into login — no separate "claim" step.

- Component: `components/auth/LoginForm.tsx` (School tab: code + email → OTP)
- Actions: `features/auth/actions.ts` → `requestSchoolOtp`, `verifySchoolOtp`
- Linker: `features/schools/link.ts` → `linkSchoolByCodeEmail` (plain server
  module, not a callable action)
- Effect: verifies code+email against an approved school, sends a 6-digit OTP,
  and on verification binds the school to the user and elevates their role to
  `school`.

## 6. School: enrol students (CSV import + manual)

- Page: `app/(portal)/portal/students/page.tsx`
- Parser: `features/students/parse.ts` (`parseCsv`, `templateCsv`) — CSV-first,
  zero-dependency, Excel users "Save As CSV"
- Actions: `features/students/actions.ts`
  - `parseStudentsCsv(text)` — returns a validated preview (saves nothing)
  - `commitEnrolments(rows)` — inserts `students` + per-subject `enrollments`
    (draft/unpaid) via the session client (RLS enforces ownership)
  - `removeStudent(id)`
- Queries: `features/students/queries.ts` (`listRoster`, `summarise` for
  classwise/examwise counts + fee total)
- Components: `StudentUploader.tsx` (download template, upload, editable preview
  with per-row OK/error, subject toggles, manual add, live fee, confirm),
  `RemoveStudentButton.tsx`

### The staged upload pipeline
`Download template → Upload CSV → server parses + validates → editable preview
(add/remove/toggle, manual add) → Confirm → students + enrolments saved`.
Nothing is written until Confirm, and the server re-validates on commit.

## 7. Admin: schools hierarchy browser (read-write)

- List page: `app/(portal)/portal/admin/schools/page.tsx`
  - Cascading **Year → State → District → City** filters (state lives in the URL,
    picking a level resets those below). Filtering + distinct options computed in
    `features/schools/admin.ts` (`getAdminSchools`, `applyFilters`,
    `filterOptions`).
  - Component: `components/portal/SchoolFilters.tsx`
- Detail page: `app/(portal)/portal/admin/schools/[id]/page.tsx`
  - Editable school info (`SchoolEditForm.tsx` → `adminUpdateSchool`)
  - Fee/exam summary + classwise table (reuses students `summarise`)
  - Full student read-write (`AdminStudentTable.tsx`): toggle each student's
    FIA/CIA/AIA, remove, add — via `admin-actions.ts`
    (`adminToggleEnrolment`, `adminRemoveStudent`, `adminAddStudent`).
- All admin writes go through the session client; RLS's `is_admin()` authorizes
  them.

## 8. Portal dashboard (role-aware)

- Page: `app/(portal)/portal/page.tsx`
- Shows different action cards per role. Admins get "Review requests" + "Schools";
  schools get "Enrol students". (Schools reach the portal already linked — linking
  now happens during login, so there's no on-dashboard claim card.)

---

## Feature → file quick index

| Feature | Logic (`features/`) | Pages (`app/`) | Key components |
|---------|---------------------|----------------|----------------|
| Auth | `auth/` | `(auth)/login` | `auth/LoginForm` |
| Contact | `contact/` | `(marketing)/contact` | `marketing/ContactForm` |
| Registration | `registration/` | `(marketing)/registration` | `marketing/RegistrationForm` |
| Approve/link | `schools/` (actions, link, queries) | `(portal)/portal/leads` | `portal/LeadRow` |
| Student enrol | `students/` | `(portal)/portal/students` | `portal/StudentUploader`, `portal/RemoveStudentButton` |
| Admin browser | `schools/` (admin, admin-actions) | `(portal)/portal/admin/schools[/id]` | `portal/SchoolFilters`, `portal/SchoolEditForm`, `portal/AdminStudentTable` |
