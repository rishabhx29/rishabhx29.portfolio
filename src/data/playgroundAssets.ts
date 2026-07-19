export type WorkbenchObjectType = "photo" | "project" | "achievement" | "note" | "label";

export interface WorkbenchObject {
  id: string;
  type: WorkbenchObjectType;
  title: string;
  subtitle?: string;
  content?: string;
  src?: string;
  href?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  variant?: "paper" | "polaroid" | "stamp" | "dark";
  removable?: boolean;
}

export interface PlaygroundAssetItem {
  id: string;
  type: "image" | "badge" | "sticky" | "tech" | "widget";
  title: string;
  subtitle?: string;
  src?: string;
  color?: string;
  content?: string;
  defaultX: number;
  defaultY: number;
  width?: number;
  height?: number;
  rotation?: number;
  link?: string;
}

export interface PlaygroundAssetCatalogItem {
  id: string;
  type: Extract<WorkbenchObjectType, "photo" | "achievement" | "project">;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  variant: NonNullable<WorkbenchObject["variant"]>;
}

export const PLAYGROUND_ASSET_CATALOG: PlaygroundAssetCatalogItem[] = [
  {
    id: "field-view",
    type: "photo",
    title: "Field notes: altitude",
    subtitle: "A reminder to keep the system view wide.",
    src: "/Playground/1.jpeg",
    alt: "Green hills and a lake seen from a mountain viewpoint",
    width: 276,
    height: 330,
    variant: "polaroid",
  },
  {
    id: "outside-the-editor",
    type: "photo",
    title: "Outside the editor",
    subtitle: "Curiosity survives the build.",
    src: "/Playground/2.jpeg",
    alt: "Rishabh seated on a rock during a hike",
    width: 264,
    height: 350,
    variant: "polaroid",
  },
  {
    id: "field-capture-03",
    type: "photo",
    title: "Field capture 03",
    subtitle: "A small piece of the wider context.",
    src: "/Playground/3.jpeg",
    alt: "Personal field photograph from Rishabh's playground collection",
    width: 250,
    height: 300,
    variant: "polaroid",
  },
  {
    id: "field-capture-04",
    type: "photo",
    title: "Field capture 04",
    subtitle: "Proof that side quests count.",
    src: "/Playground/4.jpeg",
    alt: "Personal field photograph from Rishabh's playground collection",
    width: 250,
    height: 300,
    variant: "polaroid",
  },
  {
    id: "field-capture-05",
    type: "photo",
    title: "Field capture 05",
    subtitle: "One more note from outside the build.",
    src: "/Playground/5.jpeg",
    alt: "Personal field photograph from Rishabh's playground collection",
    width: 250,
    height: 300,
    variant: "polaroid",
  },
  {
    id: "resume-snapshot",
    type: "project",
    title: "Resume snapshot",
    subtitle: "The short version, pinned to the wall.",
    src: "/Playground/Rishabh-Tripathi-Resume.png",
    alt: "Screenshot of Rishabh Tripathi's resume",
    width: 268,
    height: 330,
    variant: "paper",
  },
  {
    id: "rishabh-avatar",
    type: "photo",
    title: "Rishabh Tripathi",
    subtitle: "Full-stack & systems engineer",
    src: "/Playground/Rishabh-Avatar.jpg",
    alt: "Portrait of Rishabh Tripathi",
    width: 230,
    height: 274,
    variant: "paper",
  },
  {
    id: "traceon",
    type: "project",
    title: "Traceon",
    subtitle: "Distributed telemetry & logging",
    src: "/project-image/Traceon%20Dark.png",
    alt: "Traceon project banner",
    width: 340,
    height: 220,
    variant: "dark",
  },
  {
    id: "gssoc",
    type: "achievement",
    title: "GSSoC 2024",
    subtitle: "Open-source contributor",
    src: "/Playground/Gssoc-badge.png",
    alt: "GirlScript Summer of Code badge",
    width: 210,
    height: 240,
    variant: "stamp",
  },
  {
    id: "ssoc",
    type: "achievement",
    title: "Social Summer of Code",
    subtitle: "Community engineering",
    src: "/Playground/ssoc-badge.png",
    alt: "Social Summer of Code badge",
    width: 210,
    height: 240,
    variant: "stamp",
  },
  {
    id: "shinchan",
    type: "photo",
    title: "Classified side quest",
    subtitle: "Found it? Keep it quiet.",
    src: "/Playground/SHINCHAN%20IS%20HACKER.jpg",
    alt: "Playful Shinchan hacker illustration",
    width: 200,
    height: 230,
    variant: "polaroid",
  },
];

const item = (id: string, x: number, y: number, rotation = 0): WorkbenchObject => {
  const asset = PLAYGROUND_ASSET_CATALOG.find((entry) => entry.id === id);
  if (!asset) throw new Error(`Unknown playground asset: ${id}`);
  return { ...asset, x, y, rotation, removable: false };
};

export const DEFAULT_WORKBENCH_OBJECTS: WorkbenchObject[] = [
  { id: "label-build", type: "label", title: "01 / BUILD", subtitle: "things I have shipped", x: 122, y: 92, width: 260, height: 70, variant: "paper" },
  item("traceon", 160, 190, -1),
  { id: "note-systems", type: "note", title: "Systems note", content: "I care about clear boundaries, predictable failure modes, and interfaces that feel obvious after the hard work is done.", x: 535, y: 184, width: 290, height: 210, rotation: 2, variant: "paper" },
  { id: "label-operate", type: "label", title: "02 / OPERATE", subtitle: "how I approach the work", x: 940, y: 106, width: 280, height: 70, variant: "paper" },
  item("rishabh-avatar", 980, 210, 3),
  item("field-view", 1280, 166, -3),
  { id: "note-stack", type: "note", title: "Working stack", content: "TypeScript · React · Next.js · Node.js · MongoDB\n\nA practical toolkit for thoughtful products and systems.", x: 960, y: 530, width: 278, height: 198, rotation: -1, variant: "dark" },
  { id: "label-contribute", type: "label", title: "03 / CONTRIBUTE", subtitle: "community and momentum", x: 150, y: 690, width: 290, height: 70, variant: "paper" },
  item("gssoc", 176, 790, -4),
  item("ssoc", 440, 790, 4),
  item("outside-the-editor", 770, 765, -2),
  { id: "label-after-hours", type: "label", title: "04 / AFTER HOURS", subtitle: "small context, real person", x: 1200, y: 760, width: 310, height: 70, variant: "paper" },
  item("shinchan", 1300, 854, 5),
];

export const WORKBENCH_LAYOUTS = {
  fieldNotes: DEFAULT_WORKBENCH_OBJECTS,
  projectWall: DEFAULT_WORKBENCH_OBJECTS.map((entry, index) => ({
    ...entry,
    x: 120 + (index % 4) * 420,
    y: 110 + Math.floor(index / 4) * 300,
    rotation: 0,
  })),
  afterHours: DEFAULT_WORKBENCH_OBJECTS.map((entry, index) => ({
    ...entry,
    x: 130 + (index % 5) * 330,
    y: 150 + Math.floor(index / 5) * 395,
    rotation: [-4, 2, -2, 3, -1][index % 5],
  })),
} as const;
