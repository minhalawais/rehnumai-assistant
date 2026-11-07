import Image from "next/image";

export function BrandMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return <Image src="/brand/rehnumai-mark-512.png" alt="Rehnumai" width={size} height={size} className={`object-contain ${className}`} priority />;
}

export function BrandLockup({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return <div className={`flex items-center gap-3 ${className}`}>
    <BrandMark size={compact ? 34 : 42} />
    <span><span className={`block font-semibold tracking-tight text-[var(--navy-950)] ${compact ? "text-base" : "text-lg"}`}>rehnumai</span><span className="block text-[9px] uppercase tracking-[.24em] text-[var(--ink-500)]">migration support</span></span>
  </div>;
}
