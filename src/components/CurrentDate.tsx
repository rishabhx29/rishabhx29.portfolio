"use client";

import { useEffect, useState } from "react";

export function CurrentDate() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDate(new Date()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!date) {
    return (
      <div className="flex flex-col opacity-0">
        <div className="text-[14px] sm:text-[15px] font-medium tracking-tight">Loading</div>
        <div className="text-[9px] font-mono tracking-widest uppercase">00 XXX 0000</div>
      </div>
    );
  }

  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();

  return (
    <div className="flex flex-col">
      <div className="text-[12px] sm:text-[13px] font-medium text-zinc-800 dark:text-zinc-200 tracking-tight">
        {dayName}
      </div>
      <div className="text-[8px] font-mono text-zinc-400 dark:text-zinc-500 tracking-[0.2em] uppercase mt-0.5">
        {day} {month} {year}
      </div>
    </div>
  );
}
