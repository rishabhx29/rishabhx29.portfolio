# CONTEXT

Domain glossary for rishabhx29.portfolio. Terms here are the ones skills should
use when naming concepts in issues, refactors, and hypotheses.

## Sound playback

The single module (`src/lib/audio.ts`) through which every short sound in the
site is played: UI clicks, easter-egg clips, and the keyboard's per-key sprite
slices. "Sound playback" covers one-shot clips and sprite slices; long-form
looping music played through `<audio>` (the banner music control) is a separate
concern and is not part of this module's interface.

Terms:

- **Clip**: a sound asset served from `public/sounds/` and addressed by URL.
- **Sprite slice**: an offset/duration window into a clip (the keyboard's
  per-key sounds are slices of one `sound.ogg` sprite).

## GitHub data

The module (`src/lib/github.ts`) through which every GitHub-backed section
gets its data. Owns query text, transport guarding, and the fallback contract:
functions resolve with typed data or `null` — `null` means offline/unconfigured
and callers render their cached state. The `/api/github` route is only a thin
token adapter.

## Command

One entry in the command registry (`src/components/command-menu.tsx`): a label,
an optional global `shift+<key>` hotkey, and a run action. The palette and the
hotkey handler are two views over the same table; a new command is added once.

## Blueprint grid

The site's shared visual motif (`src/components/BlueprintGrid.tsx`): dashed
vertical rails at 30% plus dashed horizontal rules with tiny intersection
nodes. Pages pass the horizontal positions; the masks and styling live here.
