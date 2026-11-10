"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppIntro } from "@/components/app-intro";
import { AppSplash } from "@/components/app-splash";
import { PublicIntakeForm } from "@/components/public-intake-form";
import { copy, LanguageSwitch, useLocale } from "@/components/locale";
import { PartnerLogos } from "@/components/partner-logos";

type LaunchPhase = "splash" | "intro" | "form" | "app";

const STAFF_PREFIXES = ["/login", "/portal", "/account-help", "/staff-privacy"];

function isStaffPath(pathname: string) {
  return STAFF_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AppLaunchGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<LaunchPhase>("splash");
  const staff = isStaffPath(pathname);
  const appActive = staff || phase === "app";

  const enterMenu = useCallback(() => {
    setPhase("app");
    if (pathname !== "/" || window.location.search) router.replace("/");
  }, [pathname, router]);

  useEffect(() => {
    document.body.classList.toggle("app-launch-lock", !appActive);
    return () => document.body.classList.remove("app-launch-lock");
  }, [appActive]);

  return (
    <>
      {!staff && phase === "splash" && <AppSplash onComplete={() => setPhase((current) => (current === "splash" ? "intro" : current))} />}
      {!staff && phase === "intro" && <AppIntro onComplete={() => setPhase("form")} />}
      {!staff && phase === "form" && <LaunchEntry onDone={enterMenu} />}
      <div className={appActive ? undefined : "app-launch-gate__behind"} inert={appActive ? undefined : true}>
        {children}
      </div>
    </>
  );
}

function LaunchEntry({ onDone }: { onDone: () => void }) {
  const { language } = useLocale();

  return (
    <div className="launch-entry" role="dialog" aria-modal="true" aria-labelledby="launch-entry-title">
      <header className="manzil-menu__top launch-entry__top">
        <div className="manzil-menu__top-inner">
          <PartnerLogos variant="intro" />
          <LanguageSwitch />
        </div>
      </header>
      <div className="launch-entry__bar">
        <h1 id="launch-entry-title" className="launch-entry__title urdu">{copy(language, "Enter your details", "اپنی معلومات درج کریں")}</h1>
        <button type="button" className="launch-entry__skip focus-ring" onClick={onDone}>
          {copy(language, "Skip for now", "ابھی چھوڑیں")}
        </button>
      </div>
      <div className="launch-entry__body">
        <PublicIntakeForm
          surface="launch"
          onDismiss={onDone}
          doneLabel={{ en: "Continue to the menu", ur: "مینو پر جائیں" }}
        />
      </div>
    </div>
  );
}
