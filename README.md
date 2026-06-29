# Aivanta Scholar Foundation - Website (Frontend)

Static, modern, institutional website for **Aivanta Scholar Foundation (ASF)** - a
national student awareness initiative running annual assessments in Financial
Intelligence (FIA), Cyber Intelligence (CIA) and Artificial Intelligence (AIA) for
Classes 1-10, aligned with Viksit Bharat 2047.

Design is **inspired by** institutional portals like UCO Bank (utility bar, mega-nav,
hero carousel, quick-link tiles, notices ticker, multi-column footer) but with a
cleaner, modern look and the ASF brand palette.

## Tech
- Plain **HTML + Tailwind (CDN)** + a little vanilla JS. No build step.
- Header & footer are injected by one shared module (`assets/js/main.js`) so we stay DRY.
- HTMX/FastAPI-ready: the backend (school registration, results, feedback) gets wired later.

## Project structure
```
.                       # deployable static site (root)
  *.html                # site pages
  assets/css/           # styles.css
  assets/js/            # config.js, main.js, syllabus.js, contact.js
  assets/img/           # logos + favicon (cropped, web-ready)
  .github/workflows/    # GitHub Pages deploy
reference/              # INTERNAL ONLY - gitignored, never deployed
                        # brand source PNGs, brochure PDF, strategy notes
```
> `reference/` is excluded from git **and** stripped from the live deploy - it
> holds source art and internal business notes that must not be public.

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home - hero carousel, pillars, subjects, stats, news, CTAs |
| `about.html` | Mission, vision, values, vs-olympiad positioning |
| `viksit-bharat.html` | Viksit Bharat 2047 alignment, philosophy, why-we-are-different table |
| `assessments.html` | FIA / CIA / AIA detail, exam pattern, fee structure |
| `syllabus.html` | Interactive class-wise syllabus explorer (1-10 x 3 subjects) |
| `social-welfare.html` | Social welfare programs & CSR partnership |
| `publications.html` | Study books, handbooks, digital courses |
| `registration.html` | School registration form |
| `contact.html` | Contact details + message form |

## Brand
- Navy `#0C2D6B` - Gold `#C8960C` - Sky `#1A73C8`
- Fonts: Poppins (display) + Inter (body)

## Edit your info in ONE place

All the stuff you'll want to change regularly lives in **`assets/js/config.js`** -
no need to touch any HTML. Edit that file and refresh:

| What | Where in config |
|------|-----------------|
| Org name / tagline / academic year | `org` |
| Email, phone, website, address | `contact` |
| Social media URLs (empty `""` hides the icon) | `social` |
| Language buttons in the top bar | `languages` |
| Fee amounts | `fees` |
| Scrolling notices on the homepage | `announcements` |
| Privacy / Terms link targets | `legal` |

The shared header, footer, social icons, language toggle and homepage ticker all
read from this file automatically.

## Run locally
```bash
python3 -m http.server 5173
# then open http://localhost:5173
```

## TODO (backend phase - on request)
- Wire school registration form to a backend + database
- Results lookup, parent/feedback forms
- Payment (UPI) integration
- Trilingual content toggle (EN / HI / MR) - Devanagari logo ready at `assets/img/logo-aivanta-mr.png`
