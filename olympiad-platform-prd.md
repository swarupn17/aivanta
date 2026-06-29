# Product Requirements Document (PRD)
## Olympiad Platform -- End-to-End Academic Competition Management System

**Version:** 1.1  
**Date:** June 2026  
**Status:** Draft  
**Reference Sites:** SOF World (sofworld.org), SilverZone (silverzone.org)  
**Note:** Consolidates the earlier *Requirements Analysis* and *PRD* into a single source of truth.

---

## 1. Executive Summary

This document defines the product requirements for building an academic olympiad platform that enables schools, students, and coordinators to participate in competitive examinations across multiple subjects and grade levels. The platform is modeled after market leaders SOF World and SilverZone, which collectively serve 99,000+ schools and 80+ million students.

The platform is a four-sided marketplace connecting:
- **Schools** (B2B registration and fee payment)
- **Students** (exam participation, results, certificates)
- **Coordinators** (school recruitment agents)
- **Content Partners** (study material and book publishers)

### 1.1 Business Model & Revenue Layers

| Layer | Description |
|---|---|
| **B2B (primary revenue)** | Schools pay per-student registration fees (e.g. ~INR 170/student) |
| **B2C (secondary revenue)** | Sell prep books, sample papers, workbooks, online classes |
| **Coordinator network** | Freelance regional coordinators recruit schools, earn commission |
| **Certifications & awards** | Certificates, medals, trophies -- upsell and prestige driver |
| **Scholarship programs** | Social-credibility layer (girl child, defence, merit-based) |
| **International expansion** | Licensing / franchise model for other countries |

---

## 2. Goals & Objectives

| Goal | Description |
|---|---|
| Launch MVP in 3 months | Public website + school registration + payment + hall tickets |
| Onboard 1,000 schools in Year 1 | Via coordinator network + direct marketing |
| Support 5+ exam types at launch | Math, Science, English, GK, Computer Science |
| Generate revenue from Day 1 | Per-student registration fees + study material sales |
| Scale to 1M+ students in Year 3 | Infrastructure must support exam-day traffic spikes |

---

## 3. Target Users & Personas

### 3.1 School Admin / Principal
- Registers school on the platform
- Enrolls students across multiple exams
- Pays registration fees in bulk
- Downloads hall tickets and distributes results

### 3.2 Student (Age 6-18, Classes 1-12)
- Participates in olympiad exams (offline at school)
- Checks results and rankings online
- Downloads certificates and rank cards
- Accesses free/paid study material

### 3.3 Parent
- Tracks child's exam registrations and results
- Receives notifications about exam dates and results
- Purchases study material

### 3.4 Regional Coordinator
- Recruits schools in an assigned territory
- Manages school pipeline (contacted > registered > paid)
- Earns commission on successful registrations

### 3.5 Platform Admin
- Manages all schools, exams, questions, results, coordinators
- Controls content, announcements, fee structures
- Accesses analytics and financial reports

### 3.6 Primary User Flows

```
School Admin
  Registers school -> enrolls students -> pays fees -> downloads hall tickets -> views results

Student
  Gets hall ticket via school -> appears in exam -> checks results -> downloads rank card + certificate

Coordinator
  Applies -> gets territory -> recruits schools -> tracks commissions -> requests payout

Super Admin
  Manages all schools, exams, coordinators, content, payments, analytics
```

---

## 4. Scope

### In Scope (Phase 1-3)
- Public marketing website
- School registration and management portal
- Student enrollment and management
- Multi-exam registration with fee payment
- Hall ticket / admit card generation
- Results and ranking engine (offline OMR-based)
- Certificate and rank card PDF generation
- Coordinator portal
- Admin CMS and dashboard
- Email and SMS notifications
- Study material downloads (free)

### In Scope (Phase 4+)
- Online exam engine (browser-based)
- Mobile apps (student + school)
- E-commerce store (books, courses)
- Parent dashboard
- International exam support
- AI-powered practice tests

### Out of Scope
- Live proctoring
- Video-based assessments
- School ERP integrations

---

## 5. Feature Requirements

---

### 5.1 Public Website

**Priority: P0 -- Must have at launch**

| Feature | Description |
|---|---|
| Homepage | Stats, featured exams, testimonials, news, CTA |
| Exam landing pages | Per-exam page with About, Syllabus, Dates, Awards, FAQ |
| Syllabus pages | Class-wise syllabus per exam (SEO-optimized, Google-indexed) |
| Sample paper downloads | Free PDFs per exam per class per year |
| Results page | Link to result portal + answer key downloads |
| News & announcements | Blog/news section managed by admin |
| Toppers showcase | Hall of Fame with photos and names of top rankers |
| Scholarship pages | Program details for merit, girl child, defence scholarships |
| Contact & FAQ | Support channels, office locations |
| School locator | Search registered schools by city/state |
| SEO metadata | Title, description, structured schema per page |
| WhatsApp button | Float button for quick school/coordinator contact |

---

### 5.2 School Registration & Management

**Priority: P0**

| Feature | Description |
|---|---|
| School self-registration | Form: name, address, board (CBSE/ICSE/State), affiliation no., contact person |
| Admin approval workflow | Admin reviews and approves/rejects with reason |
| School profile management | Edit school details, update contact info |
| Multi-exam enrollment | School selects exams to participate in per academic year |
| Student bulk upload | CSV/Excel import with validation (duplicates, class mismatch) |
| Manual student enrollment | Add students one-by-one |
| Fee calculation engine | Auto-calculates: no. of students x fee per exam |
| School dashboard | Shows: enrolled students, pending payments, hall ticket status, results |
| Annual renewal | Re-enroll for next academic year with carry-forward option |
| School coordinator link | Associate a regional coordinator with a school |

**Acceptance Criteria:**
- School can register in under 10 minutes
- CSV import processes up to 500 students per file without timeout
- Fee calculation updates in real-time on student selection

---

### 5.3 Student Management

**Priority: P0**

| Feature | Description |
|---|---|
| Student profile | Name, class/grade, section, DOB, parent name, contact |
| Unique roll number | Auto-generated per student per exam per year |
| Exam eligibility check | Validate student class against exam eligibility rules |
| Student transfer | Move student between schools within the platform |
| History tracking | Store student performance across multiple exam years |
| Photo upload | Optional photo for hall ticket generation |

---

### 5.4 Payment & Fee Management

**Priority: P0**

| Feature | Description |
|---|---|
| Payment gateway | Razorpay (primary), PayU (fallback) -- UPI, cards, net banking |
| Offline payment | Bank transfer + manual payment confirmation by admin |
| Invoice/receipt PDF | Auto-generated on successful payment |
| GST-compliant billing | 18% GST on registration fees with proper invoice format |
| Fee refund workflow | Admin-initiated refund with reason logging |
| Coordinator commission | Configurable commission % per school registration, tracked per coordinator |
| Payout requests | Coordinator requests payout; admin approves and marks paid |
| Payment reconciliation | Admin dashboard showing collected vs. expected fees |
| Partial payment | Optional: allow schools to pay for partial batches |

**Acceptance Criteria:**
- Payment gateway supports transactions up to INR 5,00,000 per transaction
- Invoice PDF generated within 10 seconds of payment confirmation
- Commission calculated automatically on payment confirmation

---

### 5.5 Hall Ticket / Admit Card Generation

**Priority: P0**

| Feature | Description |
|---|---|
| Auto-generation trigger | Triggered automatically after fee payment confirmation |
| Hall ticket content | Student name, photo, roll no., class, exam name, date, exam center, QR code |
| Bulk PDF generation | Generate all hall tickets for a school in one ZIP download |
| Individual download | Student/school can download individual hall ticket |
| Email/WhatsApp delivery | Auto-send hall ticket to school email on generation |
| Duplicate download | Regenerate with OTP verification |
| QR code | Links to student profile for exam-day verification |

**Acceptance Criteria:**
- Bulk generation of 500 hall tickets completes in under 60 seconds
- Hall ticket PDF renders correctly on mobile and print

---

### 5.6 Exam Management System

**Priority: P0 for scheduling; P1 for online mode**

| Feature | Description |
|---|---|
| Exam catalog | Create and manage exam types (name, subjects, eligible classes) |
| Exam schedule | Set multiple exam dates per exam type per year |
| Level configuration | Level 1 (all students), Level 2 (top X% qualifiers only) |
| Question bank | Upload questions by: exam, class, subject, chapter, difficulty |
| Question types | MCQ (single correct), true/false, fill-in-the-blank |
| Image support | Support images/diagrams within question body |
| Question paper generation | Select N questions per class per difficulty level |
| OMR answer sheet | Generate printable OMR sheets per exam |
| Answer key upload | Admin uploads correct answers post-exam |
| Online exam mode (Phase 4) | Timed, browser-locked, auto-submit exam interface |

---

### 5.7 Results & Ranking Engine

**Priority: P1**

| Feature | Description |
|---|---|
| OMR data input | Admin uploads OMR scan data (CSV format) |
| Auto-scoring | Compare student responses against answer key |
| Negative marking | Configurable per exam (0 or -0.25 per wrong answer) |
| Rank computation | Compute ranks at: school, city, zone, state, national, international levels |
| Cutoff calculation | Zone/state-wise Level 1 cutoff for Level 2 qualification |
| Tie-breaking logic | Configurable: higher marks in specific section > higher class score |
| Results publication | Date-controlled go-live for results |
| Answer key challenge | Window for students to dispute answer keys with admin review |
| Re-evaluation request | Fee-based re-evaluation request workflow |

**Acceptance Criteria:**
- Rank computation for 500,000 students completes in under 5 minutes
- Results page loads in under 2 seconds per student

---

### 5.8 Certificates & Awards

**Priority: P1**

| Feature | Description |
|---|---|
| Certificate types | Participation, Merit (Bronze/Silver/Gold), School Excellence |
| Bulk PDF generation | Generate all certs for an exam in background job |
| Digital verification | QR code on cert links to verification URL |
| Rank card PDF | Per-student detailed score and rank breakdown |
| Certificate download | Student/school portal download after results publish |
| Award categories | Cash awards, medals, trophies per rank tier |
| Award disbursement | Admin tracks award dispatch status (pending/shipped/delivered) |
| School award kits | Printable materials for school-level award functions |
| Hall of Fame | Top 3 national rankers showcased on public website |

---

### 5.9 Coordinator Portal

**Priority: P1**

| Feature | Description |
|---|---|
| Coordinator application | Online form with territory preference |
| Admin approval | Approve/reject with territory assignment |
| School pipeline | Track schools: contacted > demo given > registered > paid |
| Commission dashboard | Real-time view of earned commission per school |
| Payout request | Submit payout request; admin approves |
| Resource hub | Download marketing materials, brochures, sample papers |
| Announcements | Admin broadcast to all coordinators |
| Performance reports | Coordinator-wise school count, fee collected, commission earned |

---

### 5.10 Notifications & Communication

**Priority: P1**

| Feature | Description |
|---|---|
| Email triggers | Registration confirmed, payment receipt, hall ticket ready, results live |
| SMS alerts | OTP login, exam reminder (T-7 days, T-1 day), result alert |
| WhatsApp Business | Hall ticket delivery, result notification, exam reminders |
| Admin broadcast | Send email/SMS to: all schools, specific state, specific exam group |
| Notification templates | Editable per event type, multilingual (Hindi/English) |
| Notification log | Admin view of all sent notifications with delivery status |

---

### 5.11 Admin Panel & CMS

**Priority: P0 for core admin; P1 for full CMS**

| Feature | Description |
|---|---|
| School management | View, approve, reject, suspend schools |
| Exam management | Create/edit exams, set dates, upload question papers |
| Results management | Upload OMR data, trigger ranking, publish results |
| Content management | Edit exam pages, syllabus, announcements, banner images |
| PDF management | Upload/replace syllabus PDFs, sample papers, answer keys |
| SEO management | Edit meta title/description per exam/syllabus page |
| User management | Create admin sub-users with role-based permissions |
| Audit log | Track all admin actions (who changed what, when) |
| Analytics dashboard | Enrollment stats, revenue, coordinator performance, exam participation |
| Export | Download any data table as CSV/Excel |

---

### 5.12 Study Material (Phase 2)

| Feature | Description |
|---|---|
| Free sample papers | Per exam, per class, per year -- downloadable PDF |
| Free syllabus | PDF per class per exam |
| Paid workbooks | E-commerce purchase, digital download or physical dispatch |
| Online mock tests | Timed practice tests with auto-scoring |
| Video lectures | Embedded YouTube or self-hosted per topic |

---

## 6. Technical Requirements

### 6.1 Architecture

```
Frontend (Next.js)          Backend (Node.js / NestJS)       Database
  Public Website        -->   REST API / GraphQL          -->  PostgreSQL (primary)
  School Portal         -->   Auth Service (JWT + RBAC)   -->  Redis (cache + queues)
  Student Portal        -->   Exam Engine Service         -->  AWS S3 (files/PDFs)
  Admin Panel           -->   Results & Ranking Service   -->  Elasticsearch (search)
  Coordinator Portal    -->   Notification Service
                        -->   PDF Generation Service (Puppeteer + BullMQ)
                        -->   Payment Service (Razorpay)
```

### 6.2 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, React |
| Backend | Node.js + NestJS (or Express), REST API |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| File Storage | AWS S3 + CloudFront CDN |
| PDF Generation | Puppeteer + BullMQ job queue |
| Search | PostgreSQL Full-Text Search (v1), Elasticsearch (v2) |
| Email | AWS SES / SendGrid |
| SMS/WhatsApp | MSG91 / Twilio |
| Payments | Razorpay (primary), PayU (fallback) |
| Hosting | AWS (EC2 / ECS / Lambda) |
| CDN | CloudFront / Cloudflare |
| CI/CD | GitHub Actions |
| Monitoring | Datadog / AWS CloudWatch |

### 6.3 Non-Functional Requirements

| Requirement | Target |
|---|---|
| Availability | 99.9% uptime (auto-scaling on exam days) |
| API response time | < 300ms for 95th percentile |
| PDF throughput | 10,000 certificates/hour via background jobs |
| Concurrent users | 50,000 simultaneous (exam result day) |
| Data retention | 7 years (regulatory requirement) |
| Security | OWASP Top 10 compliance, no exam paper leaks |
| Mobile responsiveness | All pages functional on mobile (320px+) |
| SEO | All exam/syllabus pages Google-indexed within 48 hours |
| Multilingual | English + Hindi at launch; regional languages in Phase 3 |
| Accessibility | WCAG 2.1 AA compliance |

### 6.4 Security Requirements

- Role-based access control (Super Admin, Admin, School, Student, Coordinator, Parent)
- OTP-based login for schools and students
- Exam question papers encrypted at rest, decrypted only on exam day
- Rate limiting on all public APIs
- Audit logs for all admin actions
- HTTPS everywhere, HSTS headers
- PII data encryption (student names, contact details)

---

## 7. Integrations

| Integration | Provider | Purpose |
|---|---|---|
| Payment Gateway | Razorpay / PayU | Fee collection from schools |
| SMS | MSG91 | OTP, exam reminders, result alerts |
| Email | AWS SES / SendGrid | Transactional + bulk email |
| WhatsApp | MSG91 / Twilio WhatsApp API | Hall tickets, result notifications |
| File Storage | AWS S3 | PDFs, images, syllabus files |
| CDN | CloudFront / Cloudflare | Static assets, PDF delivery |
| Analytics | Google Analytics 4 + Mixpanel | Traffic and product analytics |
| Error Monitoring | Sentry | Frontend and backend error tracking |

---

## 8. Data Model (High Level)

| Entity | Key Fields |
|---|---|
| School | id, name, board, affiliation_no, address, state, coordinator_id, status |
| Student | id, name, class, section, dob, school_id, parent_contact |
| Exam | id, name, subject, eligible_classes, fee_per_student, level_count |
| ExamDate | id, exam_id, date, registration_deadline |
| Enrollment | id, student_id, exam_id, exam_date_id, roll_no, payment_status |
| Payment | id, school_id, amount, gateway_ref, gst_amount, status, invoice_pdf_url |
| Result | id, enrollment_id, score, rank_school, rank_zone, rank_state, rank_national |
| Certificate | id, enrollment_id, type, pdf_url, qr_code, issued_at |
| Coordinator | id, name, territory, commission_rate, status |
| Question | id, exam_id, class, subject, chapter, text, image_url, options, correct_answer, difficulty |

---

## 9. Phased Rollout Plan

### Phase 1 -- MVP (Months 1-3)
- Public website (all exam pages, syllabus, downloads)
- School registration + admin approval
- Student bulk enrollment
- Payment gateway (Razorpay)
- Hall ticket PDF generation
- Basic admin panel
- Email + SMS notifications

**Launch Gate:** 50 schools registered, 3 exam types live

---

### Phase 2 -- Core Platform (Months 4-6)
- Results upload + ranking engine
- Certificate + rank card generation
- Student results portal
- Coordinator portal
- Answer key publishing + dispute workflow
- Admin CMS (content, SEO, announcements)

**Launch Gate:** 500 schools, first exam cycle completed end-to-end

---

### Phase 3 -- Scale (Months 7-9)
- Scholarship program pages + applications
- Study material e-commerce (paid workbooks)
- WhatsApp Business notifications
- Regional language support (Hindi)
- Advanced analytics dashboard
- International school support

**Launch Gate:** 2,000 schools, coordinator network active in 5 states

---

### Phase 4 -- Growth (Months 10-18)
- Online exam engine (browser-based, timed)
- Mobile apps (student + school)
- Parent dashboard
- AI-powered adaptive practice tests
- Gamification (leaderboards, badges, streaks)
- Franchise/licensing model for international expansion

---

## 10. Success Metrics (KPIs)

| Metric | Year 1 Target | Year 3 Target |
|---|---|---|
| Schools registered | 1,000 | 25,000 |
| Students enrolled | 50,000 | 2,000,000 |
| Exams conducted | 5 types | 12 types |
| Revenue (fees) | INR 85L | INR 30Cr |
| Coordinator network | 50 | 500 |
| Countries | 1 (India) | 5 |
| Net Promoter Score | > 40 | > 60 |
| Uptime | 99.5% | 99.9% |

### 10.1 Competitive Differentiators (vs SOF World / SilverZone)

- **AI-powered adaptive practice tests** -- not offered by incumbents
- **Parent dashboard** with real-time progress tracking
- **Instant digital certificates** (no multi-week wait)
- **Gamification** -- leaderboards, badges, streaks
- **Regional language support** from day one
- **WhatsApp-first registration** for Tier 2/3 schools

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Slow school adoption | High | Coordinator incentive program + free trial year |
| Exam paper leak | High | Encrypted storage, last-minute decryption, NDA for staff |
| Payment failures on exam day | High | Multiple gateways, offline payment fallback |
| PDF generation bottleneck | Medium | BullMQ job queue, horizontal scaling |
| SEO competition from SOF/SilverZone | Medium | Long-tail keywords, regional language content |
| Data loss / breach | High | Daily encrypted backups, SOC2-aligned security practices |

---

## 12. Open Questions

1. Will exams be conducted only at registered schools, or can external exam centers be set up?
2. What is the minimum viable coordinator commission structure?
3. Should students be allowed to register directly (B2C) or only via school (B2B)?
4. What is the target domain/brand name for the platform?
5. Will physical certificates and medals be dispatched by the platform or outsourced to a vendor?
6. What exam boards will be supported at launch (CBSE, ICSE, State boards)?

---

*Document prepared by Wibey -- Walmart's agentic teammate*  
*Based on analysis of SOF World and SilverZone platforms -- June 2026*
