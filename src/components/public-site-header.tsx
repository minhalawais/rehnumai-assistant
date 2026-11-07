"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { BrandLockup } from "@/components/brand";
import { LanguageSwitch, copy, useLocale } from "@/components/locale";
import { PartnerLogos } from "@/components/partner-logos";

type PublicSiteHeaderProps = {
  showStaffSignIn?: boolean;
  trailing?: React.ReactNode;
  maxWidth?: "booklet" | "form" | "wide";
};

const widthClass = { booklet: "max-w-[1280px]", form: "max-w-[1100px]", wide: "max-w-[1400px]" } as const;

/** Shared public chrome: brand row, optional actions, partner logos. */
export function PublicSiteHeader({ showStaffSignIn = true, trailing, maxWidth = "booklet" }: PublicSiteHeaderProps) {
  const { language } = useLocale();

  return (
    <header className="public-site-header sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 backdrop-blur-sm">
      <div className={`public-site-header__inner mx-auto px-5 sm:px-8 ${widthClass[maxWidth]}`}>
        <div className="public-site-header__bar flex items-center justify-between gap-3">
          <Link href="/" aria-label={copy(language, "Rehnumai home", "رہنمائی کا صفحۂ آغاز")}>
            <BrandLockup compact className="public-site-header__brand" />
          </Link>
          <div className="public-site-header__partners-inline">
            <PartnerLogos variant="topbar" />
          </div>
          <div className="public-site-header__actions flex items-center gap-2 sm:gap-3">
            {trailing}
            <LanguageSwitch />
            {showStaffSignIn && (
              <Link href="/login" className="btn-secondary public-site-header__staff gap-1.5">
                <LockKeyhole size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{copy(language, "Staff sign in", "عملے کا لاگ اِن")}</span>
              </Link>
            )}
          </div>
        </div>
        <div className="shell-partner-bar border-t border-[var(--line)] py-2.5">
          <PartnerLogos variant="topbar" />
        </div>
      </div>
    </header>
  );
}
