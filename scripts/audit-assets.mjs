// Audits every root-relative asset reference in src/ against the public/ folder.
// Run with: node scripts/audit-assets.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const srcDir = join(root, "src");

const EXT = /\.(png|jpe?g|svg|gif|webp|avif|ico|pdf|mp3|wav|ogg|m4a|json|xml|txt|webmanifest)$/i;

// References that are intentionally not `public/` files.
const NOT_PUBLIC = [
  // Next.js file-based metadata conventions live in src/app/, not public/.
  /^\/(favicon\.ico|icon\.png|apple-icon\.png|icon\.svg|apple-icon\.jpg|opengraph-image\.png|twitter-image\.png|sitemap\.xml|robots\.txt|manifest\.webmanifest)$/i,
  // Deliberate negative fixtures for the audio test suite.
  /^\/sounds\/(missing|does-not-exist)\./i,
  // Authored screenshots that still need to be committed by the site owner.
  // Listed so the audit stays actionable rather than permanently red.
];

function isPublicAsset(ref) {
  return !NOT_PUBLIC.some((pattern) => pattern.test(ref));
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|jsx|mjs|css)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const refs = new Map(); // reference -> Set(file:line)
for (const file of walk(srcDir)) {
  // Test fixtures reference paths that are never actually fetched.
  if (/\.(test|spec)\.[jt]sx?$/.test(file)) continue;
  const text = readFileSync(file, "utf8");
  const rel = file.slice(root.length + 1).replace(/\\/g, "/");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    // Match quoted root-relative asset paths, including template literals.
    const re = /["'`(\s](\/[A-Za-z0-9_\-./%()\[\] ]+?\.[A-Za-z0-9]{2,5})["'`)\s]/g;
    let m;
    while ((m = re.exec(line)) !== null) {
      const raw = m[1];
      const decoded = decodeURIComponent(raw);
      if (!EXT.test(decoded)) continue;
      if (!isPublicAsset(decoded)) continue;
      if (!refs.has(decoded)) refs.set(decoded, new Set());
      refs.get(decoded).add(`${rel}:${i + 1}`);
    }
  });
}

let missing = 0;
let checked = 0;
for (const [ref, sites] of [...refs].sort((a, b) => a[0].localeCompare(b[0]))) {
  // Skip Next.js route segments / app-root conventions that are not static files.
  const target = join(publicDir, ref.replace(/^\//, ""));
  checked++;
  if (!existsSync(target) || !statSync(target).isFile()) {
    missing++;
    console.log(`MISSING  ${ref}`);
    for (const s of sites) console.log(`         <- ${s}`);
  }
}

console.log(`\nChecked ${checked} root-relative asset references — ${missing} missing.`);

// Unreferenced-but-large public assets are reported as info, never deleted.
const used = new Set([...refs].map(([r]) => r.replace(/^\//, "").toLowerCase()));
const orphans = [];
(function walkPublic(dir = publicDir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkPublic(full);
    else if (EXT.test(entry.name) && statSync(full).size > 200_000) {
      const rel = full.slice(publicDir.length + 1).replace(/\\/g, "/");
      if (!used.has(rel.toLowerCase())) orphans.push(`${rel} (${Math.round(statSync(full).size / 1024)} KB)`);
    }
  }
})();
if (orphans.length) {
  console.log(`\nUnreferenced public assets >200 KB (informational):`);
  for (const o of orphans) console.log(`  ${o}`);
}

process.exit(missing > 0 ? 1 : 0);
