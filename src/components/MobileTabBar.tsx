"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, LayoutGrid, FileText, Send } from "lucide-react";

/**
 * Mobile tab bar. Phones get this; the desktop blueprint rails (RightNavbar)
 * stay `lg:`-only, mirroring how the reference site hides its top nav below
 * `md`. Five real routes as `<Link>`s — the reference switches client-side
 * views without touching the URL, but this app has genuine routes, so deep
 * links and the back button keep working.
 *
 * Active tab expands to reveal its label; inactive tabs collapse to the icon.
 */
const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/projects", label: "Projects", icon: LayoutGrid },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/contact", label: "Contact", icon: Send },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full px-1.5 py-1.5 bg-[#fbfaf9]/85 dark:bg-[#171717]/85 backdrop-blur-md border border-black/5 dark:border-white/[0.10] shadow-[0_4px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`flex h-11 items-center justify-center rounded-3xl transition-colors duration-200 ${
              active
                ? "gap-2 px-4 bg-black/[0.06] dark:bg-white/[0.10] text-zinc-900 dark:text-zinc-100"
                : "w-12 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {active ? (
              <span className="text-[13px] font-medium leading-none">{label}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}