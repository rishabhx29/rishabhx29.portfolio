"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { LastPlayed } from "@/components/LastPlayed";
import { CurrentTime } from "@/components/CurrentTime";
import { FooterBackground } from "@/components/FooterBackground";
import { ProjectCard } from "@/components/ProjectsGrid";
import { projectsData } from "@/data/projectsData";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";

function rowGridClass(rowIndex: number, totalRows: number) {
  if (rowIndex === 0) return "pb-10 md:pb-6 gap-y-10 md:gap-y-0";
  if (rowIndex === totalRows - 1) return "pt-0 md:pt-6 gap-y-10 md:gap-y-0";
  return "pb-10 md:pb-6 pt-0 md:pt-6 gap-y-10 md:gap-y-0";
}

export default function AllProjectsPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <div className="min-h-screen w-full bg-[#fbfaf9] dark:bg-[var(--page-bg)] relative overflow-x-hidden transition-colors duration-300">

        {/* Cell 1: Dot Matrix Background */}
        <div className="absolute left-0 right-0 md:left-[27%] md:right-[27%] top-0 h-[var(--banner-h)] -z-0 pointer-events-auto">
          <FooterBackground />
          <div className="absolute bottom-3 right-2 z-10 pointer-events-auto">
            <CurrentTime />
          </div>
        </div>

        {/* Cell 2: Header with Back Button + Title + Controls */}
        <div className="absolute left-0 right-0 md:left-[27%] md:right-[27%] top-[var(--banner-h)] h-[var(--profile-h)] flex items-center px-4 z-50">
          <div className="flex w-full items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-5">
              <Link
                href="/"
                aria-label="Back to home"
                className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              </Link>
              <div className="flex flex-col justify-center">
                <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                  Featured Projects
                </h1>
                <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                  Selected Builds &amp; Experiments
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-start justify-end gap-2 sm:gap-3 h-20 sm:h-24 py-1 max-md:hidden">
              <LastPlayed />
              <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <main
          id="main-content"
          className="ml-0 mr-0 md:ml-[27%] md:mr-[27%] pt-[var(--content-offset)] pb-16 px-4 flex flex-col z-10 relative"
        >
          <div className="relative pt-6 pb-6">
            <div className="flex flex-col relative z-10 w-full">
              {Array.from({ length: Math.ceil(projectsData.length / 2) }).map((_, rowIndex) => {
                const rowProjects = projectsData.slice(rowIndex * 2, rowIndex * 2 + 2);
                return (
                  <div key={rowProjects[0].slug} className="flex flex-col relative w-full">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-10 ${rowGridClass(rowIndex, Math.ceil(projectsData.length / 2))}`}>
                      {rowProjects.map((project) => (
                        <ProjectCard
                          key={project.title}
                          project={project}
                          isPriority={rowIndex === 0}
                        />
                      ))}
                    </div>
                    {/* Horizontal Divider after each row except the last one */}
                    {rowIndex < Math.ceil(projectsData.length / 2) - 1 && (
                      <div className="relative w-full h-0 hidden md:block">
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Bottom Separator */}
          <div className="relative mt-8">
          </div>
        </main>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-black rounded-xl overflow-hidden w-[90%] max-w-3xl shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close project preview"
                className="absolute top-3 right-3 p-2 bg-neutral-800/80 hover:bg-neutral-700 rounded-full cursor-pointer transition-colors z-50"
              >
                <X size={20} className="text-neutral-200" />
              </button>

              {activeVideo.includes("youtube") ? (
                <iframe
                  src={activeVideo}
                  title="Project demonstration video"
                  className="w-full aspect-video border-0"
                  allowFullScreen
                ></iframe>
              ) : (
                <video src={activeVideo} className="w-full h-auto" controls autoPlay />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
