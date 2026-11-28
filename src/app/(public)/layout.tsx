import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransition } from "@/components/ui/PageTransition";
import { SITE_URL } from "@/data/company";

// PUBLIC LAYOUT — owns the entire approved public experience.
// Nothing here may run inside /admin. Do not add Admin concerns to this file.

const DESCRIPTION =
  "A creative technology studio for websites, web applications, UI/UX, branding, photography, videography and video editing.";

export const metadata: Metadata = {
  keywords: [
    "creative technology studio",
    "website design and development",
    "web application development",
    "UI/UX design",
    "branding studio",
    "photography",
    "videography",
    "video editing",
  ],
  authors: [{ name: "Parvex" }],
  creator: "Parvex",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Parvex",
    title: "Parvex — Creative Technology Studio",
    description: DESCRIPTION,
    images: [
      {
        url: "/assets/logos/parvex-og-image.png",
        width: 1200,
        height: 630,
        alt: "Parvex — Creative Technology Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parvex — Creative Technology Studio",
    description: DESCRIPTION,
    images: ["/assets/logos/parvex-og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Skip to main content — accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* Custom cursor — desktop only, pointer-events: none */}
      <CustomCursor />
      <SmoothScrollProvider />
      <Navbar />
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
