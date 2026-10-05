import { ThemeToggle } from "@/components/theme-toggle";
import { CurrentTime } from "@/components/CurrentTime";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { ExperienceList } from "@/components/ExperienceList";
import { OpenSourceContributions } from "@/components/OpenSourceContributions";
import { BannerMusicControl } from "@/components/BannerMusicControl";
import Link from "next/link";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import SocialHoverCard from "@/components/pixel-perfect/social-hover-card";
import { DeferredBannerParticles, DeferredGithubGraph, DeferredRishabhParticles } from "@/components/deferred-visuals";
import { FileText, Boxes } from "lucide-react";
import Image from "next/image";
import { StackSection } from "@/components/StackSection";
import { Certifications } from "@/components/Certifications";
import { BlueprintGrid } from "@/components/BlueprintGrid";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#fbfaf9] dark:bg-[#100f0f] relative overflow-x-hidden transition-colors duration-300">

      {/* Blueprint grid motif */}
      <BlueprintGrid horizontals={["var(--banner-h)", "var(--content-offset)"]} />

      {/*
        Desktop hero.

        This was two separate absolutely-positioned bands — a full-bleed banner
        strip, then a profile row beneath it. It is now one dashed card holding
        the banner, the avatar overlapping its bottom-left corner, and the
        identity row underneath: the same construction the mobile hero already
        uses, at desktop scale.

        The total height is deliberately unchanged (--banner-h + --profile-h),
        so `--content-offset`, the blueprint rules, and every other page that
        pads itself by those vars are untouched.
      */}
      <div
        className="absolute left-0 right-0 top-0 z-40 hidden md:block md:left-[30%] md:right-[30%]"
        style={{ height: "calc(var(--banner-h) + var(--profile-h))" }}
      >
        <div className="flex h-full flex-col gap-8 rounded-3xl border border-dashed border-black/20 p-3 dark:border-white/[0.14]">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-[#fbfaf9] dark:bg-[#100f0f]">
            <Image
              src="/new_banner_light (1).png"
              alt="Rishabh Tripathi — Full-Stack Software Engineer Portfolio Banner"
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              quality={75}
              className="object-cover object-[center_20%] dark:hidden"
            />
            <Image
              src="/new_banner_dark.png"
              alt="Rishabh Tripathi — Full-Stack Software Engineer Portfolio Banner Dark"
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              quality={75}
              className="hidden object-cover object-[center_20%] dark:block"
            />
            <DeferredBannerParticles />

            {/* Time readout, still sitting on the banner's bottom-right. It can
                live inside the banner now that this is one stacking context
                rather than two competing ones. */}
            <div className="absolute bottom-2 right-3 z-20">
              <CurrentTime />
            </div>

            {/*
              Avatar, pulled up to straddle the banner's bottom-left corner. The
              ring matches the page background so it reads as a cutout rather
              than a sticker, which is what makes the overlap legible against a
              busy image.
            */}
            {/* Avatar overlap. It hangs `overhang` px past the banner's bottom
                edge, so the gap below the banner has to exceed that or the
                avatar lands on the name. Kept as one number on both sides so
                the two cannot drift apart again. */}
            <div
              className="absolute bottom-[-24px] left-3 z-20 h-16 w-16 overflow-hidden rounded-full ring-4 ring-[#fbfaf9] sm:h-20 sm:w-20 dark:ring-[#100f0f]"
            >
              <Image
                src="/Rishabh-Avatar.jpg"
                alt="Rishabh Tripathi — Full-Stack Software Engineer Portfolio Avatar"
                width={240}
                height={240}
                quality={80}
                priority
                sizes="(min-width: 640px) 120px, 96px"
                className="h-full w-full object-cover grayscale contrast-100"
              />
            </div>
          </div>


          {/* Identity row — name and role on the left, the sound and theme
              controls on the right, exactly where they sat before. */}
          <div className="flex shrink-0 items-center justify-between gap-3 px-1">
            <div className="flex min-w-0 flex-col justify-center">
              <h1 className="text-[16px] font-bold leading-none tracking-tight text-zinc-800 whitespace-nowrap dark:text-zinc-100 [font-family:var(--font-doto),monospace] [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)] sm:text-[24px]">
                Rishabh Tripathi
                <span className="sr-only"> — Full-Stack Software Engineer Portfolio (rishabhx29)</span>
              </h1>
              <p className="mt-1 text-[12px] text-zinc-500 sm:text-[14px] dark:text-zinc-400">
                Full-Stack Software Engineer
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <BannerMusicControl />
              <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Flowing Content Section */}
      {/* Mobile-only hero (mirrors the reference mobile header) */}
      <div className="md:hidden px-4 pt-16 pb-2">
        <div className="rounded-3xl border border-dashed border-black/20 dark:border-white/[0.14] p-3">
          <div className="relative overflow-hidden rounded-2xl">
            {/*
              This banner is the mobile LCP element. It was shipping with
              next/image's default `loading="lazy"`, which Lighthouse charged
              ~1.9s of load delay, and with no `sizes` it was fetched at
              w=1920 to paint a 354px-wide slot.

              `priority` makes it eager with high fetch priority; `sizes`
              accounts for the page gutter and the card padding so the browser
              picks a candidate near the size it actually renders. Both variants
              are marked because the dark one is the LCP whenever the theme is
              dark, and which one paints is not knowable during SSR.
            */}
            <Image src="/new_banner_light (1).png" alt="Banner" width={1200} height={630} quality={75} priority sizes="calc(100vw - 56px)" className="block w-full dark:hidden" />
            <Image src="/new_banner_dark.png" alt="Banner (dark)" width={1200} height={630} quality={75} priority sizes="calc(100vw - 56px)" className="hidden w-full dark:block" />
            <DeferredBannerParticles />
          </div>
          <div className="-mt-8 ml-3 relative z-10 w-16 h-16 rounded-full overflow-hidden ring-4 ring-[#fbfaf9] dark:ring-[#100f0f]">
            <Image src="/Rishabh-Avatar.jpg" alt="Rishabh Tripathi" width={240} height={240} className="h-full w-full object-cover grayscale contrast-100" />
          </div>
        </div>

        <h1 style={{ fontFamily: "var(--font-doto), monospace" }} className="mt-4 text-[22px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Rishabh Tripathi</h1>
        <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">Full-Stack Developer &amp; Open-Source Contributor</p>
        <p className="mt-3 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">I design and build fast, dependable products — currently shipping Traceon, VeloKey, Adaptive and AlgoForge, leading open-source at SSoC and contributing at GSSoC. I write clean, readable code that people enjoy using.</p>
      </div>

      <main id="main-content" className="ml-0 mr-0 md:ml-[30%] md:mr-[30%] pt-4 md:pt-[var(--content-offset)] pb-0 px-4 flex flex-col z-10 relative min-h-screen">
        <div className="hidden md:block mt-4">
          <p className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2">I design and build fast, dependable products — currently shipping Traceon, VeloKey, Adaptive and AlgoForge, leading open-source at SSoC and contributing at GSSoC. I write clean, readable code that people enjoy using.</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4">

          <Link href="/contact">
            <SoftPillButton
              as="span"
              variant="secondary"
              className="px-3 py-1.5 !text-[12px]"
            >
              <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Send an email
              </div>
            </SoftPillButton>
          </Link>

          <Link href="/playground">
            <SoftPillButton
              as="span"
              variant="secondary"
              className="px-3 py-1.5 !text-[12px]"
            >
              <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <Boxes aria-hidden="true" className="w-3.5 h-3.5" />
                Explore Playground
              </div>
            </SoftPillButton>
          </Link>
        </div>

        {/* Socials */}
        <div id="contact" className="mt-6 scroll-mt-24">
          <h2 className="text-[14px] text-zinc-600 dark:text-zinc-400 mb-2">Here are my <span className="font-medium text-zinc-800 dark:text-zinc-200">socials</span></h2>
          <div className="flex flex-wrap gap-1.5">
            {[
              { name: 'GitHub', href: 'https://github.com/rishabhx29', icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" fill="none"></path> },
              { name: 'X', href: 'https://x.com/RishabhTri8805', icon: <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768" stroke="currentColor" strokeWidth="2" fill="none" /> },
              { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rishabh-tripathi-728a77317', icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none"></path> },
              { name: 'Discord', href: 'https://discord.com/users/jiraya_sensei2139', icon: <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" fill="currentColor"/> },
            ].map((social) => (
              <SocialHoverCard key={social.name} socialName={social.name}>
                <SoftPillButton
                  as="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  className="px-3 py-1.5 !text-[12px]"
                >
                  <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5">
                      {social.icon}
                    </svg>
                    {social.name}
                  </div>
                </SoftPillButton>
              </SocialHoverCard>
            ))}
            <Link href="/resume" className="hidden md:block">
              <SoftPillButton
                as="span"
                variant="secondary"
                className="px-3 py-1.5 !text-[12px]"
              >
                <span className="flex items-center gap-1.5 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                  <FileText aria-hidden="true" className="h-3.5 w-3.5" />
                  Resume
                </span>
              </SoftPillButton>
            </Link>
          </div>
        </div>

        {/* Experiences */}
        <div id="experience" className="mt-6 flex flex-col relative z-10 scroll-mt-24">
          {/* Top full-width line */}
          <div
            className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
              WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
            }}
          />
          {/* Top Line Intersections */}
          <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
          <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />

          <div className="py-2 relative">
            <h2 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Experiences</h2>
            {/* Bottom full-width line */}
            <div
              className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
              style={{
                maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
                WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
              }}
            />
            {/* Bottom Line Intersections */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
          </div>

          <div className="block mt-0">
            <ExperienceList />

            {/* View All Button */}
            <div className="py-4 px-4 -mx-4 flex justify-center relative hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer rounded-b-lg mt-0">
              <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
              {/* Bottom Line Intersections */}
              <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
              <Link href="/experience" aria-label="View all work experiences" className="relative group block mt-0">
                <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
                <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#171717] dark:hover:bg-[#1e1e1e] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
                  View All
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div id="projects" className="mt-0 flex flex-col relative z-10 scroll-mt-24 max-md:hidden">
          <div className="py-2 relative mt-1">
            <h2 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Projects</h2>

            {/* Horizontal line below Projects heading */}
            <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            {/* Intersections */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
            <div className="absolute bottom-0 left-1/2 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
          </div>

          {/* Grid Container */}
          <div className="relative pt-6 pb-12 px-4">
            {/* Center Vertical Line */}
            <div className="absolute top-0 bottom-6 left-1/2 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none -translate-x-1/2 hidden md:block" aria-hidden="true" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

            <ProjectsGrid />

            {/* Bottom Horizontal Line */}
            <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" aria-hidden="true" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            {/* Intersections */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
            {/* Center dot removed to prevent crossing the outline gap of the View All button */}
          </div>

          {/* View All Button */}
          <div className="flex justify-center -mt-[19px] pb-0 relative z-20">
            <Link href="/projects" aria-label="View all featured projects" className="relative group block">
              <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
              <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#171717] dark:hover:bg-[#1e1e1e] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
                View All
                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Github Graph */}
        <DeferredGithubGraph />

        {/* Open Source Contributions */}
        <div id="opensource" className="scroll-mt-24">
          <OpenSourceContributions />
        </div>

        {/* Stack */}
        <div id="skills" className="mt-6 flex flex-col relative z-10 scroll-mt-24 max-md:hidden">
          <div id="stack" className="-top-24 absolute pointer-events-none" />
          {/* Top full-width line */}
          <div
            className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
              WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
            }}
          />
          {/* Top Line Intersections */}
          <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
          <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />

          <div className="py-2 relative mt-1">
            <h2 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Stack</h2>

            {/* Horizontal line below Stack heading */}
            <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" aria-hidden="true" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            {/* Intersections */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
          </div>

          <StackSection />
        </div>




        {/* Certifications (desktop) */}
        <div id="certifications" className="flex max-md:hidden flex-col relative z-10 mt-6 scroll-mt-24">
          <div className="relative mt-1 py-2">
            <h2 className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Certifications</h2>
          </div>
          <Certifications />
        </div>

        {/* Minimal Quote Section */}
        <div className="mt-12 flex flex-col items-center justify-center relative py-12">
          <div className="max-w-[540px] w-full flex flex-col items-center">
            <blockquote className="text-[15px] sm:text-[16px] font-medium text-center leading-relaxed text-zinc-600 dark:text-zinc-300 mb-6 italic">
              &quot;It is simpler to plan for everything to go wrong,<br className="hidden md:block" /> and be pleasantly surprised when it works.&quot;
            </blockquote>

            <div className="flex items-center gap-3 text-[12px] sm:text-[10px] font-medium tracking-[0.2em] text-zinc-600 dark:text-zinc-400 uppercase">
              <div className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
              KISUKE URAHARA — BLEACH
              <div className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Rishabh Particle Logo Footer */}
        <div className="flex-grow w-[calc(100%+32px)] -mx-4 h-[380px] relative mt-4">
          {/* Top full-width line */}
          <div
            className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
            style={{
              maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
              WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
            }}
          />
          {/* Intersections */}
          <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />
          <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" aria-hidden="true" />

          <DeferredRishabhParticles />
        </div>

      </main>

    </div>
  );
}
