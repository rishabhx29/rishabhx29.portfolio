const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
const resolvedUrl =
  configuredUrl && !configuredUrl.includes("portfolio-v2-two-xi")
    ? configuredUrl
    : "https://rishabhx29.me";

export const siteUrl = new URL(resolvedUrl);

export const siteName = "Rishabh Tripathi";
export const siteDomain = "rishabhx29.me";
export const alternateDomain = "rishabhx29.vercel.app";

export const siteTitle = "Rishabh Portfolio | Rishabh Tripathi — Full-Stack Software Engineer";

export const siteDescription =
  "Official portfolio of Rishabh Tripathi (rishabhx29) — Full-stack software engineer & open-source developer. Building scalable web applications, developer tools (Traceon, VeloKey, Adaptive, AlgoForge), and high-performance user interfaces.";

export const siteKeywords = [
  "Rishabh",
  "Rishabh portfolio",
  "Rishabh Tripathi",
  "Rishabh Tripathi portfolio",
  "rishabhx29",
  "rishabhx29 portfolio",
  "rishabh developer",
  "full-stack engineer portfolio",
  "software engineer portfolio",
  "Next.js developer portfolio",
  "React developer portfolio",
  "TypeScript engineer",
  "frontend developer portfolio",
  "backend developer portfolio",
  "AlgoForge",
  "Traceon",
  "VeloKey",
  "Adaptive",
  "open-source contributor portfolio",
  "SSoC Project Admin",
  "GSSoC Contributor",
];

