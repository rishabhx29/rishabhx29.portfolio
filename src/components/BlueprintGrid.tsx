import { Fragment } from "react";

/**
 * Blueprint grid motif — the site's shared visual language of dashed
 * vertical rails at 30% and dashed horizontal rules with tiny intersection
 * nodes. Owns the exact masks, borders, and node styling; pages pass only
 * where the horizontal rules sit.
 *
 * Render inside the page's root positioning context (a `relative` container).
 */
export function BlueprintGrid({ horizontals }: { horizontals: string[] }) {
  const verticalMask = {
    maskImage:
      "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage:
      "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  } as React.CSSProperties;

  const horizontalMask = {
    maskImage:
      "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage:
      "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  } as React.CSSProperties;

  return (
    <>
      {/* Vertical rails */}
      <div
        className="absolute top-0 bottom-0 left-[30%] w-0 border-r border-black/25 dark:border-white/[0.10] pointer-events-none hidden md:block"
        aria-hidden="true"
        style={verticalMask}
      />
      <div
        className="absolute top-0 bottom-0 right-[30%] w-0 border-r border-black/25 dark:border-white/[0.10] pointer-events-none hidden md:block"
        aria-hidden="true"
        style={verticalMask}
      />

      {/* Horizontal rules + intersection nodes */}
      {horizontals.map((top) => (
        <Fragment key={top}>
          <div
            className="absolute left-0 right-0 h-0 border-b border-black/25 dark:border-white/[0.10] pointer-events-none"
            aria-hidden="true"
            style={{ top, ...horizontalMask }}
          />
          <div
            className="absolute left-[30%] w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.20] pointer-events-none z-10 hidden md:block -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
            style={{ top }}
          />
          <div
            className="absolute right-[30%] w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.20] pointer-events-none z-10 hidden md:block translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
            style={{ top }}
          />
        </Fragment>
      ))}
    </>
  );
}
