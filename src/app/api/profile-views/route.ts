import { NextResponse } from "next/server";
import { getProfileViews, profileViewsConfigured, recordProfileView } from "@/lib/profile-views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "private, no-store" };
const unavailable = () => NextResponse.json({ ok: false, count: null }, { headers });

export async function GET() {
  if (!profileViewsConfigured()) return unavailable();
  try {
    return NextResponse.json({ ok: true, count: await getProfileViews() }, { headers });
  } catch {
    return unavailable();
  }
}

export async function POST(request: Request) {
  if (!profileViewsConfigured()) return unavailable();

  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers });
  }

  let visitorId: unknown;
  try {
    ({ visitorId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400, headers });
  }
  if (typeof visitorId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(visitorId)) {
    return NextResponse.json({ error: "Invalid visitor id" }, { status: 400, headers });
  }

  // Vercel Proxy sets x-real-ip; do not trust caller-controlled forwarded-for.
  // Local development has no trusted proxy, so shares a single dev bucket.
  const clientIp = process.env.VERCEL ? request.headers.get("x-real-ip") : "local";
  if (!clientIp) return NextResponse.json({ error: "Client unavailable" }, { status: 403, headers });

  try {
    return NextResponse.json({ ok: true, count: await recordProfileView(visitorId, clientIp) }, { headers });
  } catch {
    return unavailable();
  }
}
