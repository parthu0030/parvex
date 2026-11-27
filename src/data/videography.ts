import type { Video } from "@/types";

/**
 * PARVEX — videography portfolio (Videography Showcase).
 *
 * Every film here is Parvex's own work. Originals stay untouched in the
 * `Videos/` folder at the project root (`source`). The site serves
 * web-ready versions from /public/videos:
 *   - 720p H.264 originals: streams copied as-is (no re-encode), only
 *     remuxed with +faststart so playback starts before the download ends.
 *   - 4K HEVC originals: re-encoded once to 1080×1920 H.264 (CRF 21,
 *     ≤ 6 Mbps) — HEVC doesn't play in Chrome/Firefox, and the originals
 *     exceed GitHub's 100 MB file limit.
 * Posters are single frames from each film; previews are 6-second silent
 * 540p loops used only on hover.
 *
 * Titles use each film's own on-screen title where it has one. Descriptions
 * stick to what is visible in the footage — no invented places or clients.
 */
const V = "/videos";

export const VIDEO_CATEGORIES = ["Event", "Travel", "Behind the Scenes", "Food"] as const;

export const VIDEOGRAPHY: Video[] = [
  {
    id: "navratri-nights",
    type: "video",
    title: "Navshakti — Volunteer's Meet",
    category: "Event",
    description:
      "An open-air evening for Navratri 2026 — musicians seated cross-legged on a low platform, a crowd packed in close, and a host moving through it, holding out a phone to collect reactions.",
    src: `${V}/navratri-nights.mp4`,
    posterSrc: `${V}/posters/navratri-nights.jpg`,
    previewSrc: `${V}/previews/navratri-nights.mp4`,
    alt: "Musicians performing seated on a raised platform at a night-time outdoor gathering, surrounded by an audience",
    aspect: "portrait",
    width: 1080,
    height: 1920,
    duration: 94,
    source: "F857983A-890A-4FF2-BF5F-EBAF9F17554C.MP4",
  },
  {
    id: "ladakh",
    type: "video",
    title: "Ladakh",
    category: "Travel",
    description:
      "A short film of the high desert, opening on “A place can't be that beautiful” — prayer flags snapping in the wind, a shepherd with his flock, a wind-ruffled lake, market streets after dark and an observatory under cloud.",
    src: `${V}/ladakh.mp4`,
    posterSrc: `${V}/posters/ladakh.jpg`,
    previewSrc: `${V}/previews/ladakh.mp4`,
    alt: "A turquoise lake seen from a high, barren slope under heavy cloud",
    aspect: "portrait",
    width: 720,
    height: 1280,
    duration: 11,
    source: "Video-40266.mp4",
  },
  {
    id: "festive-fashion-behind-the-scenes",
    type: "video",
    title: "Festive Wear — Behind the Scenes",
    category: "Behind the Scenes",
    description:
      "On set for a traditional-wear shoot: models in vivid lehengas against a deep red backdrop, haze cut by hard light, last touches from make-up, and the camera team working between setups.",
    src: `${V}/festive-fashion-behind-the-scenes.mp4`,
    posterSrc: `${V}/posters/festive-fashion-behind-the-scenes.jpg`,
    previewSrc: `${V}/previews/festive-fashion-behind-the-scenes.mp4`,
    alt: "Three models in colourful traditional outfits laughing together in front of a red studio backdrop",
    aspect: "portrait",
    width: 720,
    height: 1280,
    duration: 28,
    source: "Video-90191.mp4",
  },
  {
    id: "cakebae-behind-the-scenes",
    type: "video",
    title: "Behind the Scene ft. cakebae",
    category: "Behind the Scenes",
    description:
      "A dessert product shoot seen from the side of the set — gift hampers, pastry boxes and a cocoa-dusted tray styled by hand, each arrangement checked on a tripod-mounted camera before the shot.",
    src: `${V}/cakebae-behind-the-scenes.mp4`,
    posterSrc: `${V}/posters/cakebae-behind-the-scenes.jpg`,
    previewSrc: `${V}/previews/cakebae-behind-the-scenes.mp4`,
    alt: "A styled table of pastries and a ribbon-wrapped gift hamper on a soft beige set",
    aspect: "portrait",
    width: 720,
    height: 1280,
    duration: 29,
    source: "Video-29800.mp4",
  },
  {
    id: "eggless-french-toast",
    type: "video",
    title: "Eggless French Toast",
    category: "Food",
    description:
      "A recipe film in soft daylight: batter whisked in a wooden bowl, butter on the pan, the flip, then maple, raspberries and a final dusting of powdered sugar.",
    src: `${V}/eggless-french-toast.mp4`,
    posterSrc: `${V}/posters/eggless-french-toast.jpg`,
    previewSrc: `${V}/previews/eggless-french-toast.mp4`,
    alt: "A stack of golden French toast glazed with maple on a white plate",
    aspect: "portrait",
    width: 1080,
    height: 1920,
    duration: 49,
    source: "B936F573-10FB-4BC3-A3A4-D166BA653BD7.mp4",
  },
  {
    id: "choco-chana-power-bites",
    type: "video",
    title: "Choco Chana Power Bites",
    category: "Food",
    description:
      "On a pale stone counter: chickpeas, dates and cocoa blended and pressed into a lined glass dish, finished with a chocolate layer and walnuts, then served stacked on a glass cake stand under a cloche.",
    src: `${V}/choco-chana-power-bites.mp4`,
    posterSrc: `${V}/posters/choco-chana-power-bites.jpg`,
    previewSrc: `${V}/previews/choco-chana-power-bites.mp4`,
    alt: "Chocolate-topped bites with walnuts stacked on a glass cake stand beside a cloche",
    aspect: "portrait",
    width: 720,
    height: 1280,
    duration: 42,
    source: "Video-38191.mp4",
  },
];

/** Films given the large, featured treatment (in order). */
export const FEATURED_VIDEO_IDS = ["navratri-nights", "ladakh"] as const;

/** The Videography Showcase case study is the home of the film portfolio. */
export const VIDEOGRAPHY_SHOWCASE_SLUG = "videography-showcase";

export function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
