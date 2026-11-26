"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getPhoto } from "@/data/photography";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

// Hand-sequenced for rhythm: landscape → portrait → landscape …
const LAYOUT: { id: string; className: string; sizes: string }[] = [
  { id: "landscape-summit", className: "col-span-2 md:col-span-7 aspect-[3/2]", sizes: "(max-width: 768px) 100vw, 58vw" },
  { id: "street-portrait", className: "col-span-1 md:col-span-5 aspect-[3/4] md:aspect-auto", sizes: "(max-width: 768px) 50vw, 42vw" },
  { id: "street-elders", className: "col-span-1 md:col-span-4 aspect-[3/4]", sizes: "(max-width: 768px) 50vw, 33vw" },
  { id: "landscape-snowline", className: "col-span-2 md:col-span-8 aspect-[3/2] md:aspect-auto", sizes: "(max-width: 768px) 100vw, 66vw" },
];

/**
 * MediaShowcase — Parvex's own photography, curated and sequenced.
 * No stock imagery and no fake "video" badges — just the work.
 */
export function MediaShowcase() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const gridRef = useRevealChildren<HTMLDivElement>(90, { threshold: 0.04 });

  return (
    <section
      id="photography"
      className="py-24 md:py-32 lg:py-40 bg-white"
      aria-labelledby="media-heading"
    >
      <Container>
        <div
          ref={headerRef}
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-14 md:mb-20 items-end"
        >
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="eyebrow">Photography & Film</span>
            <h2
              id="media-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-[34px] md:text-5xl lg:text-[56px]"
            >
              We also make
              <span className="font-light italic text-[#6B6B6B]"> the pictures.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <p className="text-[16px] text-[#6B6B6B] leading-[1.75] max-w-[440px]">
              Landscape and documentary work from our own archive — the same
              eye we bring to product, brand and event shoots for clients.
            </p>
            <Link
              href="/work#photography"
              className="group inline-flex items-center gap-2 text-[14px] font-medium text-[#0A0A0A] w-fit"
            >
              <span className="link-draw">See the full series</span>
              <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-5">
          {LAYOUT.map(({ id, className, sizes }) => {
            const photo = getPhoto(id);
            return (
              <figure
                key={id}
                data-reveal-child
                className={cn("group relative overflow-hidden rounded-[12px] bg-[#E8E8E8] image-hover-zoom", className)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover object-center"
                  sizes={sizes}
                />
                <figcaption className="absolute bottom-3 left-3 text-[10px] md:text-[11px] tracking-[0.14em] uppercase text-white/85 bg-black/35 backdrop-blur-sm rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {photo.category}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
