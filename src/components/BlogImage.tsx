"use client";

import { useState } from "react";
import Image from "next/image";

type BlogImageProps = Readonly<{
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}>;

/**
 * Blog figure image that degrades gracefully.
 *
 * Blog content is authored as data in `src/data/blogsData.ts`, so a post can
 * reference an asset that was never committed (or was later removed). Without
 * this guard the browser renders a broken-image icon at the intrinsic aspect
 * ratio and the caption underneath makes no sense. On load failure we swap in
 * a labelled placeholder that keeps the caption readable.
 */
export function BlogImage({ src, alt, caption, width, height }: BlogImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-[6px] border border-black/20 bg-zinc-100 shadow-sm shadow-black/10 dark:border-white/[0.12] dark:bg-[#09090b] dark:shadow-black/50">
        {failed ? (
          <div
            role="img"
            aria-label={`${alt} (image unavailable)`}
            style={{ aspectRatio: `${width} / ${height}` }}
            className="flex w-full flex-col items-center justify-center gap-2 bg-zinc-100 px-6 text-center dark:bg-[#09090b]"
          >
            <span className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
              Image unavailable
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{alt}</span>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 768px) 40vw, 100vw"
            onError={() => setFailed(true)}
            className="h-auto w-full object-cover"
          />
        )}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-[12px] leading-5 text-zinc-500 sm:text-[11px] dark:text-zinc-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
