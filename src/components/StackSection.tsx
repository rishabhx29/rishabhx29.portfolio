import React from "react";
import type { IconType } from "react-icons";
import {
  SiPython,
  SiTypescript,
  SiFastapi,
  SiNextdotjs,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiClaude,
  SiReact,
  SiKubernetes,
  SiRedis,
  SiTailwindcss,
  SiSupabase,
  SiVuedotjs,
  SiPrometheus,
  SiVercel,
  SiDjango,
  SiSpringboot,
  SiLangchain,
  SiOllama,
  SiFirebase,
  SiMysql,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";

interface StackItem {
  name: string;
  icon: IconType;
}

interface StackCategory {
  title: string;
  description: string;
  items: StackItem[];
}

const stackCategories: StackCategory[] = [
  {
    title: "Every day",
    description: "What I open without thinking about it",
    items: [
      { name: "Python", icon: SiPython },
      { name: "TypeScript", icon: SiTypescript },
      { name: "FastAPI", icon: SiFastapi },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Docker", icon: SiDocker },
      { name: "Git", icon: SiGit },
      { name: "Claude Code", icon: SiClaude },
    ],
  },
  {
    title: "Often",
    description: "Reached for whenever the problem calls for it",
    items: [
      { name: "React", icon: SiReact },
      { name: "Kubernetes", icon: SiKubernetes },
      { name: "Redis", icon: SiRedis },
      { name: "Tailwind", icon: SiTailwindcss },
      { name: "Supabase", icon: SiSupabase },
      { name: "Vue", icon: SiVuedotjs },
      { name: "Prometheus", icon: SiPrometheus },
      { name: "Vercel", icon: SiVercel },
    ],
  },
  {
    title: "When it fits",
    description: "Used in anger at least once, happy to again",
    items: [
      { name: "Java", icon: FaJava },
      { name: "Django", icon: SiDjango },
      { name: "Spring Boot", icon: SiSpringboot },
      { name: "LangChain", icon: SiLangchain },
      { name: "Ollama", icon: SiOllama },
      { name: "Firebase", icon: SiFirebase },
      { name: "MySQL", icon: SiMysql },
    ],
  },
];

export function StackSection() {
  return (
    <div className="relative pt-6 pb-2 space-y-8 sm:space-y-9">
      {stackCategories.map((category) => (
        <div
          key={category.title}
          className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6"
        >
          {/* Category Info */}
          <div className="w-full sm:w-[150px] sm:shrink-0">
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {category.title}
            </h3>
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed max-w-[200px]">
              {category.description}
            </p>
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5 flex-1 items-center">
            {category.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="group inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-zinc-50 hover:bg-zinc-100/90 dark:bg-[#171717] dark:hover:bg-[#1e1e1e] border border-black/10 dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/[0.16] rounded-[8px] transition-all duration-200 cursor-default select-none shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <Icon aria-hidden="true" className="w-[15px] h-[15px] text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors shrink-0" />
                  <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
