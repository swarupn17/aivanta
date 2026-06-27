/* ============================================================
   AIVANTA SCHOLAR FOUNDATION - SITE CONFIG
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT for everyday changes.
   Update your contact details, social links, fees, announcements
   and legal links here. The whole site reads from this object.
   (No need to touch any HTML or other JS.)
   ============================================================ */

window.ASF_CONFIG = {

  /* ---- Organisation identity ---- */
  org: {
    name: "Aivanta Scholar Foundation",
    shortName: "Aivanta Scholar",   // big text in the logo lockup
    suffixWord: "Foundation",       // small text under the logo
    microTagline: "Awareness · Skills · Values",
    tagline: "Empowering today's students to build tomorrow's India",
    academicYear: "2025-26"
  },

  /* ---- Contact details (shown in header, footer, contact page) ---- */
  contact: {
    email: "info@aivantascholar.org",
    phone: "+91 99999 00000",        // change to your real number
    site:  "www.aivantascholar.org",
    place: "Pimpri-Chinchwad, Pune, Maharashtra",
    address: "Pimpri-Chinchwad, Pune, Maharashtra, India"
  },

  /* ---- Social links ----
     Put your real profile URLs here. Leave a value as "" (empty)
     to hide that icon completely. ---- */
  social: {
    facebook:  "https://facebook.com/",
    instagram: "https://instagram.com/",
    linkedin:  "https://linkedin.com/",
    youtube:   "https://youtube.com/"
  },

  /* ---- Languages shown in the top bar ----
     'active' marks the default. Full translation is a future phase;
     for now this remembers the visitor's choice. ---- */
  languages: [
    { code: "en", label: "EN", active: true },
    { code: "hi", label: "हिं" },
    { code: "mr", label: "मरा" }
  ],

  /* ---- Fee model (Rupees, per student per subject) ---- */
  fees: {
    perSubject: 150,
    welfarePerStudent: 25,
    schoolPerStudent: 25,
    coordinatorPerStudent: 25
  },

  /* ---- Scrolling announcement ticker (homepage) ----
     Add / remove lines freely. ---- */
  announcements: [
    "Registrations open for Assessment Cycle 2025-26.",
    "Free PDF study material included with every subject.",
    "Class 9-10 scholarships & mentorship now announced.",
    "Schools across Maharashtra invited for the pilot cycle."
  ],

  /* ---- Footer legal links ---- */
  legal: {
    privacy: "privacy.html",
    terms: "terms.html"
  }
};
