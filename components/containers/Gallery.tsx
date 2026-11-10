"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ContainerImage } from "@/data/containers";
import { cn } from "@/lib/format";
import { Icon } from "@/components/ui/Icons";

export function Gallery({
  images,
  name,
}: {
  images: ContainerImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  const go = (direction: number) => {
    setActive((current) => (current + direction + images.length) % images.length);
  };

  useEffect(() => {
    if (!lightbox) return;

    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, images.length]);

  const image = images[active];

  return (
    <div>
      <div className="group relative aspect-[4/3] overflow-hidden border border-bone/12 bg-coal">
        {images.map((item, index) => (
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            fill
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            sizes="(min-width: 1024px) 56vw, 100vw"
            className={cn(
              "object-cover transition-opacity duration-500",
              index === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Open larger image"
          className="absolute inset-0 z-10"
        />

        <span className="pointer-events-none absolute left-3 top-3 z-20 bg-ink/80 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-bone/65 backdrop-blur-sm">
          {active + 1} / {images.length} · {name}
        </span>

        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Open larger image"
          className="absolute bottom-3 right-3 z-20 hidden h-10 items-center gap-2 border border-bone/20 bg-ink/80 px-3 text-[11px] text-bone/70 backdrop-blur-sm transition-colors hover:border-bone/45 hover:text-bone group-hover:flex"
        >
          <Icon name="search" className="h-3.5 w-3.5" />
          Expand
        </button>

        {images.length > 1 ? (
          <div className="absolute bottom-3 left-3 z-20 flex gap-1.5">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="grid h-10 w-10 place-items-center border border-bone/20 bg-ink/80 text-bone/65 backdrop-blur-sm transition-colors hover:border-bone/45 hover:text-bone"
            >
              <Icon name="chevron-left" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="grid h-10 w-10 place-items-center border border-bone/20 bg-ink/80 text-bone/65 backdrop-blur-sm transition-colors hover:border-bone/45 hover:text-bone"
            >
              <Icon name="chevron-right" className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {images.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}: ${item.alt}`}
              aria-pressed={index === active}
              className={cn(
                "relative aspect-[4/3] overflow-hidden border transition-all duration-200",
                index === active
                  ? "border-ember opacity-100"
                  : "border-bone/12 opacity-50 hover:opacity-90",
              )}
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="15vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            className="fixed inset-0 z-[110] flex flex-col bg-ink/97 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} image gallery`}
          >
            <div className="flex items-center justify-between border-b border-bone/12 px-4 py-3 sm:px-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone/45">
                {name} · {active + 1} / {images.length}
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
              <motion.div
                key={image.src}
                initial={reduce ? false : { opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                  className="object-contain p-4 sm:p-10"
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between border-t border-bone/12 px-4 py-3 sm:px-6">
              <p className="hidden max-w-lg text-[11px] leading-relaxed text-bone/40 sm:block">
                {image.alt}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous image"
                  className="grid h-10 w-10 place-items-center border border-bone/20 text-bone/60 transition-colors hover:border-bone/45 hover:text-bone"
                >
                  <Icon name="chevron-left" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next image"
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
