import { ImageResponse } from "next/og";

export const alt = "Rishabh Portfolio | Rishabh Tripathi — Full-Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#100f0f",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 700, letterSpacing: 3, color: "#f97316" }}>
            RISHABH TRIPATHI / PORTFOLIO
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 1, color: "#a1a1aa" }}>
            rishabhx29.me
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, letterSpacing: -2, lineHeight: 1.1 }}>
            Full-Stack Software Engineer
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#d4d4d8", lineHeight: 1.4 }}>
            Building AlgoForge, Traceon, EduPulse, and high-performance web products.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #27272a", paddingTop: "24px" }}>
          <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa" }}>
            React · Next.js · TypeScript · Node.js · Open Source
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#71717a" }}>
            SSoC Admin · GSSoC Contributor
          </div>
        </div>
      </div>
    ),
    size
  );
}
