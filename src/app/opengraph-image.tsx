import { ImageResponse } from "next/og";

export const alt = "Rishabh Tripathi, full-stack engineer and open-source contributor";
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
          background: "#09090b",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 4, color: "#a1a1aa" }}>
          RISHABH TRIPATHI / PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 80, fontWeight: 700, letterSpacing: -3 }}>
            Full-stack engineer.
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#d4d4d8" }}>
            Building thoughtful products, developer tools, and reliable systems.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa" }}>
          React · Next.js · TypeScript · Node.js · Open source
        </div>
      </div>
    ),
    size
  );
}
