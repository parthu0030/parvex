"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getPhoto } from "@/data/photography";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";

const PRINCIPLES = [
  {
    title: "Craft and code, one standard",
    body: "The person shaping how it looks sits next to the person building how it works. Nothing gets lost in a hand-off.",
  },
  {
    title: "Fewer projects, full attention",
    body: "We keep our roster small on purpose, so every project gets senior thinking from brief to launch.",
  },
  {
    title: "Honest technology",
    body: "We recommend the simplest stack that does the job well — and tell you plainly when AI isn't the answer.",
  },
];

/**
 * AboutPreview — the thinking behind the studio, on the homepage.
 */
export function AboutPreview() {
  const imageRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const textRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const listRef = useRevealChildren<HTMLUListElement>(90, { threshold: 0.1 });
  const photo = getPhoto("landscape-road");

  return (
    <section
      id="about"
      data-nav-theme="dark"
      className="py-24 md:py-32 lg:py-40 bg-[#0A0A0A] text-white"
      aria-labelledby="about-preview-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          <div
            ref={imageRef}
            data-reveal
            data-reveal-type="clip"
            className="lg:col-span-5 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-[14px] overflow-hidden bg-white/5 lg:sticky lg:top-28"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <span className="absolute bottom-4 left-4 text-[11px] tracking-[0.14em] uppercase text-white/80 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
              Photographed by Parvex
            </span>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-12">
            <div ref={textRef} data-reveal className="flex flex-col gap-7">
              <span className="eyebrow !text-white/40">About Parvex</span>
              <h2
                id="about-preview-heading"
                className="font-semibold tracking-[-0.035em] leading-[1.05]"
                style={{ fontSize: "clamp(32px, 4.4vw, 58px)" }}
              >
                We care how it looks
                <span className="font-light italic text-white/50"> and how it works.</span>
              </h2>
              <p className="text-[16px] md:text-[18px] text-white/60 leading-[1.75] max-w-[560px]">
                Parvex brings software engineering and visual craft into the
                same room, because the best digital work needs both. We bring
                engineering discipline to creative work — and a
                photographer&apos;s eye to software.
              </p>
            </div>

            <ul ref={listRef} className="flex flex-col border-t border-white/10">
              {PRINCIPLES.map((p, i) => (
                <li
                  key={p.title}
                  data-reveal-child
                  className="grid grid-cols-[40px_1fr] gap-4 py-7 border-b border-white/10"
                >
                  <span className="text-[12px] text-white/35 tabular-nums pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[19px] md:text-[21px] font-medium tracking-[-0.02em]">{p.title}</h3>
                    <p className="text-[15px] text-white/55 leading-[1.7] max-w-[520px]">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button
              href="/about"
              variant="secondary"
              size="md"
              className="w-fit btn-interactive border-white/30 text-white hover:bg-white hover:text-[#0A0A0A]"
            >
              More about the studio
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
