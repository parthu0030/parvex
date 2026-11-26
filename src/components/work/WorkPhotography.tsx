"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PHOTOGRAPHY } from "@/data/photography";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

const SERIES = [
  { key: "Landscape", title: "Landscape", note: "High-altitude Ladakh, in monochrome." },
  { key: "Street", title: "Street", note: "Documentary portraits and everyday moments." },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];

/**
 * WorkPhotography — Parvex's own photography as two curated series, with a
 * keyboard-accessible full-screen viewer.
 */
export function WorkPhotography() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [series, setSeries] = useState<SeriesKey>("Landscape");
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const photos = PHOTOGRAPHY.filter((p) => p.category === series);

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const current = open === null ? null : photos[open];

  return (
    <section
      id="photography"
      className="scroll-mt-24 py-24 md:py-32 lg:py-40 bg-[#F6F6F5]"
      aria-labelledby="work-photography-heading"
    >
      <Container>
        <div
          ref={headerRef}
          data-reveal
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-16"
        >
          <div className="flex flex-col gap-6 max-w-[640px]">
            <span className="eyebrow">Photography</span>
            <h2
              id="work-photography-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-[34px] md:text-5xl"
            >
              Frames worth
              <span className="font-light italic text-[#6B6B6B]"> holding onto.</span>
            </h2>
            <p className="text-[16px] text-[#6B6B6B] leading-[1.7]">
              {SERIES.find((s) => s.key === series)?.note} All photographs by Parvex.
            </p>
          </div>

          <div role="tablist" aria-label="Photography series" className="flex gap-2">
            {SERIES.map((s) => (
              <button
                key={s.key}
                role="tab"
                type="button"
                aria-selected={series === s.key}
                onClick={() => setSeries(s.key)}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-[13px] font-medium transition-colors duration-300",
                  series === s.key
                    ? "bg-[#0A0A0A] border-[#0A0A0A] text-white"
                    : "border-[#CFCFCF] text-[#6B6B6B] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                )}
              >
                {s.title}
                <span className="ml-2 tabular-nums opacity-60">
                  {PHOTOGRAPHY.filter((p) => p.category === s.key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Editorial masonry — CSS columns keep each photo's own aspect ratio */}
        <div key={series} role="tabpanel" aria-label={`${series} series`} className="columns-2 md:columns-3 gap-3 md:gap-5 animate-[fadeIn_600ms_ease-out]">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setOpen(i);
              }}
              className="group relative block w-full mb-3 md:mb-5 overflow-hidden rounded-[10px] bg-[#E2E2E2] break-inside-avoid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] focus-visible:ring-offset-2"
              aria-label={`View larger: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.aspect === "portrait" ? 1650 : 2200}
                height={photo.aspect === "portrait" ? 2200 : 1650}
                className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      </Container>

      {current && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[60] bg-[#0A0A0A]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 animate-[fadeIn_250ms_ease-out]"
          onClick={close}
        >
          <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[13px] text-white/60 text-center max-w-[80vw]">
            {current.alt} · {(open ?? 0) + 1} / {photos.length}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close viewer"
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous photo"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next photo"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronRight size={22} />
          </button>
        </div>,
        document.body
      )}
    </section>
  );
}
