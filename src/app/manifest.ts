import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rishabh Tripathi | Full-stack engineer",
    short_name: "Rishabh Tripathi",
    description:
      "Portfolio of Rishabh Tripathi, a full-stack engineer and open-source contributor.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/icon.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  };
}
