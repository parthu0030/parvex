"use client";

import { useCallback, useRef, useState } from "react";
import type { Photo } from "@/types";
import { Container } from "@/components/ui/Container";
import { PHOTO_COLLECTIONS, getCollection, type PhotoCollectionKey } from "@/data/photography";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";
import { CinematicGallery, JustifiedGallery, type OpenPhoto } from "@/components/work/photography/PhotoLayouts";
import { PhotoLightbox } from "@/components/work/photography/PhotoLightbox";

/** Desktop row rhythm per collection (row lengths). */
const ROW_PATTERNS: Partial<Record<PhotoCollectionKey, number[]>> = {
  Landscape: [2, 3, 2],
  // Rows of 3/5/4 keep every portrait shorter than a laptop viewport.
  Editorial: [3, 5, 4],
};

/** Crop focus for letterboxed frames, so subjects stay in shot. */
const CINEMATIC_FOCUS: Record<string, string> = {
  "landscape-peak": "center 58%",
  "landscape-snowline": "center 62%",
  "landscape-hills": "center 55%",
  "stage-performance": "center 80%",
};

const anchor = (key: string) => `photography-${key.toLowerCase()}`;

/**
 * WorkPhotography — the dedicated photography portfolio.
 *
 * Dark, immersive section with three chapters that genuinely fit the work:
 * Landscape (including the frames that used to sit on the homepage),
 * Cinematic Frames and Editorial street portraits. Every frame opens in a
 * high-quality full-screen viewer.
 */
export function WorkPhotography() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [viewer, setViewer] = useState<{ title: string; photos: Photo[]; index: number } | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const openIn = useCallback(
    (title: string): OpenPhoto =>
      (photos, index, trigger) => {
        // Store the clicked frame itself: Safari doesn't focus buttons on
        // click, so document.activeElement can't be relied on.
        lastTrigger.current = trigger;
        setViewer({ title, photos, index });
      },
    []
  );
  const close = useCallback(() => {
    setViewer(null);
    lastTrigger.current?.focus();
  }, []);
  const setIndex = useCallback((index: number) => setViewer((v) => (v ? { ...v, index } : v)), []);

  const total = PHOTO_COLLECTIONS.reduce((n, c) => n + getCollection(c.key).length, 0);

  return (
    <section
      id="photography"
      data-nav-theme="dark"
      className="scroll-mt-0 bg-[#0A0A0A] text-white py-24 md:py-32 lg:py-40"
      aria-labelledby="work-photography-heading"
    >
      <Container>
        {/* Section intro + chapter index */}
        <div
          ref={headerRef}
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end pb-16 md:pb-24"
        >
          <div className="lg:col-span-7 flex flex-col gap-7">
            <span className="eyebrow !text-white/40">Photography</span>
            <h2
              id="work-photography-heading"
              className="font-semibold tracking-[-0.045em] leading-[0.98]"
              style={{ fontSize: "clamp(40px, 6.4vw, 92px)" }}
            >
              Frames worth
              <span className="font-light italic text-white/45"> holding onto.</span>
            </h2>
            <p className="text-[16px] md:text-[18px] text-white/60 leading-[1.75] max-w-[560px]">
              Composition, patience and light — the same instincts we bring to
              brand, product and event shoots for clients. Every photograph
              here was made by Parvex.
            </p>
          </div>

          <nav aria-label="Photography collections" className="lg:col-span-5 flex flex-col border-t border-white/10">
            {PHOTO_COLLECTIONS.map((c, i) => (
              <a
                key={c.key}
                href={`#${anchor(c.key)}`}
                className="group flex items-center justify-between gap-4 py-4 border-b border-white/10 text-[15px]"
              >
                <span className="flex items-center gap-4">
                  <span className="text-[12px] text-white/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="link-draw text-white/85 group-hover:text-white">{c.title}</span>
                </span>
                <span className="text-[13px] text-white/40 tabular-nums">{getCollection(c.key).length}</span>
              </a>
            ))}
            <p className="pt-4 text-[12px] text-white/35 tabular-nums">{total} photographs · Click any frame to view full screen</p>
          </nav>
        </div>

        {/* Chapters */}
        <div className="flex flex-col gap-24 md:gap-36">
          {PHOTO_COLLECTIONS.map((c, i) => (
            <Chapter
              key={c.key}
              index={i}
              collection={c}
              onOpen={openIn(c.title)}
            />
          ))}
        </div>
      </Container>

      {viewer && (
        <PhotoLightbox
          photos={viewer.photos}
          index={viewer.index}
          collectionTitle={viewer.title}
          onIndexChange={setIndex}
          onClose={close}
        />
      )}
    </section>
  );
}

function Chapter({
  index,
  collection,
  onOpen,
}: {
  index: number;
  collection: (typeof PHOTO_COLLECTIONS)[number];
  onOpen: OpenPhoto;
}) {
  const headRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const galleryRef = useRevealChildren<HTMLDivElement>(90, { threshold: 0.02 });
  const photos = getCollection(collection.key);

  return (
    <article id={anchor(collection.key)} className="scroll-mt-24" aria-labelledby={`${anchor(collection.key)}-title`}>
      <div
        ref={headRef}
        data-reveal
        className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-10 items-end mb-8 md:mb-12 pb-6 border-b border-white/10"
      >
        <div className="md:col-span-7 flex items-baseline gap-4 md:gap-6">
          <span className="text-[13px] text-white/35 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <h3
            id={`${anchor(collection.key)}-title`}
            className="font-semibold tracking-[-0.035em] leading-[1.02]"
            style={{ fontSize: "clamp(30px, 4vw, 56px)" }}
          >
            {collection.title}
          </h3>
        </div>
        <div className="md:col-span-5 flex flex-col gap-2 md:items-end md:text-right">
          <span className="text-[11px] tracking-[0.16em] uppercase text-white/40">
            {collection.kicker} · {photos.length} frames
          </span>
          <p className="text-[15px] text-white/60 leading-[1.7] max-w-[420px]">{collection.description}</p>
        </div>
      </div>

      <div ref={galleryRef}>
        {collection.key === "Cinematic" ? (
          <CinematicGallery photos={photos} focus={CINEMATIC_FOCUS} onOpen={onOpen} />
        ) : (
          <JustifiedGallery photos={photos} pattern={ROW_PATTERNS[collection.key] ?? [3]} onOpen={onOpen} />
        )}
      </div>
    </article>
  );
}
