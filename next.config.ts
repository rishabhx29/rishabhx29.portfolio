import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "three",
      "canvas-confetti",
      "framer-motion",
      "cmdk",
      "gsap",
    ],
  },
  images: {
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75, 80, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        port: "",
        pathname: "/media/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "unavatar.io",
        port: "",
        pathname: "/twitter/**",
        search: "",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://static.wixstatic.com https://github.com https://unavatar.io https://avatars.githubusercontent.com https://raw.githubusercontent.com; font-src 'self' data:; connect-src 'self' https://api.github.com https://formspree.io https://api.web3forms.com https://formsubmit.co https://vitals.vercel-insights.com https://va.vercel-scripts.com; media-src 'self' data: blob:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self' https://formspree.io https://api.web3forms.com https://formsubmit.co; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
