"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { copy, useLocale } from "@/components/locale";
import { PartnerLogos } from "@/components/partner-logos";
import {
  MANZIL_APP_NAME_EN,
  MANZIL_APP_NAME_UR,
  MANZIL_INTRO_HIGHLIGHTS,
  MANZIL_INTRO_PARAGRAPHS_UR,
} from "@/lib/manzil-intro-copy";

const STEP_COUNT = 2;

type AppIntroProps = {
  onComplete: () => void;
};

export function AppIntro({ onComplete }: AppIntroProps) {
  const { language } = useLocale();
  const [step, setStep] = useState(0);
  const isLast = step === STEP_COUNT - 1;
  const rtl = language === "ur";
  const highlights = language === "ur" ? MANZIL_INTRO_HIGHLIGHTS.ur : MANZIL_INTRO_HIGHLIGHTS.en;

  const next = () => {
    if (isLast) onComplete();
    else setStep((value) => Math.min(value + 1, STEP_COUNT - 1));
  };

  const back = () => setStep((value) => Math.max(value - 1, 0));

  return (
    <div className="app-intro" role="dialog" aria-modal="true" aria-labelledby="app-intro-heading">
      <header className="app-intro__header">
        <PartnerLogos variant="intro" />
      </header>

      <div className="app-intro__main">
        <div className="app-intro__content" key={step}>
          <ManzilIntroBrand id={step === 0 ? "app-intro-heading" : undefined} />
          {step === 0 && (
            <IntroStep>
              <p className="app-intro__fulltext app-intro__fulltext--center urdu" lang="ur" dir="rtl">
                {MANZIL_INTRO_PARAGRAPHS_UR.join(" ")}
              </p>
            </IntroStep>
          )}

          {step === 1 && (
            <IntroStep>
              <p className="eyebrow">{copy(language, "Welcome", "خوش آمدید")}</p>
              <h2 className="app-intro__title urdu">
                {copy(language, "Information, guidance, and help", "معلومات، رہنمائی اور مدد")}
              </h2>
              <ul className="app-intro__bullets urdu" lang={language === "ur" ? "ur" : undefined} dir={language === "ur" ? "rtl" : undefined}>
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </IntroStep>
          )}

        </div>
      </div>

      <footer className="app-intro__footer">
        <div className="app-intro__dots" role="tablist" aria-label={copy(language, "Intro steps", "تعارف کے مراحل")}>
          {Array.from({ length: STEP_COUNT }, (_, index) => (
            <span
              key={index}
              role="tab"
              aria-selected={index === step}
              className={`app-intro__dot${index === step ? " app-intro__dot--active" : ""}`}
            />
          ))}
        </div>
        <div className="app-intro__actions" dir="ltr">
          {language === "en" && (
            <button type="button" className="app-intro__skip focus-ring" onClick={onComplete}>
              {copy(language, "Skip intro", "تعارف چھوڑیں")}
            </button>
          )}
          {step > 0 ? (
            <button type="button" className="btn-secondary app-intro__back focus-ring" onClick={back}>
              <ChevronRight size={18} aria-hidden className={rtl ? "" : "rotate-180"} />
              {copy(language, "Back", "پچھلا")}
            </button>
          ) : (
            <span className="app-intro__back-spacer" aria-hidden />
          )}
          <button type="button" className="btn-primary app-intro__next focus-ring" onClick={next}>
            {isLast ? copy(language, "Open main menu", "مینو کھولیں") : copy(language, "Next", "اگلا")}
            {!isLast && <ChevronLeft size={18} aria-hidden className={rtl ? "" : "rotate-180"} />}
          </button>
          {language === "ur" && (
            <button type="button" className="app-intro__skip focus-ring" onClick={onComplete}>
              {copy(language, "Skip intro", "تعارف چھوڑیں")}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

function ManzilIntroBrand({ id }: { id?: string }) {
  const { language } = useLocale();
  return (
    <div className="app-intro__brand-strip app-intro__brand-strip--stacked" dir="ltr">
      <div className="app-intro__logo-frame app-intro__logo-frame--stacked">
        <Image
          src="/brand/manzil_logo.jpeg"
          alt=""
          width={512}
          height={512}
          className="app-intro__logo"
          priority
          sizes="(max-width: 700px) 120px, 140px"
        />
      </div>
      <div className="app-intro__brand-copy">
        <p className="app-intro__title-mark" id={id}>
          Manzil
        </p>
        <p className="app-intro__title-sub">{MANZIL_APP_NAME_EN}</p>
        {language === "ur" && <p className="app-intro__title-ur">{MANZIL_APP_NAME_UR}</p>}
      </div>
    </div>
  );
}

function IntroStep({ children }: { children: React.ReactNode }) {
  return <div className="app-intro__step">{children}</div>;
}
