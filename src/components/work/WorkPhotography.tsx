"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PHOTOGRAPHY } from "@/data/photography";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const PHOTOS = PHOTOGRAPHY;
const PHOTO_TILE_CLASSES = [
  "col-span-2 md:col-span-3 row-span-2",
  "col-span-1 md:col-span-3 row-span-1",
  "col-span-1 md:col-span-2 row-span-2",
  "col-span-1 md:col-span-2 row-span-1",
  "col-span-2 md:col-span-4 row-span-2",
  "col-span-1 md:col-span-2 row-span-1",
];

/**
 * WorkPhotography — large editorial gallery for the Work page.
 * Photography is treated with equal weight to software, per Phase 3 spec:
 * minimal copy, large imagery, no Instagram-style grid.
 */
export function WorkPhotography() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const gridRef = useRevealChildren<HTMLDivElement>(25, { threshold: 0 });

  return (
    <section
      id="photography"
      className="py-20 md:py-28 lg:py-32 bg-[#F7F7F7]"
      aria-labelledby="work-photography-heading"
    >
      <Container>
        <div ref={headerRef} data-reveal className="mb-14 md:mb-18">
          <SectionHeader
            eyebrow="Photography"
            title="Frames worth holding onto."
            id="work-photography-heading"
          />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-5 auto-rows-[220px] md:auto-rows-[280px]"
        >
          {PHOTOS.map((photo, index) => (
            <PhotoTile
              key={photo.id}
              item={photo}
              className={PHOTO_TILE_CLASSES[index % PHOTO_TILE_CLASSES.length]}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

interface PhotoTileProps {
  item: (typeof PHOTOS)[0];
  className?: string;
}

function PhotoTile({ item, className }: PhotoTileProps) {
  if (!item) return null;

  return (
    <div
      data-reveal-child
      className={`media-item group relative overflow-hidden rounded-[14px] bg-[#E8E8E8] ${className ?? ""}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        loading="lazy"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        sizes="(max-width: 768px) 50vw, 33vw"
      />
      <div
        className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/10 transition-all duration-500"
        aria-hidden="true"
      />
    </div>
  );
}
