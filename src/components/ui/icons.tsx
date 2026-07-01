import type { SVGProps } from "react";

/**
 * Themed line-icon set (finance / cyber / AI + a few utility icons).
 *
 * All icons are inline SVG (no dependency), 24x24, and inherit `currentColor`
 * so you colour them with Tailwind text-* utilities. Keep the stroke style
 * consistent (1.6 width, round caps) so they read as one family.
 */

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* ---------------- Finance (FIA) ---------------- */

export const IconRupeeCoin = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 8h6M9 11h6M13.5 8c1.2 0 2 .9 2 2s-.8 2-2 2H9l4 4" />
  </Base>
);

export const IconPiggyBank = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12a6 5 0 0 1 6-5h3a6 5 0 0 1 6 5c0 1.7-.9 3.2-2.3 4.1V19h-2.5l-.5-1.2H9.3L8.8 19H6.3v-2.1A5.2 5.2 0 0 1 4 13z" />
    <path d="M4 12H3M13 7l1-2M9.5 10.5h.01" />
  </Base>
);

export const IconGrowthChart = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 19V5M4 19h16" />
    <path d="M7 15l3-3 3 2 5-6" />
    <path d="M18 8h1.5V9.5" />
  </Base>
);

export const IconWallet = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="M3 9h18M16.5 13h.01" />
    <path d="M17 6V4.5a1.5 1.5 0 0 0-2-1.4L5 6" />
  </Base>
);

export const IconBank = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 9l9-5 9 5M4 9h16M5 9v8M9.5 9v8M14.5 9v8M19 9v8M3 20h18" />
  </Base>
);

/* ---------------- Cyber (CIA) ---------------- */

export const IconShieldLock = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 7-7 8-4-1-7-3.5-7-8V6z" />
    <rect x="9.5" y="11" width="5" height="4" rx="1" />
    <path d="M10.5 11v-1a1.5 1.5 0 0 1 3 0v1" />
  </Base>
);

export const IconFingerprint = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 11a7 7 0 0 1 13-3.5" />
    <path d="M8 11a4 4 0 0 1 8 0c0 3-.5 5-1.5 7" />
    <path d="M12 11v3c0 2-.5 3.5-1 5M15 18c.5-2 .8-4 .5-6" />
    <path d="M6 15c.4 1.5.4 3-.2 4.5" />
  </Base>
);

export const IconLockKey = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="14.5" r="1.4" />
    <path d="M12 15.9V17.5" />
  </Base>
);

export const IconBugShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 8.5a3 3 0 0 1 6 0v3a3 3 0 0 1-6 0z" />
    <path d="M12 5.5V4M9 9L6.5 8M15 9l2.5-1M9 12H6M15 12h3M9.3 15l-2 1.5M14.7 15l2 1.5" />
  </Base>
);

export const IconEyePrivacy = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M4 4l16 16" />
  </Base>
);

/* ---------------- AI (AIA) ---------------- */

export const IconChip = (p: IconProps) => (
  <Base {...p}>
    <rect x="7" y="7" width="10" height="10" rx="2" />
    <path d="M10 10.5h4v3h-4z" />
    <path d="M9 4v3M15 4v3M9 17v3M15 17v3M4 9h3M4 15h3M17 9h3M17 15h3" />
  </Base>
);

export const IconRobot = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="8" width="14" height="10" rx="2.5" />
    <path d="M12 5v3M12 4.5h.01" />
    <circle cx="9.5" cy="12.5" r="1" />
    <circle cx="14.5" cy="12.5" r="1" />
    <path d="M9.5 15.5h5M3 12v3M21 12v3" />
  </Base>
);

export const IconNeuralNet = (p: IconProps) => (
  <Base {...p}>
    <circle cx="5" cy="7" r="1.6" />
    <circle cx="5" cy="17" r="1.6" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="7" r="1.6" />
    <circle cx="19" cy="17" r="1.6" />
    <path d="M6.4 7.7L10.4 11M6.4 16.3L10.4 13M13.6 11l4-3M13.6 13l4 3" />
  </Base>
);

export const IconSparkleAI = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
    <path d="M18 15l.7 1.8L20.5 17.5 18.7 18.2 18 20l-.7-1.8L15.5 17.5l1.8-.7z" />
  </Base>
);

export const IconBrainCircuit = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 5a3 3 0 0 0-3 3 3 3 0 0 0-1 5.6A3 3 0 0 0 8 18a3 3 0 0 0 4 0V5.5A2 2 0 0 0 9 5z" />
    <path d="M12 8h3M15 8a1.5 1.5 0 1 0 0-.01M12 13h4M16 13a1.5 1.5 0 1 0 0-.01M18 8v5" />
  </Base>
);

/* ---------------- Utility ---------------- */

export const IconCertificate = (p: IconProps) => (
  <Base {...p}>
    <rect x="4" y="4" width="16" height="12" rx="2" />
    <path d="M7 8h10M7 11h5" />
    <circle cx="12" cy="17.5" r="2.5" />
    <path d="M10.5 19.5L10 22l2-1 2 1-.5-2.5" />
  </Base>
);

export const IconLanguages = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5h7M7.5 5v2c0 3-1.5 5-4 6M5 8c.5 2 2 3.5 4.5 4.5" />
    <path d="M12 20l3.5-9 3.5 9M13.2 17h4.6" />
  </Base>
);

export const IconUsers = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M17 13.5a5.5 5.5 0 0 1 3.5 5.5" />
  </Base>
);

export const IconTrophy = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
    <path d="M7 5H4v1.5A3.5 3.5 0 0 0 7 10M17 5h3v1.5A3.5 3.5 0 0 1 17 10" />
    <path d="M12 13v3M9 20h6M10 20l.5-4h3l.5 4" />
  </Base>
);

export const IconShieldCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 7-7 8-4-1-7-3.5-7-8V6z" />
    <path d="M9 12l2 2 4-4" />
  </Base>
);

export const IconBookOpen = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 6C10 4.5 6.5 4.5 4 5v13c2.5-.5 6-.5 8 1 2-1.5 5.5-1.5 8-1V5c-2.5-.5-6-.5-8 1z" />
    <path d="M12 6v13" />
  </Base>
);

export const IconMail = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 7l8 6 8-6" />
  </Base>
);

export const IconDownload = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v10M8 11l4 3 4-3" />
    <path d="M5 18h14" />
  </Base>
);

export const IconGlobe = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
  </Base>
);

export const IconClipboard = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="5" width="14" height="16" rx="2" />
    <path d="M9 5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v1H9z" />
    <path d="M8.5 11l1.5 1.5 3-3M8.5 16h5" />
  </Base>
);

/* ---------------- Subject icon groups ----------------
   A trio of themed glyphs per subject, for decorative rows. */
export const SUBJECT_ICONS = {
  FIA: [IconRupeeCoin, IconPiggyBank, IconGrowthChart],
  CIA: [IconShieldLock, IconFingerprint, IconEyePrivacy],
  AIA: [IconChip, IconRobot, IconNeuralNet],
} as const;
