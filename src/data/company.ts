import type { Company } from "@/types";
import { SOCIAL_LINKS } from "./social";

export const COMPANY: Company = {
  name: "Parvex",
  legalName: "Parvex",
  tagline: "Creative Technology Studio",
  description:
    "Parvex is a creative technology studio. We design and build websites and web applications, and produce photography and film — one team holding craft and code to the same standard.",
  email: "parvex3303@gmail.com",
  phone: "+91 79900 32648",
  founded: "2024",
  socialLinks: SOCIAL_LINKS,
};

/** Phone in E.164 form, for tel: links and structured data. */
const PHONE_E164 = "+917990032648";

/** Ready-made contact links so every component formats them the same way. */
export const CONTACT_LINKS = {
  email: `mailto:${COMPANY.email}`,
  phone: `tel:${PHONE_E164}`,
  phoneE164: PHONE_E164,
  whatsapp: `https://wa.me/${PHONE_E164.replace("+", "")}?text=${encodeURIComponent(
    "Hi Parvex, I'd like to talk about a project."
  )}`,
} as const;

/** The live address, used when nothing better is configured. */
const DEFAULT_SITE_URL = "https://parvex-mocha.vercel.app";

/** "example.com/" or "https://example.com/" → "https://example.com"; null if unusable. */
function toOrigin(value: string | undefined, { allowLocal }: { allowLocal: boolean }): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    if (!allowLocal && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(url.hostname)) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * The site's public origin, used for canonical URLs, the sitemap, Open Graph
 * images and structured data. Fixed at build time, so a change takes effect on
 * the next deploy. In order:
 * 1. `NEXT_PUBLIC_SITE_URL`, when it is set to a real (non-localhost) address.
 * 2. Vercel's production domain (`NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL`,
 *    set automatically on Vercel). It becomes a custom domain such as
 *    parvex.in once that domain is added to the Vercel project.
 * 3. The current live address.
 */
function resolveSiteUrl(): string {
  return (
    toOrigin(process.env.NEXT_PUBLIC_SITE_URL, { allowLocal: false }) ??
    toOrigin(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL, {
      allowLocal: false,
    }) ??
    DEFAULT_SITE_URL
  );
}

export const SITE_URL = resolveSiteUrl();
export const REPOSITORY_URL = "https://github.com/parthu0030/parvex";
