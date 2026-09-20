"use client";

/**
 * Global achievement unlock bus. Any component on the site calls
 * `recordAchievement(id)` to record progress; the playground board re-reads
 * storage when it becomes visible. Unlocking while the board is mounted
 * re-renders immediately via a custom event.
 */

import { useEffect, useState } from "react";
import {
  loadEarnedAchievements,
  saveEarnedAchievements,
  unlockAchievement,
} from "./board-state";

const ACHIEVEMENT_EVENT = "playground:achievements-changed";

/** Fire-and-forget unlock call for any component on the site. */
export function recordAchievement(id: string): void {
  const ids = unlockAchievement(loadEarnedAchievements(), id);
  saveEarnedAchievements(ids);
  window.dispatchEvent(new Event(ACHIEVEMENT_EVENT));
}

export function useEarnedAchievements(): string[] {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setIds(loadEarnedAchievements());
    const prime = window.setTimeout(sync, 0);
    window.addEventListener(ACHIEVEMENT_EVENT, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.clearTimeout(prime);
      window.removeEventListener(ACHIEVEMENT_EVENT, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return ids;
}
