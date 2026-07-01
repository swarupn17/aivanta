/**
 * Navigation model — single source of truth for header & footer links.
 * Ported from the old NAV array; now typed and using Next.js route paths.
 */

export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  key: string;
  label: string;
  href: string;
  children?: NavChild[];
};

export const mainNav: NavItem[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About Us", href: "/about" },
  { key: "viksit", label: "Viksit Bharat", href: "/viksit-bharat" },
  {
    key: "assessments",
    label: "Assessments",
    href: "/assessments",
    children: [
      { label: "Financial Intelligence (FIA)", href: "/assessments#fia" },
      { label: "Cyber Intelligence (CIA)", href: "/assessments#cia" },
      { label: "Artificial Intelligence (AIA)", href: "/assessments#aia" },
      { label: "Class-wise Syllabus", href: "/syllabus" },
    ],
  },
  { key: "welfare", label: "Social Welfare", href: "/social-welfare" },
  { key: "publications", label: "Publications", href: "/publications" },
  { key: "registration", label: "Registration", href: "/registration" },
  { key: "contact", label: "Contact", href: "/contact" },
];

/** Footer link columns. */
export const footerNav = {
  assessments: {
    title: "Assessments",
    links: [
      { label: "Financial Intelligence", href: "/assessments#fia" },
      { label: "Cyber Intelligence", href: "/assessments#cia" },
      { label: "Artificial Intelligence", href: "/assessments#aia" },
      { label: "Class-wise Syllabus", href: "/syllabus" },
    ],
  },
  foundation: {
    title: "Foundation",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Viksit Bharat 2047", href: "/viksit-bharat" },
      { label: "Social Welfare", href: "/social-welfare" },
      { label: "Publications", href: "/publications" },
      { label: "Register a School", href: "/registration" },
    ],
  },
} as const;
