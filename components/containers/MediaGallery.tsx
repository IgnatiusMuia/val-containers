"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ContainerMedia } from "@/data/containers";
import { cn } from "@/lib/format";
import { Icon } from "@/components/ui/Icons";
import { SmartImage } from "@/components/ui/SmartImage";

export function MediaGallery({
  media,
  name,
  representative = false,
}: {
  media: ContainerMedia[];
  name: string;
  representative?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = useCallback(
    (direction: number) => {
      setVideoError(false);
      setActive(
        (current) => (current + direction + media.length) % media.length,
      );
    },
    [media.length],
  );

  const openLightbox = (index: number) => {
    setActive(index);
    setVideoError(false);
    setLightbox(true);
  };

  useEffect(() => {
    if (!lightbox) return;

    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(false);
        return;
      }

      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("video")) return;

      event.preventDefault();
      go(event.key === "ArrowRight" ? 1 : -1);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [lightbox, go]);

  if (media.length === 0) return null;

  const item = media[active];

  return (
    <div>
      <div className="group relative aspect-[4/3] overflow-hidden border border-bone/12 bg-coal">
        <AnimatePresence initial={false}>
          <motion.div
            key={item.src}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {item.kind === "image" ? (
              <SmartImage
                src={item.src}
                alt={item.alt}
                fill
                loading="eager"
                sizes="(min-width: 1024px) 56vw, 100vw"
                wrapperClassName="absolute inset-0"
                className="object-cover"
              />
            ) : (
              <>
                <SmartImage
                  src={item.poster}
                  alt={item.alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  wrapperClassName="absolute inset-0"
                  className="object-cover"
                  fallbackLabel="Video preview coming soon"
                />
                <span
                  className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/25"
                  aria-hidden="true"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-bone/30 bg-ink/60 text-bone backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Icon name="play" className="ml-1 h-6 w-6" />
                  </span>
                </span>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => openLightbox(active)}
          aria-label={
            item.kind === "video"
              ? `Play video: ${item.alt}`
              : `Open larger image: ${item.alt}`
          }
          className="absolute inset-0 z-10"
        />

        <span className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-1.5 bg-ink/80 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/65 backdrop-blur-sm">
          {item.kind === "video" ? (
            <Icon name="play" className="h-2.5 w-2.5 text-ember" />
          ) : null}
          {active + 1} / {media.length} · {name}
        </span>
        {representative ? (
          <span className="pointer-events-none absolute right-3 top-3 z-20 bg-ink/80 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/60 backdrop-blur-sm">
            Yard example
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => openLightbox(active)}
          className="absolute bottom-3 right-3 z-20 hidden h-10 items-center gap-2 border border-bone/20 bg-ink/80 px-3 text-[11px] text-bone/70 backdrop-blur-sm transition-colors hover:border-bone/45 hover:text-bone group-hover:flex"
        >
          <Icon
            name={item.kind === "video" ? "play" : "search"}
            className="h-3.5 w-3.5"
          />
          {item.kind === "video" ? "Play video" : "Expand"}
        </button>

        {media.length > 1 ? (
          <div className="absolute bottom-3 left-3 z-20 flex gap-1.5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous media"
              className="grid h-10 w-10 place-items-center border border-bone/20 bg-ink/80 text-bone/65 backdrop-blur-sm transition-colors hover:border-bone/45 hover:text-bone"
            >
              <Icon name="chevron-left" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next media"
              className="grid h-10 w-10 place-items-center border border-bone/20 bg-ink/80 text-bone/65 backdrop-blur-sm transition-colors hover:border-bone/45 hover:text-bone"
            >
              <Icon name="chevron-right" className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      {media.length > 1 ? (
        <div
          className={cn(
            "mt-2 grid gap-2",
            media.length >= 4 ? "grid-cols-4" : "grid-cols-3",
          )}
        >
          {media.map((entry, index) => {
            const thumbnail =
              entry.kind === "image" ? entry.src : entry.poster;

            return (
              <button
                key={entry.src}
                type="button"
                onClick={() => {
                  if (entry.kind === "video") {
                    openLightbox(index);
                  } else {
                    setVideoError(false);
                    setActive(index);
                  }
                }}
                aria-label={
                  entry.kind === "video"
                    ? `Play video ${index + 1}: ${entry.alt}`
                    : `View image ${index + 1}: ${entry.alt}`
                }
                aria-pressed={index === active}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden border transition-all duration-200",
                  index === active
                    ? "border-ember opacity-100"
                    : "border-bone/12 opacity-50 hover:opacity-90",
                )}
              >
                <SmartImage
                  src={thumbnail}
                  alt=""
                  fill
                  sizes="15vw"
                  wrapperClassName="absolute inset-0"
                  className="object-cover"
                  fallbackLabel=""
                />
                {entry.kind === "video" ? (
                  <span
                    className="pointer-events-none absolute inset-0 grid place-items-center bg-ink/25"
                    aria-hidden="true"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-ink/75 text-bone">
                      <Icon name="play" className="ml-0.5 h-3 w-3" />
                    </span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            className="fixed inset-0 z-[110] flex flex-col bg-ink/97 backdrop-blur-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} media gallery`}
          >
            <div className="flex items-center justify-between border-b border-bone/12 px-4 py-3 sm:px-6">
              <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/45">
                {item.kind === "video" ? (
                  <Icon name="play" className="h-2.5 w-2.5 text-ember" />
                ) : null}
                {name} · {item.kind === "video" ? "Video" : "Photo"} ·{" "}
                {active + 1} / {media.length}
                {representative ? " · Yard example" : ""}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setLightbox(false)}
                aria-label="Close gallery"
                className="grid h-9 w-9 place-items-center border border-bone/15 text-bone/60 transition-colors hover:border-bone/40 hover:text-bone"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex-1">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={item.src}
                  initial={reduce ? false : { opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  {item.kind === "video" ? (
                    videoError ? (
                      <div className="grid h-full place-items-center p-6">
                        <div className="max-w-md border border-bone/15 bg-coal p-6 text-center">
                          <Icon
                            name="play"
                            className="mx-auto h-8 w-8 text-bone/25"
                          />
                          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-bone/40">
                            Video unavailable
                          </p>
                          <p className="mt-2 text-[12px] leading-relaxed text-bone/35">
                            This video is not available yet. Please check back
                            soon.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <video
                        key={item.src}
                        src={item.src}
                        poster={item.poster}
                        controls
                        autoPlay
                        playsInline
                        preload="metadata"
                        onError={() => setVideoError(true)}
                        aria-label={item.alt}
                        className="h-full w-full object-contain p-4 sm:p-10"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    <SmartImage
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="100vw"
                      wrapperClassName="absolute inset-0"
                      className="object-contain p-4 sm:p-10"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-bone/12 px-4 py-3 sm:px-6">
              <p className="hidden max-w-lg text-[11px] leading-relaxed text-bone/40 sm:block">
                {item.alt}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous media"
                  className="grid h-10 w-10 place-items-center border border-bone/20 text-bone/60 transition-colors hover:border-bone/45 hover:text-bone"
                >
                  <Icon name="chevron-left" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next media"
                  className="grid h-10 w-10 place-items-center border border-bone/20 text-bone/60 transition-colors hover:border-bone/45 hover:text-bone"
                >
                  <Icon name="chevron-right" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
