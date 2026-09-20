import {
  DEFAULT_WORKBENCH_OBJECTS,
  type WorkbenchObject,
  type WorkbenchObjectType,
} from "@/data/playgroundAssets";

/** ---------------------------------------------------------------------------
 * Board persistence — the whole board (objects + strokes + camera) survives
 * reloads via localStorage. All parsing is defensive: any malformed stored
 * state returns null and the caller falls back to the authored defaults.
 * ------------------------------------------------------------------------- */

export const BOARD_STORAGE_KEY = "playground.board.v1";
export const ACHIEVEMENTS_STORAGE_KEY = "playground.achievements.v1";

export interface BoardCamera {
  x: number;
  y: number;
  zoom: number;
}

export interface BoardStroke {
  id: string;
  points: { x: number; y: number }[];
  color?: string;
  width?: number;
}

export interface BoardState {
  objects: WorkbenchObject[];
  strokes: BoardStroke[];
  camera: BoardCamera;
}

const VALID_TYPES: readonly WorkbenchObjectType[] = [
  "photo",
  "project",
  "achievement",
  "note",
  "label",
  "link",
  "clock",
  "music",
];

function isPoint(value: unknown): value is { x: number; y: number } {
  if (typeof value !== "object" || value === null) return false;
  const point = value as { x?: unknown; y?: unknown };
  return (
    typeof point.x === "number" && Number.isFinite(point.x) &&
    typeof point.y === "number" && Number.isFinite(point.y)
  );
}

function isWorkbenchObject(value: unknown): value is WorkbenchObject {
  if (typeof value !== "object" || value === null) return false;
  const object = value as Record<string, unknown>;
  return (
    typeof object.id === "string" && object.id.length > 0 &&
    typeof object.title === "string" &&
    typeof object.type === "string" && VALID_TYPES.includes(object.type as WorkbenchObjectType) &&
    typeof object.width === "number" && Number.isFinite(object.width) &&
    typeof object.height === "number" && Number.isFinite(object.height) &&
    isPoint(object)
  );
}


export function serializeBoardState(state: BoardState): string {
  return JSON.stringify(state);
}

function isBoardVariant(value: unknown): value is NonNullable<WorkbenchObject["variant"]> {
  return (
    value === "paper" || value === "polaroid" || value === "stamp" || value === "dark"
  );
}

/** Parse the strokes array, or return null if any entry is malformed. */
function parseStrokes(value: unknown): BoardStroke[] | null {
  if (!Array.isArray(value)) return null;
  const strokes: BoardStroke[] = [];
  for (const stroke of value) {
    if (typeof stroke !== "object" || stroke === null) return null;
    const candidate = stroke as Record<string, unknown>;
    if (!Array.isArray(candidate.points) || !candidate.points.every(isPoint)) return null;
    strokes.push({
      id: typeof candidate.id === "string" ? candidate.id : `stroke-${strokes.length}`,
      points: candidate.points,
      color: typeof candidate.color === "string" ? candidate.color : undefined,
      width: typeof candidate.width === "number" ? candidate.width : undefined,
    });
  }
  return strokes;
}

export function parseBoardState(raw: string): BoardState | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;
    const candidate = data as Record<string, unknown>;
    if (!Array.isArray(candidate.objects) || !candidate.objects.every(isWorkbenchObject)) return null;
    if (typeof candidate.camera !== "object" || candidate.camera === null) return null;
    const camera = candidate.camera as Record<string, unknown>;
    if (typeof camera.x !== "number" || typeof camera.y !== "number" || typeof camera.zoom !== "number") return null;
    const strokes = parseStrokes(candidate.strokes);
    if (!strokes) return null;
    return {
      objects: candidate.objects,
      strokes,
      camera: { x: camera.x, y: camera.y, zoom: camera.zoom },
    };
  } catch {
    return null;
  }
}

export function loadBoardState(): BoardState | null {
  try {
    const raw = window.localStorage.getItem(BOARD_STORAGE_KEY);
    return raw ? parseBoardState(raw) : null;
  } catch {
    return null;
  }
}

export function saveBoardState(state: BoardState): void {
  try {
    window.localStorage.setItem(BOARD_STORAGE_KEY, serializeBoardState(state));
  } catch {
    // Storage full or unavailable — the board just won't persist.
  }
}

export function clearBoardState(): void {
  try {
    window.localStorage.removeItem(BOARD_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

/** ---------------------------------------------------------------------------
 * Share URLs — board (objects + camera, no drawings, no stamps) compressed
 * into a `b` query parameter. Opening a shared URL seeds the visitor's own
 * board: non-removable anchors re-sync to the authored defaults so the board
 * can never lose its landmarks, everything else copies verbatim.
 * ------------------------------------------------------------------------- */

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array | null {
  try {
    const normalized = text.replaceAll("-", "+").replaceAll("_", "/");
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  } catch {
    return null;
  }
}

async function deflate(text: string): Promise<Uint8Array> {
  const stream = new Response(text).body!.pipeThrough(new CompressionStream("deflate-raw"));
  return new Response(stream).arrayBuffer().then((buffer) => new Uint8Array(buffer));
}

async function inflate(bytes: Uint8Array): Promise<string> {
  const stream = new Response(bytes as BlobPart).body!.pipeThrough(new DecompressionStream("deflate-raw"));
  return new Response(stream).text();
}

/** Encode objects + camera into a URL-safe share string. */
export async function encodeShareState(objects: WorkbenchObject[], camera: BoardCamera): Promise<string> {
  const payload = JSON.stringify({
    o: objects.map((object) => ({
      i: object.id,
      t: object.type,
      ti: object.title,
      s: object.subtitle,
      c: object.content,
      src: object.src,
      h: object.href,
      x: Math.round(object.x),
      y: Math.round(object.y),
      w: Math.round(object.width),
      hh: Math.round(object.height),
      r: object.rotation,
      v: object.variant,
      rm: object.removable ? 1 : undefined,
    })),
    cam: { x: Math.round(camera.x), y: Math.round(camera.y), z: Math.round(camera.zoom * 1000) / 1000 },
  });
  return toBase64Url(await deflate(payload));
}

interface ShareEntry {
  i?: unknown;
  t?: unknown;
  ti?: unknown;
  s?: unknown;
  c?: unknown;
  src?: unknown;
  h?: unknown;
  x?: unknown;
  y?: unknown;
  w?: unknown;
  hh?: unknown;
  r?: unknown;
  v?: unknown;
  rm?: unknown;
}

function entryToObject(entry: ShareEntry): WorkbenchObject | null {
  if (
    typeof entry.i !== "string" || entry.i.length === 0 || typeof entry.ti !== "string" ||
    typeof entry.t !== "string" || !VALID_TYPES.includes(entry.t as WorkbenchObjectType) ||
    typeof entry.x !== "number" || typeof entry.y !== "number" ||
    typeof entry.w !== "number" || typeof entry.hh !== "number"
  ) return null;
  return {
    id: entry.i,
    type: entry.t as WorkbenchObjectType,
    title: entry.ti,
    subtitle: typeof entry.s === "string" ? entry.s : undefined,
    content: typeof entry.c === "string" ? entry.c : undefined,
    src: typeof entry.src === "string" ? entry.src : undefined,
    href: typeof entry.h === "string" ? entry.h : undefined,
    x: entry.x,
    y: entry.y,
    width: entry.w,
    height: entry.hh,
    rotation: typeof entry.r === "number" ? entry.r : undefined,
    variant: isBoardVariant(entry.v) ? entry.v : undefined,
    removable: entry.rm === 1,
  };
}

/** Decode a share string back into objects + camera, or null if invalid. */
export async function decodeShareState(
  encoded: string,
): Promise<{ objects: WorkbenchObject[]; camera: BoardCamera } | null> {
  try {
    const bytes = fromBase64Url(encoded);
    if (!bytes) return null;
    const data: unknown = JSON.parse(await inflate(bytes));
    if (typeof data !== "object" || data === null) return null;
    const candidate = data as { o?: unknown; cam?: Record<string, unknown> };
    if (!Array.isArray(candidate.o)) return null;
    const objects = candidate.o.map((entry) => entryToObject(entry as ShareEntry));
    if (objects.some((object) => object === null)) return null;
    const camera = candidate.cam ?? {};
    return {
      objects: objects as WorkbenchObject[],
      camera: {
        x: typeof camera.x === "number" ? camera.x : 160,
        y: typeof camera.y === "number" ? camera.y : 116,
        zoom: typeof camera.z === "number" ? Math.min(1.35, Math.max(0.05, camera.z)) : 0.8,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Merge a shared board with the authored defaults: non-removable anchor
 * objects (the landmarks) always come from the local defaults so a shared
 * board can never remove or spoof them; removable objects copy verbatim.
 */
export function mergeSharedObjects(shared: WorkbenchObject[]): WorkbenchObject[] {
  const anchors = new Map(DEFAULT_WORKBENCH_OBJECTS.filter((object) => !object.removable).map((object) => [object.id, object]));
  const extras = shared.filter((object) => object.removable || !anchors.has(object.id));
  const keptAnchors = shared.filter((object) => !object.removable && anchors.has(object.id)).map((object) => anchors.get(object.id)!);
  const seen = new Set(keptAnchors.map((object) => object.id));
  const missing = DEFAULT_WORKBENCH_OBJECTS.filter((object) => !object.removable && !seen.has(object.id));
  return [...keptAnchors, ...missing, ...extras];
}

/** ---------------------------------------------------------------------------
 * Achievements — stamps earned by interacting with the site. Stored globally
 * (not per-board) in localStorage; the board renders earned stamps and ghost
 * placeholders for the rest.
 * ------------------------------------------------------------------------- */

export interface Achievement {
  id: string;
  title: string;
  hint: string;
}

export const ACHIEVEMENTS: readonly Achievement[] = [
  { id: "first-steps", title: "First Steps", hint: "Visit the field notebook" },
  { id: "world-tour", title: "World Tour", hint: "Visit every page of the site" },
  { id: "secret-handshake", title: "Secret Handshake", hint: "Try an old cheat code" },
  { id: "night-owl", title: "Night Owl", hint: "Flip the lights off" },
  { id: "commander", title: "Commander", hint: "Open the command palette" },
  { id: "pen-pal", title: "Pen Pal", hint: "Send a message my way" },
  { id: "sweet-sixteen", title: "Sweet Sixteen", hint: "Play 16 keys on the contact keyboard" },
];

export function loadEarnedAchievements(): string[] {
  try {
    const raw = window.localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = new Set(ACHIEVEMENTS.map((achievement) => achievement.id));
    return parsed.filter((id): id is string => typeof id === "string" && valid.has(id));
  } catch {
    return [];
  }
}

export function saveEarnedAchievements(ids: string[]): void {
  try {
    window.localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore.
  }
}

/** Pure unlock: adds an id if missing, returns the next list. */
export function unlockAchievement(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids : [...ids, id];
}
