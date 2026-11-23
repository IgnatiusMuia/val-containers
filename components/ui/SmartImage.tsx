"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/format";
import { Icon } from "@/components/ui/Icons";

export function SmartImage({
  wrapperClassName,
  className,
  tone = "dark",
  fallbackLabel = "Photo coming soon",
  onLoad,
  onError,
  ...props
}: ImageProps & {
  wrapperClassName?: string;
  tone?: "dark" | "light";
  fallbackLabel?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const isAbsolute = wrapperClassName?.includes("absolute");

  return (
    <div
      className={cn(
        "overflow-hidden",
        !isAbsolute && "relative",
        !loaded &&
          !failed &&
          (tone === "light" ? "skeleton skeleton-light" : "skeleton"),
        wrapperClassName,
      )}
    >
      {failed ? (
        <div
          className={cn(
            "absolute inset-0 grid place-items-center",
            tone === "light" ? "bg-bone-2" : "bg-steel",
          )}
        >
          <div className="max-w-[220px] px-4 text-center">
            <Icon
              name="boxes"
              className={cn(
                "mx-auto h-6 w-6",
                tone === "light" ? "text-ink/20" : "text-bone/20",
              )}
            />
            {fallbackLabel ? (
              <p
                className={cn(
                  "mt-2 font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.14em]",
                  tone === "light" ? "text-ink/35" : "text-bone/35",
                )}
              >
                {fallbackLabel}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <Image
          {...props}
          alt={props.alt}
          onLoad={(event) => {
            setLoaded(true);
            onLoad?.(event);
          }}
          onError={(event) => {
            setFailed(true);
            onError?.(event);
          }}
          className={cn(
            className,
            "transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
