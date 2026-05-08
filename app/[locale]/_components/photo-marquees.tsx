"use client";

import { Marquee } from "@components/marquee";
import { useEffect, useState } from "react";

type Slide = { alt: string; url: string };

const baseSlides: Slide[] = Array.from({ length: 30 }, (_, i) => ({
  alt: `carousel image ${String(i + 1)}`,
  url: `/assets/slides/slide${String(i + 1)}.webp`,
}));

/**
 * Twin marquees of festival photos with a randomized client-side
 * shuffle. Used over coloured sections (the marquee has no internal
 * tear SVGs — pair it with `<PaperTear>` if a torn divider is needed).
 */
export function PhotoMarquees() {
  const [shuffled, setShuffled] = useState<Slide[]>(baseSlides);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random shuffle is not SSR-safe
    setShuffled(
      [...baseSlides]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value),
    );
  }, []);

  return (
    <div className="relative">
      <Marquee speed={20} direction="left" slides={shuffled.slice(0, 6)} />
      <Marquee speed={10} direction="right" slides={shuffled.slice(-6)} />
    </div>
  );
}
