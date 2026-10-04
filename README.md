<div align="center">

# Rishabh Tripathi

**Full-Stack Software Engineer · Open-Source Maintainer & Mentor**

[![Portfolio](https://img.shields.io/badge/portfolio-rishabhx29.me-111111?style=flat-square&logo=vercel&logoColor=white)](https://rishabhx29.me)
[![GitHub](https://img.shields.io/badge/github-rishabhx29-111111?style=flat-square&logo=github&logoColor=white)](https://github.com/rishabhx29)
[![LinkedIn](https://img.shields.io/badge/linkedin-rishabh-tripathi-111111?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rishabh-tripathi-728a77317)
[![X](https://img.shields.io/badge/x-@RishabhTri8805-111111?style=flat-square&logo=x&logoColor=white)](https://x.com/RishabhTri8805)

</div>

---

I build fast, dependable products and I write code that other people enjoy
reading. Most of my time goes into developer tools — code intelligence,
typing analytics, gamified DSA — and into open source, where I maintain
projects, review pull requests, and help first-time contributors get unblocked.

I care about the parts of software nobody demos: architecture that survives
its second year, accessible keyboard paths, honest error states, and pages
that don't shift while they're loading.

> *Simplicity is prerequisite for reliability.* — Edsger W. Dijkstra

---

## 🛠️ What I'm building

| Project | What it is | Status |
| :--- | :--- | :--- |
| **[Traceon](https://traceon.vercel.app/)** · [source](https://github.com/rishabhx29/Traceon) | Maps a repository's architecture into interactive dependency graphs using AST worker threads, scores blast-radius impact, and evaluates engineering capability with an LLM-powered "profile DNA". | **Live** |
| **[VeloKey](https://velokey.vercel.app/)** · [source](https://github.com/rishabhx29/velokey) | A distraction-free typing platform with live WPM telemetry, consistency charts, a mirroring virtual keyboard, and Web Audio per-key acoustic feedback. | **Live** |
| **[AlgoForge](https://algo-forge-2-0.vercel.app/)** · [source](https://github.com/rishabhx29/AlgoForge) | Gamified DSA learning — curated roadmaps, daily streaks, XP milestones, activity heatmaps, and global leaderboards that build intuition instead of memorising answers. | **Live** |
| **[Adaptive](https://adaptiv-nine.vercel.app/)** · [source](https://github.com/rishabhx29/Adaptiv) | Contextual AI portfolio and dynamic resume system — Gemini reframes your experience for a specific role or company, paired with an ATS-friendly PDF generator. | **Building** |

---

## 🌱 Open source

| Programme | Role | Period |
| :--- | :--- | :--- |
| **Social Summer of Code (SSoC)** | Project Admin — admin and mentor contributors on Traceon and AlgoForge, guide architecture decisions, review PRs, and resolve issues with people early in their open-source journey. | Jun 2026 — Present |
| **GirlScript Summer of Code (GSSoC)** | Contributor — shipped features and performance work on *Editron* and *Commitpulse* alongside maintainers. | Apr 2026 — Present |
| **Ecera System Pvt. Ltd.** | Software Developer Intern — architected a job portal from the ground up (auth, CI/CD on a VPS via Jenkins), plus accessibility refactors, captcha security, and real-time dashboards on an LMS. | Jun 2026 — Present |

---

## 🧰 The stack, honestly

I split this three ways on purpose — a flat list of forty technologies tells
you nothing about how I actually work.

**Every day** — what I open without thinking about it
`Python` · `TypeScript` · `React` · `Next.js` · `FastAPI` · `PostgreSQL` · `Git`

**Often** — reached for whenever the problem calls for it
`Tailwind` · `Kubernetes` · `Redis` · `Docker` · `Supabase` · `Vue` · `Prometheus` · `Vercel`

**When it fits** — used in anger at least once, happy to again
`LangChain` · `Ollama` · `Django` · `Spring Boot` · `Java` · `Firebase` · `MySQL`

---

## 🖥️ This site

**[rishabhx29.me](https://rishabhx29.me)** is my portfolio and an interactive
sandbox, built on a custom *technical blueprint / CAD* design language — dashed
drawing frames, hairline grid rules, crosshair registration marks, and
monospaced numerals.

What makes it more than a template:

- **An open-ended CAD sandbox** (`/playground`) — a free-form canvas where you
  drag technology tokens, place sticky notes, draw freehand with pen and
  eraser, and export a high-resolution PNG of your board.
- **Live GitHub activity** — the full 12-month contribution graph, fetched
  through a locked-down server route and horizontally scrollable on mobile.
- **An open-source PR showcase** — real Merged / Open / Closed filters across
  my contributions.
- **Blueprint route transitions** — grid lines draw themselves across the
  viewport on navigation, then settle to a static hairline.
- **Sound-engineered interaction** — a Web Audio engine synthesises tactile
  cues for clicks, hovers, and theme changes. No audio files required.
- **Responsive by design** — mobile gets a fixed top bar and an expanding-pill
  bottom tab bar, not a squeezed-down desktop.
- **Easter eggs** — try <kbd>↑</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd><kbd>←</kbd><kbd>→</kbd><kbd>B</kbd><kbd>A</kbd> somewhere. There's also a dog.

Built with **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript 5** (strict) ·
**Tailwind CSS v4** · **Framer Motion** · **GSAP** · **three.js** · **Vitest**.

### A few engineering decisions worth calling out

This is the part I'm most opinionated about, so here's the reasoning rather
than just the stack:

- **The GitHub route is a locked server, not a proxy.** `/api/github` holds the
  `GITHUB_TOKEN`, so it accepts *only* an exact allowlist of the GraphQL
  documents this site actually sends — anything else is a `403` before it
  reaches the network. It's rate-limited per IP, cached for five minutes, and
  times out at eight seconds. The allowlist is generated from the same module
  the client imports, so the two can't drift apart.
- **Assets are audited, not assumed.** A script cross-references every
  root-relative asset reference in `src/` against `public/` and fails loudly on
  anything that would 404. This caught seven broken images in one pass.
- **Images degrade instead of breaking.** Blog figures fall back to a labelled
  placeholder if an asset is ever missing, so content never renders as a
  torn-image icon.
- **Static analysis is enforced locally.** ESLint runs with SonarQube's rule
  set, and there are 33 unit tests covering the GitHub data layer, the audio
  engine, and the playground board state.
- **Motion is decorative, never load-bearing.** Everything respects
  `prefers-reduced-motion`.

---

## 💬 Let's talk

I'm always up for talking about developer tooling, code intelligence,
open-source mentorship, or building things that are genuinely useful.

- **GitHub** — [github.com/rishabhx29](https://github.com/rishabhx29)
- **X** — [@RishabhTri8805](https://x.com/RishabhTri8805)
- **LinkedIn** — [rishabh-tripathi](https://www.linkedin.com/in/rishabh-tripathi-728a77317)
- **Discord** — [jiraya_sensei2139](https://discord.com/users/jiraya_sensei2139)
- **Email** — via the [contact page](https://rishabhx29.me/contact)

---

<details>
<summary><b>Run it locally</b></summary>

```bash
git clone https://github.com/rishabhx29/rishabhx29.portfolio.git
cd rishabhx29.portfolio
npm install
npm run dev
```

Needs Node 20+. Scripts: `dev` · `build` · `start` · `lint` · `test`.
All portfolio content lives in `src/data/` — projects, experience, and
playground tokens are plain typed objects.

</details>

<div align="center">
  <sub>Engineered with precision by <b>Rishabh Tripathi</b></sub>
</div>
