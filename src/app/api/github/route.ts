import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const token = process.env.GITHUB_TOKEN || "";

    if (!token) {
      return NextResponse.json({ 
        error: "Missing GITHUB_TOKEN credential",
        message: "Bad credentials",
        status: "401"
      }, { status: 401 });
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
      const text = await response.text();
      console.error("GitHub GraphQL API error or non-JSON response:", response.status, text.slice(0, 200));
      return NextResponse.json({ error: "Failed to fetch from GitHub API", status: response.status }, { status: response.status || 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GitHub API Proxy Error:", error);
    return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: 500 });
  }
}
