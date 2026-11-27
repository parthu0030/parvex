import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/data/company";

// ROOT LAYOUT — truly global document concerns only.
//
// The public marketing experience (Navbar, Footer, CustomCursor, Lenis smooth
// scroll, page transitions) lives in `(public)/layout.tsx` and must never run
// inside /admin. The Admin experience owns its own shell in `admin/layout.tsx`.
// This file must stay minimal so neither experience leaks into the other.

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Parvex — Creative Technology Studio",
    template: "%s — Parvex",
  },
  description:
    "Parvex is a creative technology studio designing and building websites, web applications and AI automation, with photography, videography and video editing in-house.",
  applicationName: "Parvex",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased bg-white text-[#0A0A0A]">{children}</body>
    </html>
  );
}
