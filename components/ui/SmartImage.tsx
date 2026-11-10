"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/format";

export function SmartImage({
  wrapperClassName,
  className,
  tone = "dark",
  onLoad,
  ...props
}: ImageProps & {
  wrapperClassName?: string;
  tone?: "dark" | "light";
}) {
  const [loaded, setLoaded] = useState(false);
  const isAbsolute = wrapperClassName?.includes("absolute");

  return (
    <div
      className={cn(
        "overflow-hidden",
        !isAbsolute && "relative",
        !loaded && (tone === "light" ? "skeleton skeleton-light" : "skeleton"),
        wrapperClassName,
      )}
    >
      <Image
        {...props}
        alt={props.alt}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={cn(
          className,
          "transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
