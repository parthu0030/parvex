"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { getPhoto } from "@/data/photography";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

export function AboutHero() {
  useHeroAnimation();
  const photo = getPhoto("landscape-valley");

  return (
    <section className="relative pt-[140px] md:pt-[190px] bg-white" aria-labelledby="about-hero-heading">
      <Container className="flex flex-col gap-10 md:gap-14 pb-16 md:pb-20">
        <div data-hero="eyebrow" data-hero-delay="60" className="flex items-center gap-3">
          <div className="w-5 h-px bg-[#6B6B6B]" aria-hidden="true" />
          <span className="eyebrow">About Parvex</span>
        </div>

        <h1
          id="about-hero-heading"
          className="font-semibold tracking-[-0.045em] leading-[1.0] text-[#0A0A0A] max-w-[1100px]"
          style={{ fontSize: "clamp(42px, 7vw, 96px)" }}
        >
          <span data-hero="h1-line" data-hero-delay="120">
            <span>A studio for people who</span>
          </span>
          <span data-hero="h1-line" data-hero-delay="200">
            <span className="font-light italic text-[#6B6B6B]">notice the details.</span>
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <p
            data-hero="subtext"
            data-hero-delay="320"
            className="lg:col-start-7 lg:col-span-6 text-base md:text-[19px] text-[#4A4A4A] leading-[1.7] tracking-[-0.01em]"
          >
            Parvex is a creative technology studio. We design and engineer
            websites and applications, and we photograph and film
            the brands behind them — so the whole experience feels like it was
            made by one careful pair of hands.
          </p>
        </div>
      </Container>

      <div
        data-hero="image"
        data-hero-delay="420"
        className="relative w-full max-w-[1600px] mx-auto aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-[#E8E8E8]"
      >
        <Image src={photo.src} alt={photo.alt} fill priority className="object-cover object-[center_60%]" sizes="100vw" />
      </div>
    </section>
  );
}
