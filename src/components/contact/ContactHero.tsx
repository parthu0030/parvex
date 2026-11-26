"use client";

import { Mail, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { COMPANY, CONTACT_LINKS } from "@/data/company";
import { ACTIVE_SOCIAL_LINKS } from "@/data/social";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

const DETAILS = [
  { label: "Response time", value: "Within one working day" },
  { label: "Availability", value: "Taking on new projects" },
  { label: "Where we work", value: "Remote-first, with on-location shoots" },
];

export function ContactHero() {
  useHeroAnimation();

  return (
    <section className="relative pt-[140px] pb-16 md:pt-[190px] md:pb-20 bg-white" aria-labelledby="contact-hero-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-10">
            <div data-hero="eyebrow" data-hero-delay="60" className="flex items-center gap-3">
              <div className="w-5 h-px bg-[#6B6B6B]" aria-hidden="true" />
              <span className="eyebrow">Contact</span>
            </div>
            <h1
              id="contact-hero-heading"
              className="font-semibold tracking-[-0.045em] leading-[1.0] text-[#0A0A0A]"
              style={{ fontSize: "clamp(42px, 6.4vw, 88px)" }}
            >
              <span data-hero="h1-line" data-hero-delay="120">
                <span>Start your project</span>
              </span>
              <span data-hero="h1-line" data-hero-delay="200">
                <span className="font-light italic text-[#6B6B6B]">with Parvex.</span>
              </span>
            </h1>
            <p
              data-hero="subtext"
              data-hero-delay="320"
              className="text-base md:text-[18px] text-[#6B6B6B] leading-[1.7] max-w-[520px] tracking-[-0.01em]"
            >
              Four quick steps, about two minutes. No sales calls and no
              obligation — just a straight answer on how we&apos;d approach it.
            </p>
          </div>

          <aside
            data-hero="ctas"
            data-hero-delay="420"
            aria-label="Direct contact"
            className="lg:col-span-5 flex flex-col border-t border-[#E8E8E8]"
          >
            <a
              href={CONTACT_LINKS.email}
              className="group flex items-center justify-between gap-4 py-5 border-b border-[#E8E8E8]"
            >
              <span className="flex flex-col gap-1 min-w-0">
                <span className="eyebrow">Prefer email?</span>
                <span className="link-draw w-fit text-[18px] md:text-[20px] font-medium text-[#0A0A0A] tracking-[-0.02em] break-all">
                  {COMPANY.email}
                </span>
              </span>
              <Mail size={18} aria-hidden="true" className="flex-shrink-0 text-[#6B6B6B] group-hover:text-[#0A0A0A] transition-colors" />
            </a>
            <div className="flex items-center justify-between gap-4 py-5 border-b border-[#E8E8E8]">
              <a href={CONTACT_LINKS.phone} className="group flex flex-col gap-1">
                <span className="eyebrow">Call us</span>
                <span className="link-draw w-fit text-[18px] md:text-[20px] font-medium text-[#0A0A0A] tracking-[-0.02em] tabular-nums">
                  {COMPANY.phone}
                </span>
              </a>
              <a
                href={CONTACT_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Message Parvex on WhatsApp at ${COMPANY.phone}`}
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-[#0A0A0A] px-4 py-2 text-[13px] font-medium text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors duration-300"
              >
                <MessageCircle size={15} aria-hidden="true" />
                WhatsApp
              </a>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex sm:flex-col lg:flex-row justify-between gap-1 sm:gap-1.5 lg:gap-4 py-4 border-b border-[#E8E8E8]">
                  <dt className="text-[13px] text-[#8A8A8A]">{d.label}</dt>
                  <dd className="text-[14px] text-[#0A0A0A]">{d.value}</dd>
                </div>
              ))}
            </dl>
            {ACTIVE_SOCIAL_LINKS.length > 0 && (
              <ul className="flex gap-5 pt-4">
                {ACTIVE_SOCIAL_LINKS.map((s) => (
                  <li key={s.platform}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-draw text-[14px] text-[#0A0A0A]">
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </Container>
    </section>
  );
}
