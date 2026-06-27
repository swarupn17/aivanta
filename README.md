# Aivanta Scholar Foundation - Website (Frontend)

Static, modern, institutional website for **Aivanta Scholar Foundation (ASF)** - a
national student awareness initiative running annual assessments in Financial
Awareness (FAA), Cyber Intelligence (CIA) and Artificial Intelligence (AIA) for
Classes 1-10, aligned with Viksit Bharat 2047.

Design is **inspired by** institutional portals like UCO Bank (utility bar, mega-nav,
hero carousel, quick-link tiles, notices ticker, multi-column footer) but with a
cleaner, modern look and the ASF brand palette.

## Tech
- Plain **HTML + Tailwind (CDN)** + a little vanilla JS. No build step.
- Header & footer are injected by one shared module (`assets/js/main.js`) so we stay DRY.
- HTMX/FastAPI-ready: the backend (school registration, results, feedback) gets wired later.

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home - hero carousel, pillars, subjects, stats, news, CTAs |
| `about.html` | Mission, vision, values, vs-olympiad positioning |
| `assessments.html` | FAA / CIA / AIA detail, exam pattern, fee structure |
| `syllabus.html` | Interactive class-wise syllabus explorer (1-10 x 3 subjects) |
| `social-welfare.html` | Social Welfare Fund, programs, CSR pitch |
| `publications.html` | Study books, handbooks, digital courses |
| `registration.html` | School registration form + live fee estimator |
| `contact.html` | Contact details + message form |

## Brand
- Navy `#0C2D6B` - Gold `#C8960C` - Sky `#1A73C8`
- Fonts: Poppins (display) + Inter (body)

## Run locally
```bash
python3 -m http.server 5173
# then open http://localhost:5173
```

## TODO (backend phase - on request)
- Wire school registration form to a backend + database
- Results lookup, parent/feedback forms
- Payment (UPI) integration
- Real logo assets (currently a placeholder "A" mark)
- Trilingual content toggle (EN / HI / MR)
