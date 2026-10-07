import { NextResponse } from "next/server";
import { getProfileViews, profileViewsConfigured } from "@/lib/profile-views";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The count is public; cache the server response at Vercel's edge so every
// browser does not consume a Vercel API query. Never return the access token.
const successHeaders = { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" };
const unconfiguredHeaders = { "Cache-Control": "private, no-store" };
// Briefly cache upstream failures too: an invalid token or API outage should
// not cause a paid upstream query for every visitor to this public endpoint.
const failureHeaders = { "Cache-Control": "public, s-maxage=30" };

export async function GET() {
  if (!profileViewsConfigured()) {
    return NextResponse.json({ ok: false, count: null }, { headers: unconfiguredHeaders });
  }

  try {
    const count = await getProfileViews();
    return NextResponse.json({ ok: true, count }, { headers: successHeaders });
  } catch {
    // An expired token, insufficient team access, or an API outage must not
    // appear as zero views or leak credential details to the browser.
    return NextResponse.json({ ok: false, count: null }, { headers: failureHeaders });
  }
}
