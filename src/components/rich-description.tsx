import type { ReactNode } from "react";

/**
 * Shared renderer for experience-style description bullets: lines of
 * "Label: detail" text where known project names get highlighted.
 * Keys are content-derived (line text / project name + occurrence), never
 * array indexes.
 */

const PROJECT_NAME_PATTERN =
  /(kgateway|FOSSology|FOSSASIA Eventyay|Extralit|React JSON Schema Form)/;

const STRONG_CLASS = "font-semibold text-zinc-800 dark:text-zinc-200";

export function splitDescriptionPoints(description: string): string[] {
  return description.split("\n").filter((line) => line.trim() !== "");
}

function renderDetail(detail: string): ReactNode {
  const parts = detail.split(PROJECT_NAME_PATTERN);
  const seen = new Map<string, number>();

  return parts.map((part) => {
    if (!PROJECT_NAME_PATTERN.test(part)) {
      return part;
    }
    const occurrence = seen.get(part) ?? 0;
    seen.set(part, occurrence + 1);
    return (
      <strong key={occurrence === 0 ? part : `${part}#${occurrence}`} className={STRONG_CLASS}>
        {part}
      </strong>
    );
  });
}

export function DescriptionPoint({ point }: Readonly<{ point: string }>) {
  const trimmed = point.trim();
  const separator = trimmed.indexOf(":");

  return (
    <li className="flex items-start gap-1.5">
      <span className="text-zinc-400 dark:text-zinc-500 mt-[2px] text-[14px] leading-none">•</span>
      <span>
        {separator > 0 ? (
          <>
            <strong className={STRONG_CLASS}>{trimmed.slice(0, separator)}:</strong>
            {renderDetail(trimmed.slice(separator + 1))}
          </>
        ) : (
          trimmed
        )}
      </span>
    </li>
  );
}

export function DescriptionPointList({ description }: Readonly<{ description: string }>) {
  return (
    <ul className="mb-4 space-y-2 text-[13px] leading-relaxed">
      {splitDescriptionPoints(description).map((point) => (
        <DescriptionPoint key={point} point={point} />
      ))}
    </ul>
  );
}
