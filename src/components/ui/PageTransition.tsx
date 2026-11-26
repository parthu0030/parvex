"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * PageTransition — Wraps the page content and animates on route change.
 *
 * Visual language:
 *   incoming page: opacity 0→1, translateY 28px→0
 *   duration: ~550ms with premium ease
 *
 * Uses a ref + CSS transition (no Framer Motion dependency, no layout triggers).
 * Works with back/forward navigation and direct URL loads.
 * Reduced motion: immediate or simple fade only.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isRouteChange = prevPathRef.current !== pathname;
    prevPathRef.current = pathname;

    // Once the entrance finishes, drop every inline style. A lingering
    // transform would make this wrapper the containing block for all
    // `position: fixed` descendants (dialogs, lightboxes), pinning them to the
    // top of the document instead of the viewport.
    const clear = () => {
      el.style.transition = "";
      el.style.transform = "";
      el.style.opacity = "";
    };

    if (prefersReduced) {
      if (!isRouteChange) return;
      el.style.transition = "opacity 200ms ease-out";
      el.style.opacity = "0";
    } else {
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = `translateY(${isRouteChange ? 28 : 20}px)`;
    }

    const duration = prefersReduced ? 200 : isRouteChange ? 550 : 500;
    let raf2 = 0;
    let fallback = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!prefersReduced) {
          el.style.transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
          el.style.transform = "translateY(0)";
        }
        el.style.opacity = "1";
        // Fallback in case transitionend never fires (e.g. background tab).
        fallback = window.setTimeout(clear, duration + 100);
      });
    });

    const onEnd = (e: TransitionEvent) => {
      if (e.target === el) clear();
    };
    el.addEventListener("transitionend", onEnd);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(fallback);
      el.removeEventListener("transitionend", onEnd);
    };
  }, [pathname]);

  return (
    <div ref={wrapperRef}>
      {children}
    </div>
  );
}
