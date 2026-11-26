import type { NavLink, FooterSection } from "@/types";
import { ACTIVE_SOCIAL_LINKS } from "@/data/social";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    heading: "Studio",
    links: [
      { label: "Work", href: "/work" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Websites", href: "/services#website-design-development" },
      { label: "Web Applications", href: "/services#web-applications" },
      { label: "UI/UX Design", href: "/services#ui-ux-design" },
      { label: "Photography & Film", href: "/services#photography" },
      { label: "AI Automation", href: "/services#ai-automation" },
    ],
  },
  ...(ACTIVE_SOCIAL_LINKS.length > 0
    ? [
        {
          heading: "Connect",
          links: ACTIVE_SOCIAL_LINKS.map((s) => ({ label: s.platform, href: s.href })),
        },
      ]
    : []),
];
