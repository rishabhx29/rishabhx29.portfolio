export type ExperienceData = {
  title: string;
  role: string;
  dates: string;
  location: string;
  src: string;
  type?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  description: string;
  tech: string[];
  metrics?: { label: string; value: string }[];
  screenshot?: string;
};

export const experiences: ExperienceData[] = [
  {
    title: "Ecera System Private Ltd.",
    role: "Software Developer Intern",
    dates: "June 2026 - Present",
    location: "Remote",
    src: "/Experience-image/pngegg (1).png",
    imageFit: "contain",
    imageZoom: 1.5,
    description: `
      Engineered a scalable Job Portal from scratch, establishing robust system architecture, implementing secure authentication, and configuring Jenkins CI/CD pipelines for automated deployments on a VPS
      Contributed to an LMS platform by refactoring UI components for improved accessibility, integrating captcha security, and building real-time dashboard features
    `,
    tech: ["React", "Node.js", "Jenkins", "VPS", "Authentication", "UI/UX"],
  },
  {
    title: "SSoC",
    role: "Project Admin",
    dates: "June 2026 - Present",
    location: "Remote",
    src: "/Experience-image/Google_Summer_of_Code_sun_logo_2022.svg (1).png",
    imageFit: "contain",
    imageZoom: 0.9,
    description: `
      Administered and mentored contributors for Traceon and AlgoForge projects
      Guided technical architecture decisions, reviewed pull requests, and maintained high code quality standards
      Fostered an active open-source community by helping contributors understand the codebase and resolving complex issues
    `,
    tech: ["Project Management", "Open Source", "Code Review", "Mentorship"],
  },
  {
    title: "GSSoC",
    role: "Contributor",
    dates: "April 2026 - Present",
    location: "Remote",
    src: "/Experience-image/Google_Summer_of_Code_sun_logo_2022.svg (1).png",
    imageFit: "contain",
    imageZoom: 0.9,
    description: `
      Actively contributed to the Editron and Commitpulse open-source projects
      Resolved complex issues, optimized application performance, and collaborated with maintainers to implement new features during the GirlScript Summer of Code
    `,
    tech: ["Open Source", "React", "Next.js", "TypeScript"],
  },
];
