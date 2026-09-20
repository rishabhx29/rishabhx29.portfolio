import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ACHIEVEMENTS,
  clearBoardState,
  encodeShareState,
  decodeShareState,
  loadBoardState,
  mergeSharedObjects,
  parseBoardState,
  saveBoardState,
  serializeBoardState,
  unlockAchievement,
} from "./board-state";
import { DEFAULT_WORKBENCH_OBJECTS, type WorkbenchObject } from "@/data/playgroundAssets";

function makeObject(overrides: Partial<WorkbenchObject> = {}): WorkbenchObject {
  return {
    id: "obj-1",
    type: "note",
    title: "A note",
    x: 10,
    y: 20,
    width: 200,
    height: 150,
    ...overrides,
  };
}

describe("board state persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("round-trips a board state through serialize/parse", () => {
    const state = {
      objects: [makeObject(), makeObject({ id: "obj-2", type: "clock", title: "Clock" })],
      strokes: [{ id: "s1", points: [{ x: 1, y: 2 }], color: "#0891b2", width: 3 }],
      camera: { x: 100, y: 50, zoom: 0.8 },
    };
    const parsed = parseBoardState(serializeBoardState(state));
    expect(parsed).toEqual(state);
  });

  it("rejects malformed JSON", () => {
    expect(parseBoardState("{not json")).toBeNull();
  });

  it("rejects objects missing required fields", () => {
    const bad = JSON.stringify({
      objects: [{ id: "x", title: "no position" }],
      strokes: [],
      camera: { x: 0, y: 0, zoom: 1 },
    });
    expect(parseBoardState(bad)).toBeNull();
  });

  it("rejects non-finite positions", () => {
    const bad = JSON.stringify({
      objects: [makeObject({ x: Number.NaN })],
      strokes: [],
      camera: { x: 0, y: 0, zoom: 1 },
    });
    expect(parseBoardState(bad)).toBeNull();
  });

  it("saves, loads, and clears through localStorage", () => {
    const state = {
      objects: [makeObject()],
      strokes: [],
      camera: { x: 1, y: 2, zoom: 0.9 },
    };
    saveBoardState(state);
    expect(loadBoardState()).toEqual(state);
    clearBoardState();
    expect(loadBoardState()).toBeNull();
  });
});

describe("share codec", () => {
  it("round-trips objects and camera through encode/decode", async () => {
    const objects = [
      makeObject({ removable: true, rotation: -3, variant: "polaroid", subtitle: "sub", href: "https://example.com" }),
      makeObject({ id: "obj-2", type: "link", title: "GitHub", href: "https://github.com/rishabhx29" }),
    ];
    const encoded = await encodeShareState(objects, { x: 120, y: 80, zoom: 0.75 });
    // URL-safe base64: no +, /, or = characters.
    expect(encoded).not.toMatch(/[+/=]/);
    const decoded = await decodeShareState(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded!.camera).toEqual({ x: 120, y: 80, zoom: 0.75 });
    expect(decoded!.objects).toHaveLength(2);
    expect(decoded!.objects[0]).toMatchObject({ id: "obj-1", title: "A note", rotation: -3, variant: "polaroid", removable: true });
    expect(decoded!.objects[1]).toMatchObject({ type: "link", href: "https://github.com/rishabhx29" });
  });

  it("returns null for garbage input", async () => {
    expect(await decodeShareState("not-a-valid-string!!")).toBeNull();
  });

  it("drops entries with missing required fields", async () => {
    const encoded = await encodeShareState([makeObject({ id: "" })], { x: 0, y: 0, zoom: 1 });
    expect(await decodeShareState(encoded)).toBeNull();
  });
});

describe("mergeSharedObjects", () => {
  it("re-syncs anchor objects to authored defaults", () => {
    const anchorId = DEFAULT_WORKBENCH_OBJECTS.find((object) => !object.removable)!.id;
    const tampered = makeObject({ id: anchorId, title: "Hacked title", x: -9999 });
    const merged = mergeSharedObjects([tampered]);
    const restored = merged.find((object) => object.id === anchorId)!;
    expect(restored.title).not.toBe("Hacked title");
    expect(DEFAULT_WORKBENCH_OBJECTS.some((object) => object.id === anchorId && object.title === restored.title)).toBe(true);
  });

  it("keeps every authored anchor even if the share omits them", () => {
    const anchors = DEFAULT_WORKBENCH_OBJECTS.filter((object) => !object.removable);
    const merged = mergeSharedObjects([makeObject({ removable: true })]);
    for (const anchor of anchors) {
      expect(merged.some((object) => object.id === anchor.id)).toBe(true);
    }
  });

  it("copies removable objects verbatim", () => {
    const extra = makeObject({ id: "extra-1", removable: true, title: "Guest note" });
    const merged = mergeSharedObjects([extra]);
    expect(merged.find((object) => object.id === "extra-1")?.title).toBe("Guest note");
  });
});

describe("achievements", () => {
  it("has exactly the seven designed achievements", () => {
    expect(ACHIEVEMENTS.map((achievement) => achievement.id)).toEqual([
      "first-steps",
      "world-tour",
      "secret-handshake",
      "night-owl",
      "commander",
      "pen-pal",
      "sweet-sixteen",
    ]);
  });

  it("unlockAchievement appends only new ids", () => {
    expect(unlockAchievement([], "night-owl")).toEqual(["night-owl"]);
    expect(unlockAchievement(["night-owl"], "night-owl")).toEqual(["night-owl"]);
    expect(unlockAchievement(["night-owl"], "commander")).toEqual(["night-owl", "commander"]);
  });
});
