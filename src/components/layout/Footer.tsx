"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { FOOTER_SECTIONS } from "@/constants/navigation";
import { COMPANY, CONTACT_LINKS } from "@/data/company";
import { useRevealChildren } from "@/hooks/useReveal";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const colsRef = useRevealChildren<HTMLDivElement>(60, { threshold: 0.05 });

  return (
    <footer data-nav-theme="dark" className="bg-[#0A0A0A] text-white border-t border-white/[0.08]">
      <Container>
        {/* Columns */}
        <div
          ref={colsRef}
          className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 pt-20 md:pt-24 pb-14 md:pb-16"
        >
          <div data-footer-col data-reveal-child className="col-span-2 lg:col-span-6 flex flex-col gap-5">
            <Link
              href="/"
              className="w-fit hover:opacity-70 transition-opacity duration-200"
              aria-label="Parvex — home"
            >
              <Logo variant="mark" color="white" />
            </Link>
            <p className="text-[14px] text-white/45 leading-[1.7] max-w-[320px]">
              A creative technology studio designing and building websites,
              applications, automation, photography and film.
            </p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={CONTACT_LINKS.email}
                  className="link-draw text-[15px] text-white/80 hover:text-white transition-colors duration-200"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px]">
                <a
                  href={CONTACT_LINKS.phone}
                  className="link-draw text-white/80 hover:text-white transition-colors duration-200 tabular-nums"
                >
                  {COMPANY.phone}
                </a>
                <a
                  href={CONTACT_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <nav
              key={section.heading}
              aria-label={section.heading}
              data-footer-col
              data-reveal-child
              className="col-span-1 lg:col-span-3 flex flex-col gap-5"
            >
              <h2 className="text-[11px] font-semibold text-white/35 tracking-[0.14em] uppercase">
                {section.heading}
              </h2>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto") ? (
                      <a
                        href={link.href}
                        className="text-[14px] text-white/60 hover:text-white transition-colors duration-200"
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[14px] text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar — extra bottom padding keeps it clear of the floating nav */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 pb-28 md:pb-32 border-t border-white/[0.08]">
          <p className="text-[12px] text-white/35">
            © {currentYear} Parvex. All rights reserved.
          </p>
          <p className="text-[12px] text-white/35">{COMPANY.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
