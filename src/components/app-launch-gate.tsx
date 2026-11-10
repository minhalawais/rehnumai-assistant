"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { AppIntro } from "@/components/app-intro";
import { AppSplash } from "@/components/app-splash";

const LAUNCH_SEEN_KEY = "manzil-launch-seen";
type LaunchPhase = "splash" | "intro" | "app";

export function AppLaunchGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<LaunchPhase>("splash");

  useLayoutEffect(() => {
    if (window.sessionStorage.getItem(LAUNCH_SEEN_KEY) === "1") setPhase("app");
  }, []);

  const splashComplete = useCallback(() => {
    setPhase((current) => (current === "app" ? current : "intro"));
  }, []);

  const introComplete = useCallback(() => {
    window.sessionStorage.setItem(LAUNCH_SEEN_KEY, "1");
    setPhase("app");
  }, []);

  const appActive = phase === "app";

  useEffect(() => {
    document.body.classList.toggle("app-launch-lock", !appActive);
    return () => document.body.classList.remove("app-launch-lock");
  }, [appActive]);

  return (
    <>
      {phase === "splash" && <AppSplash onComplete={splashComplete} />}
      {phase === "intro" && <AppIntro onComplete={introComplete} />}
      <div className={appActive ? undefined : "app-launch-gate__behind"} inert={appActive ? undefined : true}>
        {children}
      </div>
    </>
  );
}
