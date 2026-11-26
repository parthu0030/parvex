export interface MediaItem {
  id: string;
  type: "photo" | "video";
  src: string;
  alt: string;
  aspect: "portrait" | "landscape" | "square";
}

export interface Photo extends MediaItem {
  type: "photo";
  category?: string;
  /** Pixel dimensions of the served file — used to lay out without cropping. */
  width?: number;
  height?: number;
  /** Short gallery caption (descriptive only — no invented places or clients). */
  caption?: string;
  /** Original camera file in /public/assets/photography this export came from. */
  source?: string;
  /** Colour original shown in monochrome to match the collection. */
  mono?: boolean;
}

export interface Video extends MediaItem {
  type: "video";
  category?: string;
  /** Optional poster/still frame shown before playback (no autoplay, per design rules). */
  posterSrc?: string;
}
