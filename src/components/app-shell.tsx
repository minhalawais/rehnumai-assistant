"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/brand";
import { copy, LanguageSwitch, useLocale } from "@/components/locale";
import { PartnerLogos } from "@/components/partner-logos";

export function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const [signingOut, setSigningOut] = useState(false);
  const { language } = useLocale();
  const router = useRouter();

  async function signOut() {
    setSigningOut(true);
    try {
      const tokenResponse = await fetch("/api/auth/csrf");
      const token = (await tokenResponse.json()).data?.token ?? "";
      const response = await fetch("/api/auth/logout", { method: "POST", headers: { "x-csrf-token": token } });
      if (!response.ok) throw new Error("Sign out failed");
      router.replace("/login");
      router.refresh();
    } catch { setSigningOut(false); }
  }

  return <div className="app-shell min-h-screen bg-[var(--canvas)]">
    <header className="app-shell__header sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="app-shell__bar flex min-h-[52px] items-center justify-between gap-3">
          <Link href="/portal/submissions" aria-label={copy(language, "Rehnumai submitted forms", "جمع شدہ فارمز — رہنمائی")} className="app-shell__brand flex shrink-0 items-center gap-2 text-[var(--navy-950)]">
            <BrandMark size={30} /><span className="hidden text-sm font-semibold tracking-tight sm:inline">rehnumai</span>
          </Link>
          <div className="app-shell__partners-inline">
            <PartnerLogos variant="topbar" />
          </div>
          <div className="app-shell__actions flex items-center gap-2 sm:gap-2.5">
            <LanguageSwitch />
            <button type="button" onClick={signOut} disabled={signingOut} aria-label={copy(language, signingOut ? "Signing out" : "Sign out", signingOut ? "باہر نکل رہے ہیں" : "باہر نکلیں")} className="app-shell__sign-out btn-quiet min-h-10 gap-2 px-2 text-sm sm:px-2.5">
              <LogOut size={16} aria-hidden="true" /><span className="hidden sm:inline">{copy(language, signingOut ? "Signing out…" : "Sign out", signingOut ? "باہر نکل رہے ہیں…" : "باہر نکلیں")}</span>
            </button>
          </div>
        </div>
        <div className="shell-partner-bar app-shell__partners-strip border-t border-[var(--line)] py-2">
          <PartnerLogos variant="topbar" />
        </div>
      </div>
    </header>
    <main id="main-content" className="app-shell__main mx-auto w-full max-w-[1400px] px-5 py-4 sm:px-8 sm:py-5">
      <div className="app-shell__page-head mb-3 sm:mb-4">
        <h1 className="text-[22px] font-semibold leading-tight tracking-[-.03em] text-[var(--navy-950)] sm:text-[24px]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-[var(--ink-700)]" aria-live="polite">{subtitle}</p>}
      </div>
      {children}
    </main>
  </div>;
}
