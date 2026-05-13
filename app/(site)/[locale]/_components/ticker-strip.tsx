"use client";

import { cn } from "@lib/utils";
import FastMarquee from "react-fast-marquee";

type Props = {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  /** Tailwind classes for background, text, etc. */
  className?: string;
  /** Tailwind classes for each item. */
  itemClassName?: string;
  /** Optional bullet between items. */
  separator?: string;
};

/**
 * Rolling ribbon of all-caps text — Pukkelpop-style "FREE ENTRY · 3 DAGEN · ★".
 * Uses the existing react-fast-marquee dependency.
 */
export function TickerStrip({
  items,
  speed = 60,
  direction = "left",
  className,
  itemClassName,
  separator = "✦",
}: Props) {
  const repeated = [...items, ...items, ...items];
  return (
    <div
      className={cn(
        "font-display relative overflow-clip leading-none font-bold uppercase select-none",
        // Fixed height + descendant overflow override kills the y-scrollbar
        // FastMarquee otherwise produces when its child line-boxes are
        // taller than the container.
        "flex h-12 items-center md:h-14 xl:h-16",
        "**:overflow-y-clip",
        className,
      )}
    >
      <FastMarquee speed={speed} direction={direction} gradient={false}>
        {repeated.map((item, i) => (
          <span
            key={`${String(i)}-${item}`}
            className={cn(
              "inline-flex items-center text-xl tracking-tight md:text-2xl xl:text-3xl",
              itemClassName,
            )}
          >
            <span>{item}</span>
            <span aria-hidden="true" className="mx-4 md:mx-6">
              {separator}
            </span>
          </span>
        ))}
      </FastMarquee>
    </div>
  );
}
