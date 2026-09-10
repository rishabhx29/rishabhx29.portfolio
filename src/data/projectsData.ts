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

export type ProjectStatus = "live" | "building" | "not-started";

export interface Project {
  slug: string;
  title: string;
  imageTitle: string;
  src: string;
  video: string;
  description: string;
  detailedDescription?: string;
  tech: TechItem[];
  github: string;
  live: string;
  starsText?: string;
  backgroundImage?: string;
  hasPin: boolean;
  status?: ProjectStatus;
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
    slug: "traceon",
    title: "Traceon",
    imageTitle: "Codebase Analysis",
    src: "/project-image/Traceon.png",
    video: "",
    description: "Unified codebase analysis and profile DNA checker powered by AI for intuitive developer experiences.",
    detailedDescription: "Unified codebase analysis and developer intelligence platform that maps repository architecture into interactive dependency graphs via AST worker threads, calculates blast-radius impact scores, and evaluates engineering capability using LLM-powered profile DNA.",
    tech: ["next", "ts", "react", "tailwind", "llama"],
    github: "https://github.com/rishabhx29/Traceon",
    live: "https://traceon.vercel.app/",
    backgroundImage: "/image copy 3.png",
    hasPin: true,
    status: "live",
  },
  {
    slug: "velokey",
    title: "VeloKey",
    imageTitle: "Typing Test Platform",
    src: "/project-image/Velokey.png",
    video: "",
    description: "Minimalist, distraction-free typing performance platform with live telemetry, custom sounds, and speed analytics.",
    detailedDescription: "Minimalist, distraction-free typing performance platform featuring timed and word-count drills, real-time WPM telemetry and consistency charts, interactive virtual keyboard mirroring, and Web Audio per-key acoustic feedback.",
    tech: ["next", "ts", "react", "tailwind", "cloud", "charts"],
    github: "https://github.com/rishabhx29/velokey",
    live: "https://velokey.vercel.app/",
    backgroundImage: "/image copy 5.png",
    hasPin: false,
    status: "live",
  },
  {
    slug: "adaptive",
    title: "Adaptive",
    imageTitle: "Portfolio Builder",
    src: "/project-image/Adaptiv.png",
    video: "",
    description: "Contextual AI portfolio and dynamic resume system tailored for specific roles and companies.",
    detailedDescription: "AI-powered portfolio and dynamic resume system that leverages Google Gemini to contextualize skill narratives and pitch arguments for target roles, paired with an ATS-friendly two-column PDF generator.",
    tech: ["next", "ts", "react", "tailwind", "gemini", "motion"],
    github: "https://github.com/rishabhx29/Adaptiv",
    live: "https://adaptiv-nine.vercel.app/",
    backgroundImage: "/image copy.png",
    hasPin: false,
    status: "building",
  },
  {
    slug: "algoforge",
    title: "AlgoForge",
    imageTitle: "DSA Platform",
    src: "/project-image/AlgoForge.png",
    video: "",
    description: "Gamified learning platform with structured roadmaps and leaderboards to master Data Structures and Algorithms.",
    detailedDescription: "Gamified algorithmic learning platform designed to build coding intuition through curated DSA roadmaps, daily practice streaks, XP milestones, activity intensity heatmaps, and real-time global leaderboards.",
    tech: ["next", "react", "ts", "tailwind", "node"],
    github: "https://github.com/rishabhx29/AlgoForge",
    live: "https://algo-forge-2-0.vercel.app/",
    backgroundImage: "/image copy.png",
    hasPin: true,
    status: "live",
  },
];
