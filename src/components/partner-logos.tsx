"use client";

import Image from "next/image";
import { copy, useLocale } from "@/components/locale";

type PartnerLogo = {
  src: string;
  alt: string;
  className?: string;
};

const logos: PartnerLogo[] = [
  { src: "/LRDI Labour Research Institute Logo.png", alt: "Labour Research and Development Institute", className: "h-9 w-[126px]" },
  { src: "/puwf_logo.png", alt: "Pakistan United Workers Federation", className: "h-11 w-[52px]" },
  { src: "/government_Logo.png", alt: "Government of Pakistan", className: "h-11 w-[52px]" },
  { src: "/GC.png", alt: "German Cooperation", className: "h-11 w-[82px]" },
  { src: "/eu-flag.svg", alt: "European Union", className: "h-10 w-[74px]" },
  { src: "/ilo_logo.jpg", alt: "International Labour Organization", className: "h-9 w-[88px]" },
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
            <Image src={logo.src} alt={logo.alt} width={160} height={72} className={`object-contain ${logo.className ?? ""}`} />
          </span>
        ))}
      </div>
    </div>
  );
}
