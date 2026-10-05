"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Briefcase, LayoutGrid, FileText, Send } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Mobile tab bar. Phones get this; the desktop blueprint rails (RightNavbar)
 * stay `lg:`-only, mirroring how the reference site hides its top nav below
 * `md`. Five real routes as `<Link>`s — the reference switches client-side
 * views without touching the URL, but this app has genuine routes, so deep
 * links and the back button keep working.
 *
 * ## Why this uses shared layout animation
 *
 * The first version styled the active pill with `transition-colors`, which only
 * animates `color`. Width and padding are not colours, so the highlight *snapped*
 * from tab to tab, and because the active item also grows by its label's width
 * every icon after it jumped sideways. The result read as a page swap rather
 * than one control moving.
 *
 * Two pieces fix that:
 *
 * - `layoutId` on the pill draws it once and lets Framer interpolate its
 *   position and size between tabs, so it genuinely *slides*.
 * - `layout="position"` on each tab animates the reflow the growth causes.
 *   `"position"` rather than plain `layout` on purpose: the default also
 *   animates size by scaling, which squashed the icons mid-slide. Measured
 *   aspect ratio stays exactly 1:1 with `"position"`.
 *
 * The label is held back until the pill has landed so the two never read as
 * separate objects mid-slide. `useReducedMotion` swaps every duration for zero
 * so the control still works for anyone who has asked for less motion.
 *
 * ## Why the pill moves on tap, not on navigation
 *
 * Deriving the active tab from `usePathname()` alone looked correct and felt
 * broken. Traced frame by frame, the pill got about four painted frames and
 * then the main thread was blocked before it reached its destination. Four
 * frames reads as a jump, not a slide.
 *
 * The cause is ordering. The pathname only updates once the new route has
 * committed, and that commit is the most expensive moment of a navigation —
 * mounting a heavy page measured a ~250ms task on /contact. So the pill began
 * moving at the worst possible time and lost its tail to someone else's frame
 * budget.
 *
 * `pendingHref` moves it on click instead, while the thread is still free, so
 * the slide is finished before the commit lands. The URL stays the source of
 * truth: the guess only applies while the two disagree, and a timeout releases
 * it if navigation never completes.
 */
const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/projects", label: "Projects", icon: LayoutGrid },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/contact", label: "Contact", icon: Send },
] as const;

/**
 * Tuned by measurement, not by feel.
 *
 * A 490ms spring looked fine in isolation but ran long enough to still be
 * mid-flight when the destination page committed, so the tail of the slide was
 * never painted. Since the slide now starts on click it has a clear window
 * before that commit, and this spring is deliberately brisk enough to land
 * inside it even on the slowest destination.
 */
const SPRING = { type: "spring", stiffness: 620, damping: 40, mass: 0.7 } as const;

/** `null` (unknown yet) should still animate, so only `true` opts out. */
const EASE = { duration: 0.14, ease: [0.22, 1, 0.36, 1] } as const;

/**
 * The label waits for the pill.
 *
 * Without this delay the cross-fade finished while the shared-layout morph was
 * still in flight, so mid-slide you saw the pill halfway across the bar with
 * the next tab's label already sitting outside it, unattached. Holding the label
 * back until the pill lands keeps the two reading as one object.
 */
const LABEL_IN = { ...EASE, delay: 0.13 };
const LABEL_OUT = { duration: 0.08, ease: "easeIn" as const };

const MotionLink = motion.create(Link);

export function MobileTabBar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const matches = (path: string, href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  // Navigation never landed (offline, thrown error boundary). Don't strand the
  // bar on a tab the user is not actually on.
  useEffect(() => {
    if (!pendingHref) return;
    const timer = window.setTimeout(() => setPendingHref(null), 3000);
    return () => window.clearTimeout(timer);
  }, [pendingHref]);

  const transition = reduceMotion ? { duration: 0 } : SPRING;

  // Defined here rather than as a module constant so `reduceMotion` can flatten
  // both directions. Animating the label's width is what drives the pill's
  // resize, so leaving these durations in would reintroduce motion.
  const instant = { duration: 0 };
  const labelVariants = {
    hidden: { opacity: 0, width: 0, transition: reduceMotion ? instant : LABEL_OUT },
    visible: { opacity: 1, width: "auto", transition: reduceMotion ? instant : LABEL_IN },
  };

  /*
   * Derived, not synchronised: the guess only wins while the URL still
   * disagrees with it. The moment navigation commits, `matches` turns true and
   * the pathname takes over on its own — no effect, no render loop, and the bar
   * can never end up disagreeing with the address bar.
   */
  const route = pendingHref && !matches(pathname, pendingHref) ? pendingHref : pathname;
  const isActive = (href: string) => matches(route, href);

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full px-1.5 py-1.5 bg-[#fbfaf9]/85 backdrop-blur-md dark:bg-[#171717]/85 border border-black/5 dark:border-white/[0.10] shadow-[0_4px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = isActive(href);
        return (
          <MotionLink
            key={href}
            href={href}
            // Animates the reflow the expanding pill causes, so the icons slide
            // instead of jumping. Restraint over cleverness: this is a 44px
            // control, and it has to stay cheap enough to run during a route
            // transition.
            layout="position"
            transition={transition}
            // `click` rather than `pointerdown` so keyboard activation gets the
            // same early start, and it still fires well before the route commits.
            onClick={() => setPendingHref(href)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-11 items-center justify-center rounded-3xl ${
              active
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {/*
              One pill for the whole bar. Because every tab renders the same
              `layoutId`, mounting a new one hands the existing element over and
              Framer morphs it — rather than cross-fading two separate pills.
            */}
            {active ? (
              <motion.span
                layoutId="mobile-tab-pill"
                transition={transition}
                className="absolute inset-0 rounded-3xl bg-black/[0.06] dark:bg-white/[0.10]"
              />
            ) : null}

            <span className="relative z-10 flex items-center justify-center gap-2 px-3">
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <AnimatePresence initial={false}>
                {active ? (
                  <motion.span
                    key="label"
                    variants={labelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="overflow-hidden whitespace-nowrap text-[13px] font-medium leading-none"
                  >
                    {label}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
          </MotionLink>
        );
      })}
    </nav>
  );
}
