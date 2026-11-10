import Image from "next/image";
import { MANZIL_APP_NAME_EN, MANZIL_APP_TAGLINE_EN } from "@/lib/manzil-intro-copy";

export function BrandMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return <Image src="/brand/manzil-mark-512.png" alt={MANZIL_APP_NAME_EN} width={size} height={size} className={`object-contain ${className}`} priority />;
}

export function BrandLockup({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return <div className={`flex items-center gap-3 ${className}`}>
    <BrandMark size={compact ? 36 : 44} />
    <span>
      <span className={`block font-semibold tracking-tight text-[var(--navy-950)] ${compact ? "text-base" : "text-lg"}`}>Manzil</span>
      <span className="block text-[10px] font-medium leading-tight text-[var(--ink-500)]">{MANZIL_APP_TAGLINE_EN}</span>
    </span>
  </div>;
}
