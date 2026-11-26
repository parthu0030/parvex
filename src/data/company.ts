import type { Company } from "@/types";
import { SOCIAL_LINKS } from "./social";

export const COMPANY: Company = {
  name: "Parvex",
  legalName: "Parvex",
  tagline: "Creative Technology Studio",
  description:
    "Parvex is a creative technology studio. We design and build websites, web applications and AI automation, and produce photography and film — one team holding craft and code to the same standard.",
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

export const SITE_URL = "https://parvex.in";
export const REPOSITORY_URL = "https://github.com/parthu0030/parvex";
