"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const KonamiEasterEgg = dynamic(
  () => import("@/components/konami-easter-egg").then((module) => module.KonamiEasterEgg),
  { ssr: false }
);

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <KonamiEasterEgg />
      <div key={pathname} className="page-transition flex min-h-screen w-full flex-col relative">
        {children}
      </div>
    </>
  );
}
