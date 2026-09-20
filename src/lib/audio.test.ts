import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type StartCall = [when: number, offset: number | undefined, duration: number | undefined];

interface FakeSource {
  buffer?: unknown;
  connect: ReturnType<typeof vi.fn>;
  onended: (() => void) | null;
  playbackRate: { value: number };
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
}

function makeFakeContext(state: AudioContextState = "running") {
  const startCalls: StartCall[] = [];
  const sources: FakeSource[] = [];
  const resume = vi.fn(async () => {
    (ctx as unknown as { state: AudioContextState }).state = "running";
  });

  const ctx = {
    state,
    resume,
    destination: {},
    createBufferSource: vi.fn(() => {
      const source: FakeSource = {
        connect: vi.fn(),
        onended: null,
        playbackRate: { value: 1 },
        start: vi.fn((when: number, offset?: number, duration?: number) => {
          startCalls.push([when, offset, duration]);
        }),
        stop: vi.fn(),
      };
      sources.push(source);
      return source;
    }),
    createGain: vi.fn(() => ({
      gain: { value: 1 },
      connect: vi.fn(),
    })),
    decodeAudioData: vi.fn(async () => ({ duration: 1 })),
  };

  return { ctx, startCalls, sources, resume };
}

let loadBuffer: typeof import("./audio").loadBuffer;
let playSound: typeof import("./audio").playSound;
let fake: ReturnType<typeof makeFakeContext>;

beforeEach(async () => {
  vi.resetModules();
  fake = makeFakeContext();
  vi.stubGlobal("AudioContext", vi.fn(() => fake.ctx));
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) })),
  );
  const mod = await import("./audio");
  loadBuffer = mod.loadBuffer;
  playSound = mod.playSound;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("loadBuffer", () => {
  it("fetches and decodes a URL once, then serves repeats from cache", async () => {
    const first = await loadBuffer("/sounds/click-003.mp3");
    const second = await loadBuffer("/sounds/click-003.mp3");

    expect(first).toBe(second);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fake.ctx.decodeAudioData).toHaveBeenCalledTimes(1);
  });

  it("evicts a failed load so a later call can retry", async () => {
    (fetch as ReturnType<typeof vi.fn>)
      .mockImplementationOnce(async () => ({ ok: false, status: 404 }))
      .mockImplementationOnce(async () => ({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      }));

    await expect(loadBuffer("/sounds/missing.mp3")).rejects.toThrow(/404/);
    await expect(loadBuffer("/sounds/missing.mp3")).resolves.toBeDefined();
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe("playSound", () => {
  it("resumes a suspended context before playing", async () => {
    vi.resetModules();
    fake = makeFakeContext("suspended");
    vi.stubGlobal("AudioContext", vi.fn(() => fake.ctx));
    const mod = await import("./audio");

    await mod.playSound("/sounds/click-003.mp3");

    expect(fake.resume).toHaveBeenCalled();
  });

  it("passes sprite offset and duration through to the source", async () => {
    await playSound("/sounds/keyboard.ogg", { offsetMs: 9069, durationMs: 115 });

    expect(fake.startCalls[0]).toEqual([0, 9.069, 0.115]);
  });

  it("plays the whole buffer when no sprite window is given", async () => {
    await playSound("/sounds/click-003.mp3");

    expect(fake.startCalls[0]).toEqual([0, 0, undefined]);
  });

  it("applies volume through the gain node", async () => {
    await playSound("/sounds/click-003.mp3", { volume: 0.5 });

    const gain = fake.ctx.createGain.mock.results[0].value as {
      gain: { value: number };
    };
    expect(gain.gain.value).toBe(0.5);
  });

  it("returns a handle whose stop() stops the source", async () => {
    const handle = await playSound("/sounds/click-003.mp3");

    handle.stop();

    expect(fake.sources[0].stop).toHaveBeenCalled();
  });
});
