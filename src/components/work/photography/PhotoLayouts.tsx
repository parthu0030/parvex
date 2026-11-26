"use client";

import Image from "next/image";
import type { Photo } from "@/types";
import { cn } from "@/lib/utils";

const ratio = (p: Photo) => (p.width && p.height ? p.width / p.height : p.aspect === "portrait" ? 3 / 4 : 4 / 3);

/** Split photos into rows following a pattern of row lengths (repeats if needed). */
function toRows(photos: Photo[], pattern: number[]): Photo[][] {
  const rows: Photo[][] = [];
  let i = 0;
  let r = 0;
  while (i < photos.length) {
    const n = pattern[r % pattern.length] || 1;
    rows.push(photos.slice(i, i + n));
    i += n;
    r += 1;
  }
  return rows;
}

/** Phones: landscapes get a row each, portraits pair up. */
function toMobileRows(photos: Photo[]): Photo[][] {
  const rows: Photo[][] = [];
  let pending: Photo | null = null;
  for (const p of photos) {
    if (ratio(p) >= 1) {
      rows.push([p]);
    } else if (pending) {
      rows.push([pending, p]);
      pending = null;
    } else {
      pending = p;
    }
  }
  if (pending) rows.push([pending]);
  return rows;
}

interface FrameProps {
  photo: Photo;
  number: number;
  /** Receives the clicked element so focus can return to it on close. */
  onOpen: (trigger: HTMLElement) => void;
  sizes: string;
  className?: string;
  style?: React.CSSProperties;
  /** Force a frame ratio (cinematic letterbox); otherwise the photo's own ratio. */
  frameRatio?: number;
  objectPosition?: string;
}

/**
 * Frame — one clickable photograph. Never stretched: shown at its own aspect
 * ratio, or (landscapes only) deliberately letterboxed in the cinematic
 * chapter.
 */
export function Frame({ photo, number, onOpen, sizes, className, style, frameRatio, objectPosition }: FrameProps) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      data-cursor="View"
      aria-label={`Open “${photo.caption ?? photo.alt}” full screen`}
      className={cn(
        "group relative block overflow-hidden rounded-[6px] bg-white/[0.04] cursor-zoom-in text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]",
        className
      )}
      style={{ aspectRatio: String(frameRatio ?? ratio(photo)), ...style }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className={cn(
          "object-cover transition-[transform,filter] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]",
          photo.mono && "img-mono"
        )}
        style={objectPosition ? { objectPosition } : undefined}
      />
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 md:p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
        aria-hidden="true"
      >
        <span className="text-[12px] md:text-[13px] text-white/90 leading-snug">{photo.caption}</span>
        <span className="text-[11px] text-white/60 tabular-nums">{String(number).padStart(2, "0")}</span>
      </span>
    </button>
  );
}

/**
 * Open handler shared by the layouts. `order` is the sequence the visitor
 * actually sees (it differs between the desktop and phone layouts), so the
 * viewer's next/previous and counter always match the screen.
 */
export type OpenPhoto = (order: Photo[], index: number, trigger: HTMLElement) => void;

interface JustifiedProps {
  photos: Photo[];
  /** Row lengths on desktop, e.g. [2, 3, 2]. */
  pattern: number[];
  onOpen: OpenPhoto;
}

/**
 * JustifiedGallery — editorial rows where every frame keeps its true aspect
 * ratio and each row shares one height (flex-grow = width / height). No
 * cropping, no ragged edges; rhythm comes from varying the row lengths.
 */
export function JustifiedGallery({ photos, pattern, onOpen }: JustifiedProps) {
  const renderRows = (rows: Photo[][], mobile: boolean) => {
    const order = rows.flat();
    return (
      <div className={cn("flex-col gap-2 md:gap-4", mobile ? "flex md:hidden" : "hidden md:flex")}>
        {rows.map((row, r) => (
          <div key={r} data-reveal-child className="flex gap-2 md:gap-4">
            {row.map((p) => {
              const share = ratio(p) / row.reduce((sum, q) => sum + ratio(q), 0);
              const i = order.indexOf(p);
              return (
                <Frame
                  key={p.id}
                  photo={p}
                  number={i + 1}
                  onOpen={(el) => onOpen(order, i, el)}
                  style={{ flex: `${ratio(p)} 1 0%`, minWidth: 0 }}
                  sizes={mobile ? `${Math.round(share * 100)}vw` : `(max-width: 1440px) ${Math.round(share * 90)}vw, ${Math.round(share * 1300)}px`}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderRows(toRows(photos, pattern), false)}
      {renderRows(toMobileRows(photos), true)}
    </>
  );
}

const LETTERBOX = 2.39;
const PAIR_RATIO = 2;

/**
 * CinematicGallery — widescreen frames: a full-width 2.39:1 letterbox, then a
 * pair, alternating. Landscapes are letterboxed (2.39:1 alone, 2:1 in a
 * pair); portraits are never letterboxed — they keep their own ratio and the
 * pair is justified so both frames share one height. Crop focus is set per
 * photo so subjects stay in frame.
 */
export function CinematicGallery({
  photos,
  focus = {},
  onOpen,
}: {
  photos: Photo[];
  focus?: Record<string, string>;
  onOpen: OpenPhoto;
}) {
  const blocks: Photo[][] = [];
  let i = 0;
  let wide = true;
  while (i < photos.length) {
    const take = wide ? 1 : 2;
    blocks.push(photos.slice(i, i + take));
    i += take;
    wide = !wide;
  }

  const frameRatio = (p: Photo, inPair: boolean) => (ratio(p) < 1 ? ratio(p) : inPair ? PAIR_RATIO : LETTERBOX);

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      {blocks.map((block, b) => {
        const inPair = block.length === 2;
        const total = block.reduce((sum, p) => sum + frameRatio(p, inPair), 0);
        return (
          <div
            key={b}
            data-reveal-child
            className={cn("flex gap-2 md:gap-4", inPair ? "flex-col md:flex-row" : "justify-center")}
          >
            {block.map((p) => {
              const r = frameRatio(p, inPair);
              const share = r / total;
              const lonePortrait = !inPair && r < 1;
              return (
                <Frame
                  key={p.id}
                  photo={p}
                  number={photos.indexOf(p) + 1}
                  onOpen={(el) => onOpen(photos, photos.indexOf(p), el)}
                  frameRatio={r}
                  objectPosition={focus[p.id]}
                  className={cn(inPair && "md:[flex:var(--grow)_1_0%] md:min-w-0", lonePortrait && "w-full max-w-[520px]", !inPair && !lonePortrait && "w-full")}
                  style={{ ["--grow" as string]: String(r) }}
                  sizes={inPair ? `(max-width: 768px) 100vw, ${Math.round(share * 100)}vw` : lonePortrait ? "520px" : "100vw"}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
