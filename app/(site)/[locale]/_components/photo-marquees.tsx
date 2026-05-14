"use client";

import { Marquee } from "@components/marquee";
import { useEffect, useState } from "react";

type Slide = { alt: string; url: string };

type Props = { slides: Slide[] };

/**
 * Twin marquees of festival photos with a randomized client-side
 * shuffle. Used over coloured sections (the marquee has no internal
 * tear SVGs — pair it with `<PaperTear>` if a torn divider is needed).
 */
export function PhotoMarquees({ slides }: Props) {
  const [shuffled, setShuffled] = useState<Slide[]>(slides);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random shuffle is not SSR-safe
    setShuffled(
      [...slides]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value),
    );
  }, [slides]);

  return (
    <div className="relative">
      <Marquee speed={20} direction="left" slides={shuffled.slice(0, 6)} />
      <Marquee speed={10} direction="right" slides={shuffled.slice(-6)} />
    </div>
  );
}
