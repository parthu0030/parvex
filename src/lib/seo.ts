import type { Metadata } from "next";
import { SITE_URL } from "@/data/company";

const DEFAULT_OG = {
  url: "/assets/logos/parvex-og-image.png",
  width: 1200,
  height: 630,
  alt: "Parvex — Creative Technology Studio",
};

/**
 * Consistent per-page metadata. `title` is the bare page name — the root
 * layout's title template appends "— Parvex", so never include it here.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  canonical,
  noIndex,
  image,
}: {
  title: string;
  description: string;
  path: string;
  canonical?: string | null;
  noIndex?: boolean | null;
  image?: { url: string; alt?: string } | null;
}): Metadata {
  // Strip a trailing "— Parvex" left over in CMS meta titles so the template
  // doesn't render "Services — Parvex — Parvex".
  const cleanTitle = title.replace(/\s*[—–-]\s*Parvex\s*$/i, "");
  const url = `${SITE_URL}${path}`;
  const og = image ? { url: image.url, alt: image.alt ?? cleanTitle } : DEFAULT_OG;

  return {
    title: cleanTitle,
    description,
    alternates: { canonical: canonical ?? url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: "Parvex",
      title: `${cleanTitle} — Parvex`,
      description,
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} — Parvex`,
      description,
      images: [og.url],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
