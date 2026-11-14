import Image from "next/image";
import type { CSSProperties } from "react";
import { MANZIL_APP_NAME_EN } from "@/lib/manzil-intro-copy";

export const MANZIL_LOGO_SRC = "/brand/Manzil Pakistan Migrant Workers App.png";

type ManzilLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
};

export function ManzilLogo({
  size = 64,
  className = "",
  priority = false,
  decorative = false,
}: ManzilLogoProps) {
  return (
    <span
      className={`manzil-logo ${className}`.trim()}
      style={{ "--manzil-logo-size": `${size}px` } as CSSProperties}
    >
      <Image
        src={MANZIL_LOGO_SRC}
        alt={decorative ? "" : MANZIL_APP_NAME_EN}
        width={1254}
        height={1254}
        className="manzil-logo__image"
        priority={priority}
        sizes={`${size}px`}
      />
    </span>
  );
}

export function BrandMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return <ManzilLogo size={size} className={className} />;
}

export function BrandLockup({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return <ManzilLogo size={compact ? 50 : 64} className={className} />;
}
