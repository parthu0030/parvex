import type { SocialLink } from "@/types";

// Add real profile URLs here (or in Admin → Settings). Entries with an empty
// or "#" href are filtered out by `ACTIVE_SOCIAL_LINKS`, so the site never
// shows a social link that leads nowhere.
export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "Instagram",
    href: "https://www.instagram.com/parthu.jpeg/",
    handle: "@parthu.jpeg",
    icon: "instagram",
  },
  { platform: "LinkedIn", href: "#", icon: "linkedin" },
  { platform: "Behance", href: "#", icon: "globe" },
];

export const ACTIVE_SOCIAL_LINKS = SOCIAL_LINKS.filter(
  (link) => link.href && link.href !== "#"
);

/** Instagram — where clients can see more photography and film work. */
export const INSTAGRAM = SOCIAL_LINKS.find((l) => l.platform === "Instagram" && l.href !== "#");
