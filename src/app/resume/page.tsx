import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import { LastPlayed } from "@/components/LastPlayed";
import { CurrentTime } from "@/components/CurrentTime";
import { FooterBackground } from "@/components/FooterBackground";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import { ThemeToggle } from "@/components/theme-toggle";

import { siteUrl } from "@/lib/site";

const resumePath = "/Rishabh-Tripathi-Resume.pdf";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Professional resume and qualifications of Rishabh Tripathi (rishabhx29), full-stack software engineer specializing in React, Next.js, TypeScript, and Node.js.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Resume | Rishabh Tripathi Portfolio",
    description:
      "Professional resume and qualifications of Rishabh Tripathi (rishabhx29), full-stack software engineer.",
    url: "/resume",
  },
};

export default function ResumePage() {
  const resumeJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl.origin,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Resume",
        item: new URL("/resume", siteUrl).href,
      },
    ],
  };

  return (
    <main id="main-content" className="relative min-h-screen w-full overflow-x-hidden bg-[#fbfaf9] transition-colors duration-300 dark:bg-[var(--page-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resumeJsonLd) }}
      />

      <div className="pointer-events-auto absolute left-0 right-0 top-0 h-[var(--banner-h)] md:left-[27%] md:right-[27%]">
        <FooterBackground />
        <div className="pointer-events-auto absolute bottom-3 right-2 z-10">
          <CurrentTime />
        </div>
      </div>

      <header className="absolute left-0 right-0 top-[var(--banner-h)] z-50 flex h-[var(--profile-h)] items-center px-4 md:left-[27%] md:right-[27%]">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <Link
              href="/"
              aria-label="Back to home"
              className="group flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-200/50 bg-zinc-100 text-zinc-400 transition-all hover:bg-zinc-200 hover:text-zinc-900 dark:border-zinc-800/50 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <div className="flex min-w-0 flex-col justify-center">
              <h1 className="truncate text-[20px] font-bold leading-none text-zinc-800 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:text-zinc-100 dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)] sm:text-[24px]">
                Resume
              </h1>
              <p className="mt-0.5 truncate text-[14px] text-zinc-500 dark:text-zinc-400">
                Rishabh Tripathi
              </p>
            </div>
          </div>

          <div className="flex h-20 shrink-0 items-start justify-end gap-2 py-1 sm:h-24 sm:gap-3 max-md:hidden">
            <LastPlayed />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </div>
        </div>
      </header>

      <section className="relative z-10 ml-0 mr-0 flex min-h-screen flex-col px-4 pb-12 pt-[var(--content-offset)] md:ml-[27%] md:mr-[27%]">
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-black/10 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-zinc-400">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                Rishabh Tripathi Resume
              </p>
              <p className="text-[12px] sm:text-[11px] text-zinc-500 dark:text-zinc-400">
                PDF document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resumePath}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open resume in a new tab"
              title="Open in new tab"
              className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-black/10 bg-zinc-50 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-zinc-400 dark:hover:bg-[#121214] dark:hover:text-zinc-100"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={resumePath}
              download="Rishabh-Tripathi-Resume.pdf"
              aria-label="Download resume"
              title="Download resume"
            >
              <SoftPillButton
                as="span"
                variant="primary"
                className="px-3 py-1.5 !text-[12px]"
              >
                <span className="flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </span>
              </SoftPillButton>
            </a>
          </div>
        </div>

        <div className="relative aspect-[8.5/11] w-full overflow-hidden rounded-[6px] border border-black/10 bg-white shadow-sm dark:border-white/10">
          <Image
            src="/Rishabh-Tripathi-Resume.png"
            alt="Rishabh Tripathi resume"
            fill
            priority={true}
            sizes="(min-width: 768px) 40vw, 100vw"
            quality={75}
            className="object-contain"
          />
        </div>

        <div className="relative mt-8">
          <div className="pointer-events-none absolute -left-4 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/[0.25]" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-4 h-[2px] w-[2px] translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/[0.25]" aria-hidden="true" />
        </div>
      </section>
    </main>
  );
}
