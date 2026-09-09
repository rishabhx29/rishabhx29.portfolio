import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rishabh Portfolio | Rishabh Tripathi",
    short_name: "Rishabh Portfolio",
    description:
      "Official portfolio of Rishabh Tripathi (rishabhx29), full-stack software engineer and open-source developer.",
    start_url: "/",
    display: "standalone",
    background_color: "#100f0f",
    theme_color: "#100f0f",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  };
}
