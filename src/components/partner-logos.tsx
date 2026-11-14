"use client";

import { ContentImage } from "@/components/content-image";
import { copy, useLocale } from "@/components/locale";

type PartnerLogo = {
  src: string;
  alt: string;
};

const logos: PartnerLogo[] = [
  { src: "/lrdi.png", alt: "Labour Research and Development Institute" },
  { src: "/puwf_logo.png", alt: "Pakistan United Workers Federation" },
  { src: "/government_Logo.png", alt: "Government of Pakistan" },
  { src: "/GC.png", alt: "German Cooperation" },
  { src: "/eu-flag.svg", alt: "European Union" },
  { src: "/ilo_logo.jpg", alt: "International Labour Organization" },
];

type PartnerLogosProps = {
  compact?: boolean;
  /** `topbar` and `login` hide the caption and use tighter layout for headers and sign-in. */
  variant?: "default" | "topbar" | "login" | "intro";
};

/** Institutional marks used in the booklet and intake service. Keep the marks unmodified. */
export function PartnerLogos({ compact = false, variant = "default" }: PartnerLogosProps) {
  const { language } = useLocale();
  const isCompact = compact || variant === "topbar" || variant === "login" || variant === "intro";
  return (
    <div
      className={[
        "partner-logos",
        isCompact ? "partner-logos--compact" : "",
        variant === "topbar" ? "partner-logos--topbar" : "",
        variant === "login" ? "partner-logos--login" : "",
        variant === "intro" ? "partner-logos--intro" : "",
      ].filter(Boolean).join(" ")}
      role="group"
      aria-label={copy(language, "Organizations featured in the Migration Booklet", "مائیگریشن کتابچے میں شامل ادارے")}
    >
      {variant !== "intro" && (
        <span className="partner-logos__label">
          {copy(language, "Organizations featured in the Migration Booklet", "مائیگریشن کتابچے میں شامل ادارے")}
        </span>
      )}
      <div className="partner-logos__track">
        {logos.map((logo) => (
          <span className="partner-logos__item" key={logo.alt} title={logo.alt}>
            <ContentImage src={logo.src} alt={logo.alt} preset="logo" />
          </span>
        ))}
      </div>
    </div>
  );
}
