import type { ComponentType } from "react";
import { Network, Search } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiPrisma,
  SiCloudflare,
  SiLangchain,
  SiNodedotjs,
  SiFramer,
  SiTailwindcss,
  SiBun,
  SiEslint,
  SiRadixui,
  SiChartdotjs,
  SiGithub,
  SiFastapi,
  SiRedis,
  SiCelery,
  SiTldraw,
  SiCss,
  SiPython,
  SiAnthropic,
  SiClaude,
  SiGooglegemini,
  SiMeta,
} from "react-icons/si";

export type TechIcon = ComponentType<{ className?: string }>;
export type TechKey =
  | "next" | "ts" | "react" | "three" | "prisma" | "cloud" | "langchain" | "langgraph" | "rag"
  | "node" | "motion" | "tailwind" | "bun" | "eslint" | "radixui" | "charts" | "github" | "fastapi"
  | "redis" | "celery" | "tldraw" | "css3" | "python" | "anthropic" | "claude" | "gemini" | "llama";

export type TechItem = TechKey | { label: string; tooltip?: string; };

export interface Project {
  slug: string;
  title: string;
  imageTitle: string;
  src: string;
  lightModeSrc?: string;
  video: string;
  description: string;
  tech: TechItem[];
  github: string;
  live: string;
  starsText?: string;
  backgroundImage?: string;
  hasPin: boolean;
}

export const iconMap: Record<TechKey, TechIcon> = {
  next: SiNextdotjs, ts: SiTypescript, react: SiReact, three: SiThreedotjs, prisma: SiPrisma,
  cloud: SiCloudflare, langchain: SiLangchain, langgraph: Network, rag: Search, node: SiNodedotjs,
  motion: SiFramer, tailwind: SiTailwindcss, bun: SiBun, eslint: SiEslint, radixui: SiRadixui,
  charts: SiChartdotjs, github: SiGithub, fastapi: SiFastapi, redis: SiRedis, celery: SiCelery,
  tldraw: SiTldraw, css3: SiCss, python: SiPython, anthropic: SiAnthropic, claude: SiClaude,
  gemini: SiGooglegemini, llama: SiMeta,
};

export const techNames: Record<TechKey, string> = {
  next: "Next.js", ts: "TypeScript", react: "React", three: "Three.js", prisma: "Prisma",
  cloud: "Cloudflare", langchain: "LangChain", langgraph: "LangGraph", rag: "RAG",
  node: "Node.js", motion: "Framer Motion", tailwind: "Tailwind CSS", bun: "Bun", eslint: "ESLint",
  radixui: "Radix UI", charts: "Charts", github: "GitHub API", fastapi: "FastAPI", redis: "Redis",
  celery: "Celery", tldraw: "tldraw", css3: "CSS3", python: "Python", anthropic: "Anthropic",
  claude: "Claude", gemini: "Gemini", llama: "LLaMA",
};

export const projectsData: Project[] = [
  {
    slug: "algoforge",
    title: "AlgoForge",
    imageTitle: "DSA Platform",
    src: "/project-image/image copy.png",
    lightModeSrc: "/project-image/image.png",
    video: "",
    description: "Gamified learning platform with structured roadmaps and leaderboards to master Data Structures and Algorithms.",
    tech: ["next", "react", "ts", "tailwind", "node"],
    github: "https://github.com/rishabhx29/AlgoForge",
    live: "https://algo-forge-2-0.vercel.app/",
    hasPin: true,
  },
  {
    slug: "traceon",
    title: "Traceon",
    imageTitle: "Codebase Analysis",
    src: "/project-image/image copy.png",
    lightModeSrc: "/project-image/image.png",
    video: "",
    description: "Unified codebase analysis and profile DNA checker powered by AI for intuitive developer experiences.",
    tech: ["next", "ts", "react", "tailwind", "llama"],
    github: "https://github.com/rishabhx29/Traceon",
    live: "https://traceon.vercel.app/",
    hasPin: true,
  },
  {
    slug: "edupulse",
    title: "EduPulse",
    imageTitle: "Learning Management System",
    src: "/project-image/image copy.png",
    lightModeSrc: "/project-image/image.png",
    video: "",
    description: "Production-ready Learning Management System with Instructor Studio, payment integration, and Admin Controls.",
    tech: ["react", "node", "tailwind"],
    github: "https://github.com/rishabhx29/Edupulse",
    live: "https://edupulse-client.vercel.app/",
    hasPin: false,
  },
];
