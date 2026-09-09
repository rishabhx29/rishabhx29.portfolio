"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const KonamiEasterEgg = dynamic(
  () => import("@/components/konami-easter-egg").then((module) => module.KonamiEasterEgg),
  { ssr: false }
);

const OnekoPet = dynamic(
  () => import("@/components/OnekoPet").then((module) => module.OnekoPet),
  { ssr: false }
);

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [canLoadExtras, setCanLoadExtras] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    type RequestIdleCallbackHandle = number;
    type RequestIdleCallbackOptions = { timeout: number };
    type RequestIdleCallbackFn = (
      callback: () => void,
      options?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle;

    const win = window as unknown as {
      requestIdleCallback?: RequestIdleCallbackFn;
      cancelIdleCallback?: (handle: RequestIdleCallbackHandle) => void;
    };

    if (typeof win.requestIdleCallback === "function") {
      const handle = win.requestIdleCallback(() => setCanLoadExtras(true), {
        timeout: 3000,
      });
      return () => {
        if (win.cancelIdleCallback) win.cancelIdleCallback(handle);
      };
    }

    const timer = window.setTimeout(() => setCanLoadExtras(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {canLoadExtras && (
        <>
          <KonamiEasterEgg />
          <OnekoPet />
        </>
      )}
      <div key={pathname} className="page-transition flex min-h-screen w-full flex-col relative">
        {children}
      </div>
    </>
  );
}
