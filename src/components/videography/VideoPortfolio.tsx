"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { FEATURED_VIDEO_IDS, VIDEOGRAPHY, VIDEO_CATEGORIES, formatDuration } from "@/data/videography";
import { useReveal, useRevealChildren } from "@/hooks/useReveal";
import { VideoFrame, VideoMeta } from "@/components/videography/VideoCard";
import { VideoPlayer } from "@/components/videography/VideoPlayer";
import { cn } from "@/lib/utils";
import type { Video } from "@/types";

/**
 * VideoPortfolio — Parvex's film work, on the Videography Showcase page.
 *
 * Editorial hierarchy: two featured films in large alternating split
 * layouts, then the rest as a 9:16 card grid. Nothing autoplays with sound;
 * posters load lazily, hover previews load on first hover, and full films
 * load only when opened in the player.
 */
export function VideoPortfolio() {
  const headerRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const gridRef = useRevealChildren<HTMLDivElement>(90, { threshold: 0.05 });
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  // Viewer order = on-screen order: featured first, then the grid.
  const { featured, rest, order } = useMemo(() => {
    const featured = FEATURED_VIDEO_IDS.map((id) => VIDEOGRAPHY.find((v) => v.id === id)).filter(
      (v): v is Video => !!v
    );
    const rest = VIDEOGRAPHY.filter((v) => !featured.includes(v));
    return { featured, rest, order: [...featured, ...rest] };
  }, []);

  const openFilm = useCallback(
    (video: Video, trigger: HTMLElement) => {
      lastTrigger.current = trigger;
      setOpen(order.indexOf(video));
    },
    [order]
  );
  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  const totalSeconds = VIDEOGRAPHY.reduce((n, v) => n + (v.duration ?? 0), 0);
  const categories = VIDEO_CATEGORIES.filter((c) => VIDEOGRAPHY.some((v) => v.category === c));

  if (VIDEOGRAPHY.length === 0) return null;

  return (
    <section
      id="films"
      data-nav-theme="dark"
      className="bg-[#0A0A0A] text-white py-24 md:py-32 lg:py-40"
      aria-labelledby="films-heading"
    >
      <Container>
        {/* Intro */}
        <div
          ref={headerRef}
          data-reveal
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end pb-16 md:pb-24"
        >
          <div className="lg:col-span-7 flex flex-col gap-7">
            <span className="eyebrow !text-white/40">Films</span>
            <h2
              id="films-heading"
              className="font-semibold tracking-[-0.045em] leading-[0.98]"
              style={{ fontSize: "clamp(40px, 6.4vw, 92px)" }}
            >
              Stories told
              <span className="font-light italic text-white/45"> in motion.</span>
            </h2>
            <p className="text-[16px] md:text-[18px] text-white/60 leading-[1.75] max-w-[560px]">
              Events, travel, product sets and recipes — shot vertical for the
              way people actually watch now. Hover to preview, click to play
              with sound.
            </p>
          </div>
          <dl className="lg:col-span-5 grid grid-cols-3 border-t border-white/10">
            {[
              { label: "Films", value: String(VIDEOGRAPHY.length) },
              { label: "Running time", value: formatDuration(totalSeconds) },
              { label: "Categories", value: String(categories.length) },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1.5 pt-5">
                <dt className="text-[11px] tracking-[0.16em] uppercase text-white/40">{s.label}</dt>
                <dd className="text-[24px] md:text-[30px] font-semibold tracking-[-0.03em] tabular-nums">{s.value}</dd>
              </div>
            ))}
            <p className="col-span-3 pt-5 text-[13px] text-white/40">{categories.join(" · ")}</p>
          </dl>
        </div>

        {/* Featured films — large, alternating */}
        <div className="flex flex-col gap-20 md:gap-28">
          {featured.map((video, i) => (
            <FeaturedFilm key={video.id} video={video} index={i} flip={i % 2 === 1} onOpen={openFilm} />
          ))}
        </div>

        {/* The rest — cinematic card grid */}
        {rest.length > 0 && (
          <div className="mt-24 md:mt-36">
            <div className="flex items-end justify-between gap-6 pb-6 mb-8 md:mb-12 border-b border-white/10">
              <h3 className="font-semibold tracking-[-0.035em] leading-[1.02]" style={{ fontSize: "clamp(28px, 3.4vw, 48px)" }}>
                More films
              </h3>
              <span className="text-[12px] text-white/40 tabular-nums">{rest.length} films</span>
            </div>
            <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10 md:gap-x-5 md:gap-y-14">
              {rest.map((video, i) => (
                <article key={video.id} data-reveal-child className="flex flex-col gap-4" aria-labelledby={`${video.id}-title`}>
                  <VideoFrame
                    video={video}
                    onOpen={(el) => openFilm(video, el)}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="flex flex-col gap-2">
                    <VideoMeta video={video} />
                    <h4 id={`${video.id}-title`} className="text-[17px] md:text-[20px] font-medium tracking-[-0.02em] leading-[1.2]">
                      <span className="text-white/35 tabular-nums mr-2 text-[13px]">{String(featured.length + i + 1).padStart(2, "0")}</span>
                      {video.title}
                    </h4>
                    <p className="text-[14px] text-white/55 leading-[1.65] line-clamp-3 md:line-clamp-none">{video.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </Container>

      {open !== null && (
        <VideoPlayer videos={order} index={open} onIndexChange={setOpen} onClose={close} />
      )}
    </section>
  );
}

function FeaturedFilm({
  video,
  index,
  flip,
  onOpen,
}: {
  video: Video;
  index: number;
  flip: boolean;
  onOpen: (video: Video, trigger: HTMLElement) => void;
}) {
  const ref = useReveal<HTMLElement>({ threshold: 0.1 });
  return (
    <article
      ref={ref}
      data-reveal
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-center"
      aria-labelledby={`${video.id}-title`}
    >
      <div className={cn("lg:col-span-5 w-full max-w-[460px] mx-auto lg:mx-0", flip && "lg:order-last lg:justify-self-end")}>
        <VideoFrame
          video={video}
          onOpen={(el) => onOpen(video, el)}
          sizes="(max-width: 520px) 90vw, 460px"
        />
      </div>
      <div className={cn("lg:col-span-7 flex flex-col gap-6 w-full max-w-[460px] mx-auto lg:max-w-none lg:mx-0", flip && "lg:pl-8")}>
        <span className="text-[13px] text-white/35 tabular-nums">{String(index + 1).padStart(2, "0")} — Featured</span>
        <VideoMeta video={video} />
        <h3
          id={`${video.id}-title`}
          className="font-semibold tracking-[-0.04em] leading-[1.0]"
          style={{ fontSize: "clamp(34px, 5vw, 72px)" }}
        >
          {video.title}
        </h3>
        <p className="text-[16px] md:text-[18px] text-white/60 leading-[1.75] max-w-[520px]">{video.description}</p>
        <button
          type="button"
          onClick={(e) => onOpen(video, e.currentTarget)}
          className="group inline-flex w-fit items-center gap-3 rounded-full bg-white text-[#0A0A0A] pl-6 pr-2 py-2 text-[14px] font-semibold hover:bg-white/90 transition-colors duration-300"
        >
          Play film
          <span className="w-9 h-9 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center transition-transform duration-500 group-hover:scale-110" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5v9l7.5-4.5z" /></svg>
          </span>
        </button>
      </div>
    </article>
  );
}
