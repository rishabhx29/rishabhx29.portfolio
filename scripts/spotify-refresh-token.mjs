#!/usr/bin/env node
/**
 * One-shot helper to produce SPOTIFY_REFRESH_TOKEN.
 *
 * Usage:
 *   node scripts/spotify-refresh-token.js            -> print the URL to visit
 *   node scripts/spotify-refresh-token.js <code>     -> exchange the code and
 *                                                       append the token to
 *                                                       .env.local
 *
 * Why: Spotify gives you a 60-second `code` after the authorize redirect, which
 * is worthless by itself. It has to be swapped for a `refresh_token`, which is
 * the credential the site actually uses. Doing that by hand means base64
 * encoding the secret and a correct redirect_uri; this automates it and
 * writes the result where the app looks for it.
 *
 * Requires Node 18+ (global fetch) — no extra packages.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPES = "user-read-recently-played,user-read-currently-playing";

const envPath = resolve(process.cwd(), ".env.local");
const env = readFileSync(envPath, "utf8");

function pick(name) {
  const m = env.match(new RegExp(`^\\s*${name}=(.+)$`, "m"));
  return m ? m[1].trim() : "";
}

const clientId = pick("SPOTIFY_CLIENT_ID");
const clientSecret = pick("SPOTIFY_CLIENT_SECRET");

if (!clientId || !clientSecret || clientId.endsWith("=") || clientSecret.endsWith("=")) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const code = process.argv[2];

if (!code) {
  console.log("Open this URL, approve, then copy the `code=` value from the address bar:\n");
  console.log(
    `https://accounts.spotify.com/authorize?client_id=${clientId}` +
      `&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(SCOPES)}`,
  );
  console.log(`\nThen run:\n  node scripts/spotify-refresh-token.mjs <code>`);
  process.exit(0);
}

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

const res = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${basic}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
  }),
});

const data = await res.json();

if (!res.ok) {
  console.error("Exchange failed:", JSON.stringify(data, null, 2));
  process.exit(1);
}

if (!data.refresh_token) {
  console.error(
    "No refresh_token in the response. Spotify only returns one on the FIRST\n" +
      "exchange of a code for a given client — or if scope forces it. Revoke the\n" +
      "existing access from your Spotify account page and re-run the flow.",
  );
  process.exit(1);
}

let updated = env.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
if (updated === env) {
  updated += `\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`;
}
writeFileSync(envPath, updated);

console.log("Done. Wrote SPOTIFY_REFRESH_TOKEN to .env.local.");
console.log(`Access token (valid ~1h): ${data.access_token?.slice(0, 14)}...`);
console.log("Restart the dev server for the chip to pick it up.");
