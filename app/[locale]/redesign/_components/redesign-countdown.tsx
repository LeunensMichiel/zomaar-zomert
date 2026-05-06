"use client";

import { ZZ_DATE_FRIDAY, ZZ_DATE_MONDAY } from "@lib/models";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const TARGET = new Date(`${ZZ_DATE_FRIDAY} 16:00:00`).getTime();
const LAST_DAY = new Date(ZZ_DATE_MONDAY).getTime();

function compute(diff: number): [number, number, number, number] {
  if (diff <= 0) return [0, 0, 0, 0];
  return [
    Math.floor(diff / 86_400_000),
    Math.floor((diff % 86_400_000) / 3_600_000),
    Math.floor((diff % 3_600_000) / 60_000),
    Math.floor((diff % 60_000) / 1_000),
  ];
}

/**
 * Festival countdown rendered as a four-segment clock — a redesign-local
 * replacement for the production `<Countdown />`. Differences:
 *   - All four cells share the same color (the production version
 *     highlights seconds in `brand-500`, which disappears on this
 *     panel's `bg-brand-500`).
 *   - Forced `grid-cols-4` so the cells never wrap to a second row.
 *   - Inherits text color from its parent so the panel can re-skin it.
 */
export function RedesignCountdown() {
  const t = useTranslations("home");
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- avoid 1s delay before first tick; Date.now() is not SSR-safe
    setDiff(TARGET - Date.now());
    const id = setInterval(() => {
      setDiff(TARGET - Date.now());
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const ended = diff !== null && diff <= 0;
  if (ended) {
    return (
      <p className="font-display text-3xl leading-tight font-bold uppercase md:text-4xl">
        {Date.now() >= LAST_DAY
          ? "See you next year!"
          : t("festivalHasStarted")}
      </p>
    );
  }

  const [d, h, m, s] = compute(diff ?? 0);
  const cells = [
    { value: d, unit: t("days") },
    { value: h, unit: t("hours") },
    { value: m, unit: t("minutes") },
    { value: s, unit: t("seconds") },
  ];

  return (
    <div className="grid grid-cols-4 items-end gap-2 md:gap-4">
      {cells.map((c) => (
        <div key={c.unit} className="flex flex-col items-center">
          <span className="font-display text-4xl leading-none font-bold tabular-nums md:text-6xl xl:text-7xl">
            {String(c.value).padStart(2, "0")}
          </span>
          <span className="font-display mt-2 text-[10px] leading-none font-bold tracking-widest uppercase opacity-80 md:text-xs">
            {c.unit}
          </span>
        </div>
      ))}
    </div>
  );
}
