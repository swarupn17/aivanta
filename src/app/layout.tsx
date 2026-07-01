import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: `${siteConfig.org.name} — ${siteConfig.org.tagline}`,
    template: `%s | ${siteConfig.org.shortName}`,
  },
  description:
    "A national student awareness initiative running annual assessments in Financial, Cyber and Artificial Intelligence for Classes 1–10, aligned with Viksit Bharat 2047.",
  icons: { icon: "/img/favicon.png" },
  openGraph: {
    title: siteConfig.org.name,
    description: siteConfig.org.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Brand fonts — Poppins (display) + Inter (body). Loaded at runtime so
            the build never depends on outbound font fetches. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
