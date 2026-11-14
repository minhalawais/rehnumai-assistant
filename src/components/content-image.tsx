"use client";

import Image, { type ImageProps } from "next/image";
import imageMeta from "@/lib/image-meta.json";

export type ContentImagePreset = "icon" | "cover" | "figure" | "logo";

const PRESET_SIZES: Record<ContentImagePreset, string> = {
  icon: "96px",
  cover: "(max-width: 720px) 100vw, 720px",
  figure: "(max-width: 720px) 100vw, 720px",
  logo: "160px",
};

const META = imageMeta as Record<string, { width: number; height: number }>;

function isSvg(src: string) {
  return src.split("?")[0].toLowerCase().endsWith(".svg");
}

type ContentImageProps = {
  src: string;
  alt: string;
  preset?: ContentImagePreset;
  /** Layout width hint when the slot is wider or narrower than the preset. */
  sizes?: string;
  className?: string;
  priority?: boolean;
  onError?: ImageProps["onError"];
};

export function ContentImage({ src, alt, preset = "figure", sizes, className, priority = false, onError }: ContentImageProps) {
  if (isSvg(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        onError={onError}
      />
    );
  }

  const size = META[src] ?? { width: 1200, height: 800 };
  return (
    <Image
      src={src}
      alt={alt}
      width={size.width}
      height={size.height}
      sizes={sizes ?? PRESET_SIZES[preset]}
      className={className}
      onError={onError}
      unoptimized={preset === "logo"}
      {...(priority ? { priority: true } : { loading: "lazy" as const })}
    />
  );
}
