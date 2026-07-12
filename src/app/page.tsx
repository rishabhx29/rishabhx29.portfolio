import { ThemeToggle } from "@/components/theme-toggle";
import { GithubGraph } from "@/components/GithubGraph";
import { CurrentTime } from "@/components/CurrentTime";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { ExperienceList } from "@/components/ExperienceList";
import { OpenSourceContributions } from "@/components/OpenSourceContributions";
import { Certifications } from "@/components/Certifications";
import { FooterBackground } from "@/components/FooterBackground";
import { RightNavbar } from "@/components/RightNavbar";
import { CommandMenu } from "@/components/command-menu";
import Link from "next/link";
import SoftPillButton from "@/components/pixel-perfect/soft-pill-button";
import SocialHoverCard from "@/components/pixel-perfect/social-hover-card";
import { BannerParticles } from "@/components/BannerParticles";
import { FileText } from "lucide-react";
import Image from "next/image";

const skills = [
  { name: "JavaScript", icon: "javascript" },
  { name: "TypeScript", icon: "typescript" },
  { name: "HTML5", icon: "html5" },
  { name: "CSS3", icon: "css3" },
  { name: "Python", icon: "python" },
  { name: "C", icon: "c" },
  { name: "C++", icon: "cplusplus" },
  { name: "Java", icon: "java" },
  { name: "SQL", icon: "databricks" },
  { name: "React.js", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "Framer Motion", icon: "framer" },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "Express.js", icon: "express" },
  { name: "MySQL", icon: "mysql" },
  { name: "MongoDB", icon: "mongodb" },
  { name: "Supabase", icon: "supabase" },
  { name: "Git", icon: "git" },
  { name: "GitHub", icon: "github" },
  { name: "Vercel", icon: "vercel" },
  { name: "VS Code", icon: "visualstudiocode" },
  { name: "Redux", icon: "redux" },
  { name: "Stripe", icon: "stripe" },
  { name: "Cloudinary", icon: "cloudinary" },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-black relative overflow-x-hidden transition-colors duration-300">

      {/* Right Side Blueprint Navigation */}
      <RightNavbar />

      {/* Vertical Lines - Ultra-fine Micro Dots */}
      <div className="absolute top-0 bottom-0 left-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />
      <div className="absolute top-0 bottom-0 right-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

      {/* Horizontal Lines - Ultra-fine Micro Dots */}
      <div className="absolute left-0 right-0 top-[22vh] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
      <div className="absolute left-0 right-0 top-[calc(22vh+112px)] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />

      {/* Ultra-Tiny Solid Nodes */}
      {[
        { top: '22vh', left: '30%' },
        { top: '22vh', right: '30%' },
        { top: 'calc(22vh + 112px)', left: '30%' },
        { top: 'calc(22vh + 112px)', right: '30%' },
      ].map((pos, i) => (
        <div key={i} className="absolute w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] pointer-events-none z-10 hidden md:block"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            transform: `translate(${pos.right ? '50%' : '-50%'}, -50%)`
          }} />
      ))}

      {/* Cell 1: Banner */}
      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-0 h-[22vh] -z-0 pointer-events-auto overflow-hidden bg-white dark:bg-black shadow-[0_4px_12px_rgba(2,6,23,0.04)] dark:shadow-[0_4px_12px_rgba(2,6,23,0.10)]">
        <Image
          src="/ChatGPT%20Image%20May%2022%2C%202026%2C%2012_40_29%20AM.jpg"
          alt=""
          fill
          fetchPriority="high"
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={100}
          className="object-cover object-center dark:hidden"
        />
        <Image
          src="/ChatGPT%20Image%20May%2022%2C%202026%2C%2012_49_39%20AM.jpg"
          alt=""
          fill
          fetchPriority="high"
          sizes="(min-width: 768px) 40vw, 100vw"
          quality={100}
          className="hidden object-cover object-center dark:block"
        />
        <BannerParticles />
        <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-[5] bg-gradient-to-t from-white/90 to-transparent dark:from-black/50 dark:to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-20 bg-gradient-to-r from-white/90 to-transparent dark:from-black/40 dark:to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-20 bg-gradient-to-l from-white/90 to-transparent dark:from-black/40 dark:to-transparent" />
        <div className="absolute bottom-3 right-2 z-10 pointer-events-auto">
          <CurrentTime />
        </div>
      </div>

      {/* Cell 2: Profile Section - 112px height to wrap the framed image (13px gap top/bottom) */}
      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-[22vh] h-[112px] flex items-center px-4 z-50">
        <div className="flex w-full items-center justify-between">

          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative p-[3px] rounded-[6px] sm:rounded-[8px] border-[1.5px] border-black/30 dark:border-white/[0.15] shrink-0">
              {/* The inner image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[3px] sm:rounded-[5px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src="/Rishabh-Avatar.jpg"
                  alt="Profile"
                  width={240}
                  height={240}
                  quality={90}
                  fetchPriority="high"
                  sizes="(min-width: 640px) 120px, 96px"
                  className="h-full w-full origin-center object-cover opacity-90 grayscale contrast-100 mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center pt-8">
              <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                Rishabh Tripathi
              </h1>
              <p className="text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400">Software Engineer</p>
            </div>
          </div>

          <div className="flex items-start justify-end gap-2 sm:gap-3 h-20 sm:h-24 py-1">
            <CommandMenu />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </div>

        </div>
      </div>

      {/* Flowing Content Section */}
      <div className="ml-0 mr-0 md:ml-[30%] md:mr-[30%] pt-[calc(22vh+112px)] pb-0 px-4 flex flex-col z-10 relative min-h-screen">
        <p className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-4">
          Engineer / Artist. I love building, breaking, and shipping things.
        </p>

        <ul className="text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed mt-4 pl-4">
          <li className="flex gap-1.5"><span>•</span><span>AI, open source, and developer tools excite me.</span></li>
          <li className="flex gap-1.5"><span>•</span><span>I believe actions speak louder than words, so I put my code where my mouth is.</span></li>
          <li className="flex gap-1.5"><span>•</span><span>Currently building <span className="font-semibold text-zinc-900 dark:text-white">AlgoForge</span>, <span className="font-semibold text-zinc-900 dark:text-white">Traceon</span>, and experimental AI tools.</span></li>
        </ul>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4">

          <Link href="/contact">
            <SoftPillButton
              as="span"
              variant="secondary"
              className="px-3 py-1.5 !text-[12px]"
            >
              <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Send an email
              </div>
            </SoftPillButton>
          </Link>
        </div>

        {/* Socials */}
        <div id="contact" className="mt-6 scroll-mt-24">
          <h2 className="text-[14px] text-zinc-500 mb-2">Here are my <span className="font-medium text-zinc-800 dark:text-zinc-200">socials</span></h2>
          <div className="flex flex-wrap gap-1.5">
            {[
              { name: 'GitHub', href: 'https://github.com/rishabhx29', icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" fill="none"></path> },
              { name: 'X', href: 'https://x.com/RishabhTri8805', icon: <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768" stroke="currentColor" strokeWidth="2" fill="none" /> },
              { name: 'LinkedIn', href: 'https://www.linkedin.com/in/rishabh-tripathi-728a77317', icon: <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none"></path> },
              { name: 'Discord', href: 'https://discord.com/users/jiraya_sensei2139', icon: <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" fill="currentColor"/> },
            ].map((social, i) => (
              <SocialHoverCard key={i} socialName={social.name}>
                <SoftPillButton
                  as="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  className="px-3 py-1.5 !text-[12px]"
                >
                  <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                      {social.icon}
                    </svg>
                    {social.name}
                  </div>
                </SoftPillButton>
              </SocialHoverCard>
            ))}
            <Link href="/resume" target="_blank">
              <SoftPillButton
                as="span"
                variant="secondary"
                className="px-3 py-1.5 !text-[12px]"
              >
                <span className="flex items-center gap-1.5 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                  <FileText className="h-3.5 w-3.5" />
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
          <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

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
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          </div>

          <div className="block mt-0">
            <ExperienceList />

            {/* View All Button */}
            <div className="py-4 px-4 -mx-4 flex justify-center relative hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer rounded-b-lg mt-0">
              <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
              {/* Bottom Line Intersections */}
              <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
              <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
              <Link href="/experience" className="relative group block mt-0">
                <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
                <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
                  View All
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div id="projects" className="mt-0 flex flex-col relative z-10 scroll-mt-24">
          <div className="py-2 relative mt-1">
            <h2 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Projects</h2>

            {/* Horizontal line below Projects heading */}
            <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            {/* Intersections */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 left-1/2 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          </div>

          {/* Grid Container */}
          <div className="relative pt-6 pb-12 px-4">
            {/* Center Vertical Line */}
            <div className="absolute top-0 bottom-6 left-1/2 w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none -translate-x-1/2 hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

            <ProjectsGrid />

            {/* Bottom Horizontal Line */}
            <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            {/* Intersections */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            {/* Center dot removed to prevent crossing the outline gap of the View All button */}
          </div>

          {/* View All Button */}
          <div className="flex justify-center -mt-[19px] pb-0 relative z-20">
            <Link href="/projects" className="relative group block">
              <div className="absolute -inset-[5px] border border-black/5 dark:border-white/5 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
              <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/5 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
                View All
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Github Graph */}
        <GithubGraph />

        {/* Open Source Contributions */}
        <div id="opensource" className="scroll-mt-24">
          <OpenSourceContributions />
        </div>

        {/* Skills */}
        <div id="skills" className="mt-6 flex flex-col relative z-10 scroll-mt-24">
          {/* Top full-width line */}
          <div
            className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
              WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
            }}
          />
          {/* Top Line Intersections */}
          <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

          <div className="py-2 relative mt-1">
            <h2 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Skills & Technologies</h2>

            {/* Horizontal line below Skills heading */}
            <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            {/* Intersections */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          </div>

          <div className="relative pt-6 pb-2">
            <div className="flex flex-wrap gap-2 w-full">
              {skills.map((skill, index) => (
                <div key={index} className="grow flex items-center justify-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0a0a0a] dark:hover:bg-[#121214] border border-black/30 dark:border-white/[0.15] rounded-[6px] transition-colors duration-200 cursor-default">
                  <img
                    src={skill.icon.startsWith('http') ? skill.icon : `https://cdn.simpleicons.org/${skill.icon}/71717a`}
                    alt={skill.name}
                    width={14}
                    height={14}
                    loading="lazy"
                    decoding="async"
                    className={`h-3.5 w-3.5 opacity-80 ${skill.icon.startsWith('http') ? 'rounded-sm grayscale' : ''}`}
                  />
                  <span className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Certifications */}
        <div id="certifications" className="mt-6 flex flex-col relative z-10 scroll-mt-24">
          {/* Top full-width line */}
          <div
            className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
              WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
            }}
          />
          {/* Top Line Intersections */}
          <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

          <div className="py-2 relative mt-1">
            <h2 className="text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Certifications</h2>

            {/* Horizontal line below heading */}
            <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            {/* Intersections */}
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          </div>

          <Certifications />

          {/* Bottom line */}
          <div className="relative mt-4 pb-4">
            <div className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
            <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
            <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
          </div>
        </div>

        {/* Minimal Quote Section */}
        <div className="mt-12 flex flex-col items-center justify-center relative py-12">
          <div className="max-w-[480px] w-full flex flex-col items-center">
            <h3 className="text-[16px] font-medium text-center leading-relaxed text-zinc-500 dark:text-zinc-400 mb-6 italic">
              &quot;Talk is cheap.<br className="hidden md:block" /> Show me the code.&quot;
            </h3>

            <div className="flex items-center gap-3 text-[10px] font-medium tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase">
              <div className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800" />
              LINUS TORVALDS
              <div className="w-4 h-[1px] bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>

        {/* Fading Grid Filler */}
        <div className="flex-grow w-[calc(100%+32px)] -mx-4 h-[300px] relative mt-4">
          {/* Top full-width line */}
          <div
            className="absolute top-0 left-[-100vw] right-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15] pointer-events-none z-10"
            style={{
              maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)',
              WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)'
            }}
          />
          {/* Intersections */}
          <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
          <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />

          <FooterBackground />
        </div>

      </div>

    </div>
  );
}
