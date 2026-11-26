import type { Photo } from "@/types";

/**
 * PARVEX — photography portfolio.
 *
 * Every image here is Parvex's own work. Camera originals stay untouched in
 * /public/assets/photography (`source`); the files referenced below are
 * high-fidelity web exports (2400px long edge, JPEG q84) in
 * /public/assets/photography/web. Next/Image then serves right-sized
 * versions per device, so visitors never download 5–8 MB originals.
 *
 * Collections (only categories the photographs genuinely support):
 *   - Landscape  — high-altitude Ladakh. Includes the five frames that used to
 *                  sit in the homepage gallery.
 *   - Cinematic  — wide, letterboxed compositions and stage light.
 *   - Editorial  — documentary street portraits.
 */
const WEB = "/assets/photography/web";

export const PHOTO_COLLECTIONS = [
  {
    key: "Landscape",
    title: "Landscape",
    kicker: "Ladakh, India",
    description:
      "High-altitude valleys, ridgelines and weather, shot in monochrome so form and light carry the frame.",
  },
  {
    key: "Cinematic",
    title: "Cinematic Frames",
    kicker: "Widescreen",
    description:
      "Wide, letterboxed compositions — the way we frame a scene when we're thinking like a film camera.",
  },
  {
    key: "Editorial",
    title: "Editorial",
    kicker: "Street & documentary",
    description:
      "Portraits and everyday moments, made close and unposed. Honest light, honest people.",
  },
] as const;

export type PhotoCollectionKey = (typeof PHOTO_COLLECTIONS)[number]["key"];

const L = { width: 2400, height: 1800, aspect: "landscape" as const };
const P = { width: 1800, height: 2400, aspect: "portrait" as const };

export const PHOTOGRAPHY: Photo[] = [
  // ── Landscape ────────────────────────────────────────────────────────────
  // Former homepage gallery: range, valley, ridge, road, haze.
  { id: "landscape-range", type: "photo", ...L, category: "Landscape", src: `${WEB}/landscape-range.jpg`, source: "IMG_0291.jpg", caption: "Layered ridges below the snowline", alt: "Monochrome view of layered Himalayan ridges beneath a snow-capped range" },
  { id: "landscape-ridge", type: "photo", ...P, category: "Landscape", src: `${WEB}/landscape-ridge.jpg`, source: "IMG_0292.jpg", caption: "Weather over the ridge", alt: "Storm clouds rolling over a snow-dusted mountain ridge" },
  { id: "landscape-valley", type: "photo", ...L, category: "Landscape", src: `${WEB}/landscape-valley.jpg`, source: "IMG_0283.jpg", caption: "Open valley, late afternoon", alt: "Open high-desert valley with snow-tipped mountains on the horizon" },
  { id: "landscape-haze", type: "photo", ...P, category: "Landscape", src: `${WEB}/landscape-haze.jpg`, source: "IMG_0303.jpg", mono: true, caption: "Dust haze over the river valley", alt: "A tall peak rising above a hazy river valley and a line of pines" },
  { id: "landscape-road", type: "photo", ...P, category: "Landscape", src: `${WEB}/landscape-road.jpg`, source: "IMG_0301.jpg", caption: "The road down to the valley", alt: "Mountain road curving towards a hazy valley and distant peak" },
  { id: "landscape-observatory", type: "photo", ...P, category: "Landscape", src: `${WEB}/landscape-observatory.jpg`, source: "IMG_0726.jpg", caption: "Observatory under a building sky", alt: "High-altitude observatory dome beneath a dramatic cloud-filled sky" },
  { id: "landscape-summit", type: "photo", ...L, category: "Landscape", src: `${WEB}/landscape-summit.jpg`, source: "IMG_0446.jpg", caption: "Summit between passing clouds", alt: "Sunlit snow summit framed by drifting cumulus clouds" },

  // ── Cinematic ────────────────────────────────────────────────────────────
  // Order matters: wide, pair, wide — the portrait stage frame sits in the
  // pair so it keeps its own ratio instead of being letterboxed.
  { id: "landscape-peak", type: "photo", ...L, category: "Cinematic", src: `${WEB}/landscape-peak.jpg`, source: "IMG_0644.jpg", caption: "A single peak breaks the cloud", alt: "A lone snow peak breaking through low cloud above a dark plateau" },
  { id: "landscape-hills", type: "photo", ...L, category: "Cinematic", src: `${WEB}/landscape-hills.jpg`, source: "IMG_9808 (2).jpg", caption: "Cloud bank over desert hills", alt: "Soft desert hills under a long band of cloud" },
  { id: "stage-performance", type: "photo", ...P, category: "Cinematic", src: `${WEB}/stage-performance.jpg`, source: "IMG_3540.jpg", mono: true, caption: "Stage light through haze", alt: "Musicians performing on a dark stage through haze and spotlight" },
  { id: "landscape-snowline", type: "photo", ...L, category: "Cinematic", src: `${WEB}/landscape-snowline.jpg`, source: "IMG_9828 (2).jpg", caption: "Snowline panorama", alt: "Wide panorama of a snowline beneath scattered clouds" },

  // ── Editorial ────────────────────────────────────────────────────────────
  { id: "street-sculptor", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-sculptor.jpg`, source: "IMG_8544.jpg", caption: "Finishing touches", alt: "Young artisan carving the details of a clay idol in his workshop" },
  { id: "street-mother", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-mother.jpg`, source: "IMG_8514.jpg", caption: "Mother and child", alt: "A mother holding her child, looking straight into the lens" },
  { id: "street-artisan", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-artisan.jpg`, source: "IMG_8512.jpg", caption: "The maker and his work", alt: "An artisan inspecting a finished idol outside his stall" },
  { id: "street-portrait", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-portrait.jpg`, source: "IMG_8478.jpg", caption: "Between the sculptures", alt: "Woman seated on a woven cot, resting between sculptures" },
  { id: "street-girl", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-girl.jpg`, source: "IMG_8499.jpg", caption: "A pause in the crowd", alt: "A girl in a patterned dress standing alone in a busy street" },
  { id: "street-cyclist", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-cyclist.jpg`, source: "IMG_8485.jpg", caption: "Market lane", alt: "An elderly man walking his bicycle through a crowded market lane" },
  { id: "street-elders", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-elders.jpg`, source: "IMG_8530.jpg", caption: "Shared laughter", alt: "Two elderly women sharing a laugh at a roadside stall" },
  { id: "street-walk", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-walk.jpg`, source: "IMG_8522.jpg", caption: "Walking home", alt: "A mother and child walking together along a city road" },
  { id: "street-boy", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-boy.jpg`, source: "IMG_8541.jpg", caption: "Morning at the market", alt: "A boy sitting on a cot amid a market's morning clutter" },
  { id: "street-children", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-children.jpg`, source: "IMG_8497.jpg", caption: "Showing off", alt: "Children playing and posing on an open street" },
  { id: "street-motorbike", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-motorbike.jpg`, source: "IMG_8515.jpg", caption: "Roadside shop", alt: "A small girl beside a parked motorbike at a street shop" },
  { id: "street-friends", type: "photo", ...P, category: "Editorial", src: `${WEB}/street-friends.jpg`, source: "IMG_8545.jpg", caption: "Huddle", alt: "Three young friends huddled together in conversation" },
];

export function getPhoto(id: string): Photo {
  const photo = PHOTOGRAPHY.find((p) => p.id === id);
  if (!photo) throw new Error(`getPhoto: unknown photo id "${id}"`);
  return photo;
}

export function getCollection(key: PhotoCollectionKey): Photo[] {
  return PHOTOGRAPHY.filter((p) => p.category === key);
}

/** Kept for existing imports (Film & Motion section, services imagery). */
export const STAGE_PHOTO: Photo = getPhoto("stage-performance");
