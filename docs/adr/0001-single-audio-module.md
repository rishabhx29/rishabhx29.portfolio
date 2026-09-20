# ADR-0001: One sound playback module; sound assets served from public/

Date: 2026-09-20
Status: Accepted

## Context

The site accumulated three independent WebAudio implementations (two engine
modules under `src/lib`, plus an inline engine inside the keyboard component),
two copies of sound type definitions, and sound assets embedded as base64
data-URI TypeScript constants split across two directories. Each engine owned
its own AudioContext (browsers cap concurrent contexts), its own decode cache,
and its own resume/cleanup handling. The keyboard additionally carries a sound
sprite whose per-key offset tables are keyboard-domain data.

## Decision

1. All short-sound playback goes through `src/lib/audio.ts`: one AudioContext,
   one URL-keyed decode cache, one playback path, one `useSound` hook.
2. Sound assets live as files in `public/sounds/`, addressed by URL — not as
   base64 data-URI TypeScript constants. Data URIs inline into the JS bundle;
   files are cached by the browser and keep the bundle small.
3. Sprite offset tables (which key plays which slice) stay in the keyboard
   component; the playback machinery behind them is module-owned.
4. Long-form looping music (banner music control) stays on its `<audio>`
   element — a different transport for a different job, not part of this seam
   for now.

## Consequences

- New sounds cost one file in `public/sounds/` and one `playSound` call.
- Audio bugs (resume, cleanup, volume) have exactly one home.
- Adding a test only needs a fake `AudioContext` at the module interface.
- If music streaming ever needs the module, that is a new transport behind the
  same seam — decided then, not before.
