"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/hooks/useReveal";

const CAPABILITIES = [
  { title: "Brand & product films", body: "Concept, script, direction and shoot for launches and brand stories." },
  { title: "Event coverage", body: "Live performances, conferences and launches, captured as they happen." },
  { title: "Editing & colour", body: "Story structure, pacing, grade and sound for footage you already have." },
  { title: "Social cuts", body: "Vertical and short-form versions edited for each platform." },
];

/**
 * WorkVideography — film & motion capability.
 *
 * Stills from Parvex's own films (in colour) link through to the Videography
 * Showcase, where the films play. No fake "play" buttons over still images.
 */
export function WorkVideography() {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.08 });

  return (
    <section
      id="film"
      className="scroll-mt-24 py-24 md:py-32 lg:py-40 bg-white"
      aria-labelledby="work-film-heading"
    >
      <Container>
        <div ref={ref} data-reveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Posters from two of the studio's own films, in colour. */}
          <div className="lg:col-span-6 self-start grid grid-cols-5 gap-3 md:gap-4">
            <div className="col-span-3 relative aspect-[3/4] rounded-[12px] overflow-hidden bg-[#E8E8E8]">
              <Image
                src="/videos/posters/festive-fashion-behind-the-scenes.jpg"
                alt="Still from Parvex's festive-wear shoot: a model in a traditional outfit filmed against a red backdrop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 60vw, 30vw"
              />
            </div>
            <div className="col-span-2 relative rounded-[12px] overflow-hidden bg-[#E8E8E8]">
              <Image
                src="/videos/posters/navratri-nights.jpg"
                alt="Still from Parvex's Navratri Nights event film: musicians performing to an evening crowd"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 40vw, 20vw"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-8 lg:pl-6">
            <span className="eyebrow">Film & Motion</span>
            <h2
              id="work-film-heading"
              className="font-semibold tracking-[-0.035em] leading-[1.05] text-[#0A0A0A] text-[34px] md:text-5xl"
            >
              Stories told
              <span className="font-light italic text-[#6B6B6B]"> in motion.</span>
            </h2>
            <p className="text-[16px] text-[#6B6B6B] leading-[1.75] max-w-[520px]">
              From pre-production to final grade, we shoot and edit video with
              the same intent we bring to photography: every frame has a job.
              Watch the films in the Videography Showcase.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-[#E8E8E8]">
              {CAPABILITIES.map((c) => (
                <li key={c.title} className="py-5 border-b border-[#E8E8E8] flex flex-col gap-1.5">
                  <h3 className="text-[16px] font-semibold text-[#0A0A0A] tracking-[-0.01em]">{c.title}</h3>
                  <p className="text-[14px] text-[#6B6B6B] leading-[1.6]">{c.body}</p>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/work/videography-showcase" variant="primary" size="md" className="w-fit btn-interactive">
                Watch the films
              </Button>
              <Button href="/contact?service=videography" variant="secondary" size="md" className="w-fit btn-interactive">
                Start a video project
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
