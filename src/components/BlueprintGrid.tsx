import { Fragment } from "react";

/**
 * Horizontal blueprint rule, for section dividers.
 *
 * Used to be a full grid - two vertical rails spanning the page, horizontal
 * rules, and intersection dots. All of it is gone. What remains is a single
 * dashed rule at the requested position(s), so a page can mark the boundary
 * between its sections without a background drawing in every corner.
 *
 * Render inside the page's root positioning context (a `relative` container).
 */
export function BlueprintGrid({ horizontals }: { readonly horizontals: readonly string[] }) {
  const horizontalMask = {
    maskImage:
      "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage:
      "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  } as React.CSSProperties;

  return (
    <>
      {horizontals.map((top) => (
        <Fragment key={top}>
          <div
            className="absolute left-0 right-0 h-0 border-b border-black/25 dark:border-white/[0.10] pointer-events-none hidden md:block"
            aria-hidden="true"
            style={{ top, ...horizontalMask }}
          />
        </Fragment>
      ))}
    </>
  );
}
