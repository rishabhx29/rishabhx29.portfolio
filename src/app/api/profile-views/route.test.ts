// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

const ORIGIN = "https://rishabhx29.me";
const ID = "d04d225b-03e7-49dc-868c-ccdd85a45c55";

function visit(id: unknown = ID, origin = ORIGIN) {
  return new Request(`${ORIGIN}/api/profile-views`, {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({ visitorId: id }),
  });
}

beforeEach(() => {
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("/api/profile-views", () => {
  it("never invents a count when the persistent store is unconfigured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    const response = await GET();
    expect(await response.json()).toEqual({ ok: false, count: null });
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("rejects malformed identifiers and cross-origin submissions", async () => {
    expect((await POST(visit("bad"))).status).toBe(400);
    expect((await POST(visit(ID, "https://evil.example"))).status).toBe(403);
    expect((await POST(new Request(`${ORIGIN}/api/profile-views`, { method: "POST" }))).status).toBe(403);
  });

  it("increments only once for the same visitor while returning the shared count", async () => {
    const entries = new Map<string, string>();
    vi.stubGlobal("fetch", vi.fn(async (_url: string, init: RequestInit) => {
      const args = JSON.parse(init.body as string) as (string | number)[];
      const [command, , , countKey, visitorKey, rateKey, , , limit] = args;
      if (command === "GET") return Response.json({ result: entries.get(String(args[1])) ?? null });
      if (command === "EVAL") {
        const count = Number(entries.get(String(countKey)) ?? 0);
        if (entries.has(String(visitorKey))) return Response.json({ result: count });
        const attempts = Number(entries.get(String(rateKey)) ?? 0) + 1;
        entries.set(String(rateKey), String(attempts));
        if (attempts > Number(limit)) return Response.json({ result: count });
        entries.set(String(visitorKey), "1");
        entries.set(String(countKey), String(count + 1));
        return Response.json({ result: count + 1 });
      }
      throw new Error("Unexpected Redis command");
    }));

    expect(await (await GET()).json()).toEqual({ ok: true, count: 0 });
    expect(await (await POST(visit())).json()).toEqual({ ok: true, count: 1 });
    expect(await (await POST(visit())).json()).toEqual({ ok: true, count: 1 });
    expect(await (await POST(visit("00000000-0000-4000-8000-000000000001"))).json()).toEqual({ ok: true, count: 2 });
    expect(await (await GET()).json()).toEqual({ ok: true, count: 2 });
    expect(JSON.stringify([...entries.keys()])).not.toContain(ID);

    // A scripted flood with fresh IDs from one proxy IP cannot inflate views
    // beyond the hourly cap. Duplicate IDs never consume extra quota.
    for (let i = 2; i < 120; i++) {
      await POST(visit(`00000000-0000-4000-8000-${String(i).padStart(12, "0")}`));
    }
    expect(await (await POST(visit("00000000-0000-4000-8000-000000000121"))).json())
      .toEqual({ ok: true, count: 120 });
    expect(await (await GET()).json()).toEqual({ ok: true, count: 120 });
  });

  it("requires Vercel's trusted IP header on deployment", async () => {
    vi.stubEnv("VERCEL", "1");
    expect((await POST(visit())).status).toBe(403);
  });

  it("returns unavailable rather than a fake zero when the store fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    expect(await (await POST(visit())).json()).toEqual({ ok: false, count: null });
  });
});
