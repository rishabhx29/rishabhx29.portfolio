"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useSyncExternalStore } from "react";

// The project's public domains, not localhost/next start. Vercel's system
// environment variables are not always exposed to builds, so a build-time
// NEXT_PUBLIC_VERCEL_ENV check can silently disable analytics in production.
const productionHosts = new Set([
  "rishabhx29.me",
  "www.rishabhx29.me",
  "rishabhx29.vercel.app",
]);

const subscribe = () => () => {};
const isProductionHost = () => productionHosts.has(window.location.hostname);
const serverSnapshot = () => false;

export function ProductionAnalytics() {
  const enabled = useSyncExternalStore(subscribe, isProductionHost, serverSnapshot);
  return enabled ? (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  ) : null;
}
