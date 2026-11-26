"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { COMPANY, CONTACT_LINKS } from "@/data/company";
import { INQUIRY_OPTIONS } from "@/lib/validations/contact";
import { useReveal } from "@/hooks/useReveal";

/**
 * CTASection — the closing conversion block used across public pages.
 * One message, one primary action, plus service shortcuts that pre-fill the
 * contact form so a visitor can start an enquiry in one click.
 */
export function CTASection({
  headline = "Have a project in mind?",
  ctaLabel = "Start your project",
  ctaLink = "/contact",
  contactEmail = COMPANY.email,
}: {
  headline?: string;
  ctaLabel?: string;
  ctaLink?: string;
  contactEmail?: string;
}) {
  const contentRef = useReveal<HTMLDivElement>({ threshold: 0.12 });

  return (
    <section
      id="contact"
      data-nav-theme="dark"
      className="py-24 md:py-32 lg:py-40 bg-[#0A0A0A] text-white"
      aria-labelledby="cta-heading"
    >
      <Container>
        <div ref={contentRef} data-reveal className="flex flex-col gap-14 md:gap-16">
          <div className="flex flex-col gap-7 max-w-[980px]">
            <span className="eyebrow !text-white/40">Start a project</span>
            <h2
              id="cta-heading"
              className="font-semibold tracking-[-0.045em] leading-[0.98]"
              style={{ fontSize: "clamp(42px, 7vw, 104px)" }}
            >
              {headline}
              {!/exceptional/i.test(headline) && (
                <>
                  <br />
                  <span className="font-light italic text-white/45">Let&apos;s build something exceptional.</span>
                </>
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end pt-10 border-t border-white/10">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <p className="text-[15px] text-white/55 leading-[1.7] max-w-[480px]">
                Tell us what you need help with. A short note is enough — we
                reply within one working day with honest next steps.
              </p>
              <ul className="flex flex-wrap gap-2" aria-label="Start an enquiry about a specific service">
                {INQUIRY_OPTIONS.filter((o) => o.value !== "something-else").map((o) => (
                  <li key={o.value}>
                    <Link
                      href={`/contact?service=${o.value}`}
                      className="inline-flex text-[13px] text-white/75 border border-white/15 rounded-full px-4 py-2 hover:bg-white hover:text-[#0A0A0A] hover:border-white transition-colors duration-300"
                    >
                      {o.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-5">
              <Link
                href={ctaLink}
                className="group inline-flex items-center gap-3 rounded-full bg-white text-[#0A0A0A] pl-8 pr-2 py-2 text-[15px] font-semibold tracking-[-0.01em] hover:bg-white/90 transition-colors duration-300"
              >
                {ctaLabel.replace(/\s*→\s*$/, "")}
                <span className="w-11 h-11 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </Link>
              <p className="text-[14px] text-white/45 lg:text-right leading-[1.8]">
                Or email{" "}
                <a href={`mailto:${contactEmail}`} className="link-draw text-white/85 hover:text-white">
                  {contactEmail}
                </a>
                <br />
                Call{" "}
                <a href={CONTACT_LINKS.phone} className="link-draw text-white/85 hover:text-white tabular-nums">
                  {COMPANY.phone}
                </a>{" "}
                ·{" "}
                <a
                  href={CONTACT_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw text-white/85 hover:text-white"
                >
                  WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
