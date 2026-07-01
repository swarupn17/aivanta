/**
 * ============================================================
 * SITE CONFIG — the ONE place to edit everyday content.
 * ============================================================
 * Org identity, contact details, social links, fees, announcements,
 * and legal links. Typed so a typo becomes a compile error, not a
 * silent bug. (This replaces the old assets/js/config.js.)
 */

export const siteConfig = {
  org: {
    name: "Aivanta Scholar Foundation",
    shortName: "Aivanta Scholar",
    suffixWord: "Foundation",
    microTagline: "Awareness · Skills · Values",
    tagline: "Empowering today's students to build tomorrow's India",
    academicYear: "2025-26",
  },

  contact: {
    email: "info@aivantascholar.org",
    phone: "+91 7588665576",
    site: "www.aivantascholar.org",
    place: "205, Shri Padmalaxmi, Behind Vasudha Etasha, Jijai Nagar, Kothrud, Pune, Maharashtra 411038",
    address: "205, Shri Padmalaxmi, Behind Vasudha Etasha, Jijai Nagar, Kothrud, Pune, Maharashtra 411038",
  },

  /** Leave a value as "" to hide that social icon. */
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    youtube: "https://youtube.com/",
  },

  /** Language switcher in the top bar. `active: true` marks the default. */
  languages: [
    { code: "en", label: "EN", active: true },
    { code: "hi", label: "हिं", active: false },
    { code: "mr", label: "मरा", active: false },
  ],

  /** Fee model — Rupees, per student per subject. */
  fees: {
    perSubject: 150,
  },

  /** Scrolling announcement ticker on the homepage. */
  announcements: [
    "Registrations open for Assessment Cycle 2025-26.",
    "Free PDF study material included with every subject.",
    "Class 9-10 scholarships & mentorship now announced.",
    "Schools across Maharashtra invited for the pilot cycle.",
  ],

  legal: {
    privacy: "/privacy",
    terms: "/terms",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type Language = (typeof siteConfig.languages)[number];
