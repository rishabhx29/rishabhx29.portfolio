import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const token = process.env.GITHUB_TOKEN || "";

    if (!token) {
      return NextResponse.json({ 
        data: null,
        message: "Offline / Fallback mode",
        fallback: true
      }, { status: 200 });
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ data: null, fallback: true }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ data: null, fallback: true }, { status: 200 });
  }
}
