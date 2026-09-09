import type { Metadata } from "next";
import { Doto, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "@/components/page-transition";
import { RightNavbar } from "@/components/RightNavbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  siteDescription,
  siteKeywords,
  siteName,
  siteTitle,
  siteUrl,
} from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: "%s | Rishabh Tripathi Portfolio",
  },
  description: siteDescription,
  applicationName: "Rishabh Portfolio",
  keywords: siteKeywords,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "Rishabh Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rishabh Tripathi Portfolio — Full-Stack Software Engineer & Open Source Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@RishabhTri8805",
    images: ["/opengraph-image"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl.origin}/#website`,
      url: siteUrl.origin,
      name: "Rishabh Portfolio",
      alternateName: [
        "Rishabh Tripathi Portfolio",
        "rishabhx29 Portfolio",
        "Rishabh Developer Portfolio",
        "Rishabh's Portfolio",
      ],
      description: siteDescription,
      inLanguage: "en-US",
      publisher: {
        "@id": `${siteUrl.origin}/#person`,
      },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl.origin}/#profilepage`,
      url: siteUrl.origin,
      name: siteTitle,
      isPartOf: {
        "@id": `${siteUrl.origin}/#website`,
      },
      about: {
        "@id": `${siteUrl.origin}/#person`,
      },
      mainEntity: {
        "@id": `${siteUrl.origin}/#person`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${siteUrl.origin}/Rishabh-Avatar.jpg`,
      },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl.origin}/#person`,
      name: siteName,
      alternateName: ["Rishabh", "rishabhx29", "Rishabh Tripathi Portfolio"],
      url: siteUrl.origin,
      image: `${siteUrl.origin}/Rishabh-Avatar.jpg`,
      jobTitle: "Full-Stack Software Engineer",
      description:
        "Full-stack software engineer and open-source contributor building scalable web applications, developer tools, and high-performance user interfaces.",
      knowsAbout: [
        "Full-Stack Web Development",
        "Software Engineering",
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Node.js",
        "Tailwind CSS",
        "Data Structures and Algorithms",
        "Open Source Software",
        "System Architecture",
      ],
      sameAs: [
        "https://github.com/rishabhx29",
        "https://www.linkedin.com/in/rishabh-tripathi-728a77317",
        "https://x.com/RishabhTri8805",
        "https://rishabhx29.vercel.app",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${doto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbfaf9] dark:bg-[#100f0f] text-[#17171a] dark:text-[#fafafa] transition-colors duration-300 selection:bg-orange-500/20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RightNavbar />
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
