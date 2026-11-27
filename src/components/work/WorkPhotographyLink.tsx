"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import {
  PHOTO_COLLECTIONS,
  PHOTOGRAPHY,
  PHOTOGRAPHY_SHOWCASE_PATH,
  collectionAnchor,
  getCollection,
} from "@/data/photography";
import { useReveal } from "@/hooks/useReveal";

/**
 * WorkPhotographyLink — compact signpost on the Work page.
 *
 * The photography portfolio lives on the Photography Showcase page; this band
 * keeps the Work page focused on projects while giving existing
 * `/work#photography` links (homepage, Work index) a clear way through. It is
 * text-only on purpose so no photograph appears on both pages.
 */
export function WorkPhotographyLink() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      id="photography"
      data-nav-theme="dark"
      className="scroll-mt-24 bg-[#0A0A0A] text-white py-20 md:py-28"
      aria-labelledby="work-photography-link-heading"
    >
      <Container>
        <div ref={ref} data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="eyebrow !text-white/40">Photography</span>
            <h2
              id="work-photography-link-heading"
              className="font-semibold tracking-[-0.04em] leading-[1.02]"
              style={{ fontSize: "clamp(34px, 4.8vw, 64px)" }}
            >
              Our photography,
              <span className="font-light italic text-white/45"> in one place.</span>
            </h2>
            <p className="text-[16px] text-white/60 leading-[1.75] max-w-[480px]">
              Our photography has its own home: {PHOTOGRAPHY.length} photographs
              across {PHOTO_COLLECTIONS.length} collections in the Photography
              Showcase.
            </p>
            <Link
              href={PHOTOGRAPHY_SHOWCASE_PATH}
              className="group inline-flex w-fit items-center gap-2.5 rounded-full bg-white text-[#0A0A0A] px-6 py-3.5 text-[14px] font-semibold hover:bg-white/90 transition-colors duration-300"
            >
              Open the Photography Showcase
              <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <nav aria-label="Photography collections" className="lg:col-span-6 flex flex-col border-t border-white/10">
            {PHOTO_COLLECTIONS.map((c, i) => (
              <Link
                key={c.key}
                href={`${PHOTOGRAPHY_SHOWCASE_PATH}#${collectionAnchor(c.key)}`}
                className="group grid grid-cols-[40px_1fr_auto] items-baseline gap-4 py-5 border-b border-white/10"
              >
                <span className="text-[12px] text-white/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-col gap-1">
                  <span className="link-draw w-fit text-[19px] md:text-[22px] font-medium tracking-[-0.02em] text-white/90 group-hover:text-white">
                    {c.title}
                  </span>
                  <span className="text-[13px] text-white/45">{c.kicker}</span>
                </span>
                <span className="text-[13px] text-white/40 tabular-nums">{getCollection(c.key).length}</span>
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
