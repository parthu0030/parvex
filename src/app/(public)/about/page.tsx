import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutPhilosophy } from "@/components/about/AboutPhilosophy";
import { AboutPrinciples } from "@/components/about/AboutPrinciples";
import { AboutDisciplines } from "@/components/about/AboutDisciplines";
import { CTASection } from "@/components/home/CTASection";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description:
    "Parvex is a creative technology studio that holds design, engineering, photography and film to the same standard. Our vision, philosophy and the way we work.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutPhilosophy />
      <AboutDisciplines />
      <AboutPrinciples />
      <CTASection headline="Let's turn your idea into reality." ctaLabel="Start your project" />
    </>
  );
}
