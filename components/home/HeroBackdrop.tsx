"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/format";
import { Icon } from "@/components/ui/Icons";
import { SmartImage } from "@/components/ui/SmartImage";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

export function HeroBackdrop({
  videoSrc,
  posterSrc,
  posterAlt,
}: {
  videoSrc: string;
  posterSrc: string;
  posterAlt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowVideo, setAllowVideo] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const connection = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection;
    const slowConnection =
      Boolean(connection?.saveData) ||
      ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");

    const update = () => {
      setReduceMotion(motionQuery.matches);
      setAllowVideo(desktopQuery.matches && !slowConnection);
    };

    update();
    desktopQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);

    return () => {
      desktopQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!allowVideo || reduceMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const attempt = video.play();
    attempt?.catch(() => setPlaying(false));
  }, [allowVideo, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) videoRef.current?.pause();
  }, [reduceMotion]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-0">
        <SmartImage
          src={posterSrc}
          alt={posterAlt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          wrapperClassName="absolute inset-0"
          className="object-cover object-center"
          fallbackLabel="Yard photo coming soon"
        />

        {allowVideo && !failed ? (
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
              ready ? "opacity-100" : "opacity-0",
            )}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay={!reduceMotion}
            aria-hidden="true"
            tabIndex={-1}
            onLoadedData={() => setReady(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          >
            <source
              src={videoSrc}
              type="video/mp4"
              onError={() => setFailed(true)}
            />
          </video>
        ) : null}
      </div>

      {allowVideo && !failed ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={
            playing ? "Pause background video" : "Play background video"
          }
          aria-pressed={playing}
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center border border-bone/20 bg-ink/60 text-bone/70 backdrop-blur-sm transition-colors hover:border-bone/45 hover:text-bone sm:right-6 sm:top-6"
        >
          <Icon name={playing ? "pause" : "play"} className="h-4 w-4" />
        </button>
      ) : null}
    </>
  );
}
