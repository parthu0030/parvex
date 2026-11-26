import type { Photo } from "@/types";

/**
 * PARVEX — curated photography.
 *
 * Every image here is Parvex's own work. Originals live in
 * /public/assets/photography; the files referenced below are web-sized
 * exports (2200px long edge) in /public/assets/photography/web so the site
 * never ships 5–8 MB camera originals to visitors.
 *
 * Series keep the gallery editorial rather than an undifferentiated dump:
 *   - "Landscape" — high-altitude Ladakh, shot in monochrome
 *   - "Street"    — documentary portraits and everyday moments
 */
const WEB = "/assets/photography/web";

export const PHOTOGRAPHY: Photo[] = [
  // ── Landscape ────────────────────────────────────────────────────────────
  { id: "landscape-range", type: "photo", src: `${WEB}/landscape-range.jpg`, alt: "Monochrome view of layered Himalayan ridges under a snow-capped range", aspect: "landscape", category: "Landscape" },
  { id: "landscape-observatory", type: "photo", src: `${WEB}/landscape-observatory.jpg`, alt: "High-altitude observatory dome beneath a dramatic cloud-filled sky", aspect: "portrait", category: "Landscape" },
  { id: "landscape-peak", type: "photo", src: `${WEB}/landscape-peak.jpg`, alt: "A lone snow peak breaking through low cloud above a dark plateau", aspect: "landscape", category: "Landscape" },
  { id: "landscape-ridge", type: "photo", src: `${WEB}/landscape-ridge.jpg`, alt: "Storm clouds rolling over a snow-dusted mountain ridge", aspect: "portrait", category: "Landscape" },
  { id: "landscape-summit", type: "photo", src: `${WEB}/landscape-summit.jpg`, alt: "Sunlit snow summit framed by drifting cumulus clouds", aspect: "landscape", category: "Landscape" },
  { id: "landscape-road", type: "photo", src: `${WEB}/landscape-road.jpg`, alt: "Mountain road curving towards a hazy valley and distant peak", aspect: "portrait", category: "Landscape" },
  { id: "landscape-snowline", type: "photo", src: `${WEB}/landscape-snowline.jpg`, alt: "Wide panorama of a snowline beneath scattered clouds", aspect: "landscape", category: "Landscape" },
  { id: "landscape-hills", type: "photo", src: `${WEB}/landscape-hills.jpg`, alt: "Soft desert hills under a long band of cloud", aspect: "landscape", category: "Landscape" },
  { id: "landscape-valley", type: "photo", src: `${WEB}/landscape-valley.jpg`, alt: "Open high-desert valley with snow-tipped mountains on the horizon", aspect: "landscape", category: "Landscape" },

  // ── Street ───────────────────────────────────────────────────────────────
  { id: "street-sculptor", type: "photo", src: `${WEB}/street-sculptor.jpg`, alt: "Young artisan carving the details of a clay idol in his workshop", aspect: "portrait", category: "Street" },
  { id: "street-mother", type: "photo", src: `${WEB}/street-mother.jpg`, alt: "A mother holding her child, looking straight into the lens", aspect: "portrait", category: "Street" },
  { id: "street-artisan", type: "photo", src: `${WEB}/street-artisan.jpg`, alt: "An artisan inspecting a finished idol outside his stall", aspect: "portrait", category: "Street" },
  { id: "street-portrait", type: "photo", src: `${WEB}/street-portrait.jpg`, alt: "Woman seated on a woven cot, resting between sculptures", aspect: "portrait", category: "Street" },
  { id: "street-girl", type: "photo", src: `${WEB}/street-girl.jpg`, alt: "A girl in a patterned dress standing alone in a busy street", aspect: "portrait", category: "Street" },
  { id: "street-cyclist", type: "photo", src: `${WEB}/street-cyclist.jpg`, alt: "An elderly man walking his bicycle through a crowded market lane", aspect: "portrait", category: "Street" },
  { id: "street-elders", type: "photo", src: `${WEB}/street-elders.jpg`, alt: "Two elderly women sharing a laugh at a roadside stall", aspect: "portrait", category: "Street" },
  { id: "street-walk", type: "photo", src: `${WEB}/street-walk.jpg`, alt: "A mother and child walking together along a city road", aspect: "portrait", category: "Street" },
  { id: "street-boy", type: "photo", src: `${WEB}/street-boy.jpg`, alt: "A boy sitting on a cot amid a market's morning clutter", aspect: "portrait", category: "Street" },
  { id: "street-children", type: "photo", src: `${WEB}/street-children.jpg`, alt: "Children playing and posing on an open street", aspect: "portrait", category: "Street" },
  { id: "street-motorbike", type: "photo", src: `${WEB}/street-motorbike.jpg`, alt: "A small girl beside a parked motorbike at a street shop", aspect: "portrait", category: "Street" },
  { id: "street-friends", type: "photo", src: `${WEB}/street-friends.jpg`, alt: "Three young friends huddled together in conversation", aspect: "portrait", category: "Street" },
];

/** Stage / live-performance still, used for the film & motion story. */
export const STAGE_PHOTO: Photo = {
  id: "stage-performance",
  type: "photo",
  src: `${WEB}/stage-performance.jpg`,
  alt: "Musicians performing on a dark stage through haze and spotlight",
  aspect: "portrait",
  category: "Live",
};

export function getPhoto(id: string): Photo {
  const photo = PHOTOGRAPHY.find((p) => p.id === id);
  if (!photo) throw new Error(`getPhoto: unknown photo id "${id}"`);
  return photo;
}
