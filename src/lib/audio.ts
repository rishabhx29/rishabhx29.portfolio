"use client";

/**
 * Sound playback module — the single seam for everything audio in this app.
 *
 * One AudioContext, one decode cache keyed by URL, one playback path
 * (one-shot clips and sprite slices).
 * Callers learn only: a sound lives at a URL, and play/stop it.
 */

export interface PlaybackHandle {
  stop: () => void;
}

export interface PlaySoundOptions {
  /** Linear gain, 0..1+. Default 1. */
  volume?: number;
  /** Playback rate multiplier. Default 1. */
  playbackRate?: number;
  /** Start offset into the buffer in ms (sprite playback). Default 0. */
  offsetMs?: number;
  /** How much of the buffer to play in ms (sprite playback). Default: whole buffer. */
  durationMs?: number;
  /** Called when playback finishes naturally (not on manual stop). */
  onEnd?: () => void;
}

let audioContext: AudioContext | null = null;
const bufferCache = new Map<string, Promise<AudioBuffer>>();

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

/**
 * Decode a sound URL into an AudioBuffer, cached per URL.
 * A failed load evicts itself so a later call can retry.
 */
export function loadBuffer(url: string): Promise<AudioBuffer> {
  const cached = bufferCache.get(url);
  if (cached) return cached;

  const promise = (async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load sound: ${url} (${response.status})`);
    }
    const data = await response.arrayBuffer();
    return getAudioContext().decodeAudioData(data);
  })();

  promise.catch(() => {
    bufferCache.delete(url);
  });
  bufferCache.set(url, promise);
  return promise;
}

/** Play a decoded-or-fetchable sound. Fire-and-forget; resolves once playing. */
export async function playSound(
  url: string,
  options: PlaySoundOptions = {},
): Promise<PlaybackHandle> {
  const { volume = 1, playbackRate = 1, offsetMs = 0, durationMs, onEnd } = options;

  const context = getAudioContext();
  if (context.state === "suspended") {
    void context.resume();
  }

  const buffer = await loadBuffer(url);

  const source = context.createBufferSource();
  const gain = context.createGain();

  source.buffer = buffer;
  source.playbackRate.value = playbackRate;
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(context.destination);

  source.onended = () => {
    onEnd?.();
  };

  source.start(
    0,
    offsetMs / 1000,
    durationMs !== undefined ? durationMs / 1000 : undefined,
  );

  return {
    stop: () => {
      try {
        source.stop();
      } catch {
        // No-op if already stopped.
      }
    },
  };
}

