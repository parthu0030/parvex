"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/constants/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // True while a section marked data-nav-theme="dark" sits under the header,
  // so the header inverts instead of laying a grey film over black sections.
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      const probe = 36;
      const dark = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]')).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      });
      setOnDark(dark);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const onContact = pathname.startsWith("/contact");

  return (
    <>
      {/* TOP HEADER — brand + persistent project CTA */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 px-5 py-4 md:px-8 md:py-5 flex items-center justify-between pointer-events-none transition-[background-color,border-color,color] duration-500",
          onDark ? "text-white" : "text-[#0A0A0A]",
          !scrolled
            ? "bg-transparent border-b border-transparent"
            : onDark
              ? "bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-white/10"
              : "bg-white/85 backdrop-blur-lg border-b border-black/[0.06]"
        )}
      >
        <Link
          href="/"
          aria-label="Parvex — home"
          className="pointer-events-auto hover:opacity-70 transition-opacity duration-300 rounded-full"
        >
          <Logo variant="icon-only" className="w-9 h-9 md:w-10 md:h-10" />
        </Link>

        <Link
          href="/"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 text-lg md:text-[21px] font-extrabold tracking-tight pointer-events-auto select-none uppercase"
        >
          Parvex
        </Link>

        <Link
          href="/contact"
          aria-hidden={onContact || undefined}
          tabIndex={onContact ? -1 : undefined}
          className={cn(
            "pointer-events-auto group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 md:px-5 md:py-2.5 text-[12px] md:text-[13px] font-medium tracking-[-0.01em] transition-[background-color,color,border-color,opacity] duration-300",
            onDark
              ? "border-white/60 text-white hover:bg-white hover:text-[#0A0A0A]"
              : "border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white",
            onContact && "opacity-0 pointer-events-none"
          )}
        >
          <span className="hidden sm:inline">Start a project</span>
          <span className="sm:hidden">Let&apos;s talk</span>
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </header>

      {/* BOTTOM PILL NAV */}
      <div className="fixed bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-24px)]">
        <nav
          aria-label="Primary"
          className="h-[50px] md:h-[56px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-full flex items-center p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
        >
          <ul className="flex items-center gap-0.5 md:gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-3 sm:px-4 md:px-5 py-2 md:py-2.5 text-[12px] sm:text-[13px] md:text-sm font-semibold tracking-wide transition-colors duration-300",
                      active
                        ? "bg-white text-black"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
