"use client";

import { BrandLogo } from "./BrandLogo";
import { useEffect, useState } from "react";

export function LandingStartup() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const leaveDelay = reduceMotion ? 80 : 950;
    const finishDelay = reduceMotion ? 160 : 1320;
    const leaveTimer = window.setTimeout(() => setPhase("leaving"), leaveDelay);
    const finishTimer = window.setTimeout(() => setPhase("done"), finishDelay);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-label="Opening CyberShiksha"
      aria-live="polite"
      className={`landingStartup${
        phase === "leaving" ? " landingStartupLeaving" : ""
      }`}
      role="status"
    >
      <div className="landingStartupCopy">
        <BrandLogo />
        <b>Opening the studio</b>
      </div>
      <div className="landingStartupTrack" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
