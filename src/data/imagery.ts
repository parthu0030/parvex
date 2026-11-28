/**
 * Editorial imagery used outside the photography portfolio.
 *
 * Remote images come from Unsplash (free licence, already allow-listed in
 * next.config.ts) and are rendered in monochrome via the `.img-mono` utility
 * so they sit in the same visual family as Parvex's own black-and-white work.
 * They are illustrative — never presented as client work or screenshots.
 */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const IMAGERY = {
  websites: { src: unsplash("photo-1547658719-da2b51169166"), alt: "Responsive website layouts open on a desktop monitor and tablet" },
  webApps: { src: unsplash("photo-1551288049-bebda4e38f71"), alt: "Data-rich web application dashboard with charts" },
  uiux: { src: unsplash("photo-1581291518857-4e27b48ff24e"), alt: "Designer sketching interface wireframes by hand" },
  branding: { src: unsplash("photo-1561070791-2526d30994b5"), alt: "Brand colour swatches and identity studies laid out on a desk" },
  // Local, edited copy of Unsplash photo-1485846234645: slate text changed to
  // PROD "Artist", DIR "Parth Panchal", date 03/07/2006; monochrome baked in.
  videography: { src: "/assets/videography/film-slate.jpg", alt: "Film slate marked “Artist”, “Parth Panchal” and 03/07/2006, held up before a take on location" },
  videoEditing: { src: unsplash("photo-1574717024653-61fd2cf4d44d"), alt: "Video edit timeline with layered tracks in post-production" },
  studioInterior: { src: unsplash("photo-1497366811353-6870744d04b2"), alt: "Quiet, modern studio interior with long work tables" },
  architecture: { src: unsplash("photo-1511818966892-d7d671e672a2"), alt: "Modern glass towers rising into the sky" },
  analytics: { src: unsplash("photo-1460925895917-afdab827c52f"), alt: "Analytics dashboard open on a laptop" },
} as const;
