import { NextResponse } from "next/server";

/**
 * Live Spotify "now / last played" for the site's song chip.
 *
 * The three secrets are read from the server environment and never shipped to
 * the client. The endpoint falls back to a `not-configured` payload rather
 * than throwing, so the chip can show an honest unavailable state when a
 * deployment has not added the keys.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Artist = { name: string };
type SpotifyTrack = {
  name: string;
  artists?: Artist[];
  album?: { name: string; images?: { url: string; width: number; height: number }[] };
  external_urls?: { spotify: string };
};

let cached: { at: number; data: unknown } | null = null;
const TTL_MS = 45_000;

function env() {
  return {
    id: process.env.SPOTIFY_CLIENT_ID,
    secret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
  };
}

const notConfigured = () =>
  NextResponse.json({ ok: false, reason: "not-configured" }, { status: 200 });

async function getAccessToken(): Promise<string | null> {
  const { id, secret, refreshToken } = env();
  if (!id || !secret || !refreshToken) return null;

  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

function trackPayload(item: SpotifyTrack | undefined, isPlaying: boolean) {
  if (!item) return null;
  return {
    ok: true,
    isPlaying,
    title: item.name,
    artist: (item.artists ?? []).map((a) => a.name).join(", "),
    album: item.album?.name ?? "",
    image: item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url ?? "",
    url: item.external_urls?.spotify ?? "",
  };
}

export async function GET() {
  if (cached && Date.now() - cached.at < TTL_MS) {
    return NextResponse.json(cached.data, { headers: { "X-Cache": "HIT" } });
  }

  const token = await getAccessToken();
  if (!token) return notConfigured();

  let payload: Record<string, unknown> | null = null;

  try {
    const now = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing?additional_types=track",
      { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) },
    );
    if (now.status === 200) {
      const j = (await now.json()) as { is_playing?: boolean; item?: SpotifyTrack };
      if (!j || (!j.item && !j.is_playing)) {
        // nothing playing / not a track (e.g. podcast) -> try last played
      } else {
        payload = trackPayload(j.item, !!j.is_playing);
      }
    }
  } catch {
    /* fall through to recently played */
  }

  if (!payload) {
    try {
      const rec = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(8000),
      });
      if (rec.ok) {
        const j = (await rec.json()) as { items?: { track?: SpotifyTrack }[] };
        payload = trackPayload(j.items?.[0]?.track, false);
      }
    } catch {
      /* fall through */
    }
  }

  if (!payload) payload = { ok: false, reason: "no-data" };

  cached = { at: Date.now(), data: payload };
  return NextResponse.json(payload, { headers: { "X-Cache": "MISS" } });
}
