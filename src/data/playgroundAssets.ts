export interface PlaygroundAssetItem {
  id: string;
  type: 'image' | 'badge' | 'sticky' | 'tech' | 'widget';
  title: string;
  subtitle?: string;
  src?: string;
  color?: string; // For sticky notes or tech badges
  content?: string; // For sticky notes text
  defaultX: number;
  defaultY: number;
  width?: number;
  height?: number;
  rotation?: number;
  link?: string;
}

export const INITIAL_PLAYGROUND_ASSETS: PlaygroundAssetItem[] = [
  // ── Profiles & Avatars ──
  {
    id: "avatar-main",
    type: "image",
    title: "Rishabh Tripathi",
    subtitle: "Full-Stack & Systems Engineer",
    src: "/Rishabh.png",
    defaultX: 380,
    defaultY: 180,
    width: 240,
    height: 280,
    rotation: -2,
    link: "https://github.com/rishabhx29"
  },
  {
    id: "avatar-secondary",
    type: "image",
    title: "Level 99 Developer Mode",
    subtitle: "Konami Code Unlocked",
    src: "/Rishabh-Avatar.jpg",
    defaultX: 780,
    defaultY: 520,
    width: 200,
    height: 240,
    rotation: 4
  },
  {
    id: "project-banner",
    type: "image",
    title: "Traceon & Distributed Architecture",
    subtitle: "High-throughput telemetry & logging engine",
    src: "/banner.png",
    defaultX: 680,
    defaultY: 150,
    width: 360,
    height: 200,
    rotation: 1
  },

  // ── Badges & Achievements ──
  {
    id: "badge-gssoc",
    type: "badge",
    title: "GirlScript Summer of Code 2024",
    subtitle: "Top Open Source Contributor",
    src: "/Gssoc-badge.png",
    defaultX: 120,
    defaultY: 160,
    width: 220,
    height: 220,
    rotation: -4
  },
  {
    id: "badge-ssoc",
    type: "badge",
    title: "Social Summer of Code 2024",
    subtitle: "Open Source Engineering Badge",
    src: "/ssoc-badge.png",
    defaultX: 140,
    defaultY: 440,
    width: 210,
    height: 210,
    rotation: 3
  },

  // ── Tech Stack Tokens ──
  {
    id: "tech-next",
    type: "tech",
    title: "Next.js 16 (App Router)",
    color: "from-zinc-900 to-zinc-800 border-zinc-700 text-zinc-100",
    defaultX: 420,
    defaultY: 500,
    width: 180,
    height: 60,
    rotation: -1
  },
  {
    id: "tech-ts",
    type: "tech",
    title: "TypeScript 5+",
    color: "from-blue-950/80 to-blue-900/60 border-blue-500/40 text-blue-300",
    defaultX: 620,
    defaultY: 480,
    width: 150,
    height: 56,
    rotation: 2
  },
  {
    id: "tech-react",
    type: "tech",
    title: "React 19 & Framer Motion",
    color: "from-cyan-950/80 to-cyan-900/60 border-cyan-500/40 text-cyan-300",
    defaultX: 440,
    defaultY: 580,
    width: 210,
    height: 56,
    rotation: -2
  },
  {
    id: "tech-node",
    type: "tech",
    title: "Node.js & Express Microservices",
    color: "from-emerald-950/80 to-emerald-900/60 border-emerald-500/40 text-emerald-300",
    defaultX: 680,
    defaultY: 560,
    width: 240,
    height: 56,
    rotation: 1
  },
  {
    id: "tech-tailwind",
    type: "tech",
    title: "Tailwind CSS v4 & Glassmorphism",
    color: "from-sky-950/80 to-sky-900/60 border-sky-500/40 text-sky-300",
    defaultX: 400,
    defaultY: 660,
    width: 250,
    height: 56,
    rotation: -1
  },

  // ── Interactive Sticky Notes ──
  {
    id: "sticky-welcome",
    type: "sticky",
    title: "👋 Welcome to my Blueprint Sandbox!",
    content: "Feel free to drag these cards, draw connecting lines between my achievements, leave architectural sticky notes, and export your snapshot! Everything saves directly to your browser memory.",
    color: "yellow",
    defaultX: 1080,
    defaultY: 180,
    width: 260,
    height: 240,
    rotation: 3
  },
  {
    id: "sticky-architecture",
    type: "sticky",
    title: "💡 Systems Philosophy",
    content: "\"Simplicity is prerequisite for reliability.\" Built with low latency, high throughput, and clean modular boundaries in mind.",
    color: "cyan",
    defaultX: 1060,
    defaultY: 460,
    width: 260,
    height: 220,
    rotation: -2
  }
];

export const PRESET_LAYOUTS: Record<string, PlaygroundAssetItem[]> = {
  chaos: INITIAL_PLAYGROUND_ASSETS,
  roadmap: INITIAL_PLAYGROUND_ASSETS.map((asset, index) => {
    // Organize chronologically from left to right in clean grid rows
    const col = index % 4;
    const row = Math.floor(index / 4);
    return {
      ...asset,
      defaultX: 140 + col * 320,
      defaultY: 160 + row * 280,
      rotation: 0
    };
  }),
  tech: INITIAL_PLAYGROUND_ASSETS.map((asset) => {
    // Cluster tech tokens and badges in center, profile on left, notes on right
    if (asset.type === "tech") {
      return { ...asset, defaultX: 520, defaultY: 250 + Math.random() * 300, rotation: 0 };
    }
    if (asset.type === "badge") {
      return { ...asset, defaultX: 160, defaultY: 260 + Math.random() * 250, rotation: 0 };
    }
    if (asset.type === "sticky") {
      return { ...asset, defaultX: 960, defaultY: 220 + Math.random() * 300, rotation: 0 };
    }
    return { ...asset, defaultX: 540, defaultY: 120, rotation: 0 };
  })
};
