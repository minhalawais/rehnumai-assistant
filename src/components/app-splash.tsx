"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ManzilLogo } from "@/components/brand";
import { MANZIL_APP_NAME_EN } from "@/lib/manzil-intro-copy";

const MIN_VISIBLE_MS = 2000;
const EXIT_MS = 450;

type SplashPhase = "pending" | "visible" | "exiting" | "off";

type AppSplashProps = {
  onComplete?: () => void;
};

export function AppSplash({ onComplete }: AppSplashProps) {
  const [phase, setPhase] = useState<SplashPhase>("pending");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useLayoutEffect(() => {
    setPhase("visible");

    let exitTimer: number | undefined;
    let hideTimer: number | undefined;

    exitTimer = window.setTimeout(() => {
      setPhase("exiting");
      hideTimer = window.setTimeout(() => {
        setPhase("off");
        onCompleteRef.current?.();
      }, EXIT_MS);
    }, MIN_VISIBLE_MS);

    return () => {
      if (exitTimer !== undefined) window.clearTimeout(exitTimer);
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };
  }, []);

  useLayoutEffect(() => {
    const active = phase === "visible" || phase === "exiting";
    document.body.classList.toggle("app-splash-lock", active);
    return () => document.body.classList.remove("app-splash-lock");
  }, [phase]);

  if (phase === "pending" || phase === "off") return null;

  return (
    <div
      className={`app-splash${phase === "exiting" ? " app-splash--exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={MANZIL_APP_NAME_EN}
    >
      <div className="app-splash__glow" aria-hidden="true" />
      <div className="app-splash__content app-splash__content--brief">
        <ManzilLogo size={176} className="app-splash__logo" priority decorative />
        <h1 className="sr-only">{MANZIL_APP_NAME_EN}</h1>
        <div className="app-splash__progress" aria-hidden="true">
          <span className="app-splash__progress-bar" />
        </div>
      </div>
    </div>
  );
}
