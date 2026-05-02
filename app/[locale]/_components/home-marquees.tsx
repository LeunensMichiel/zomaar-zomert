"use client";

import { Marquee } from "@components/marquee";
import { useEffect, useState } from "react";

type Slide = { alt: string; url: string };

const baseSlides: Slide[] = Array.from({ length: 30 }, (_, i) => ({
  alt: `carousel image ${i + 1}`,
  url: `/assets/slides/slide${i + 1}.webp`,
}));

export function HomeMarquees() {
  const [shuffledSlides, setShuffledSlides] = useState<Slide[]>(baseSlides);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random shuffle is not SSR-safe
    setShuffledSlides(
      [...baseSlides]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value),
    );
  }, []);

  return (
    <section className="relative mb-8">
      <img
        className="absolute -top-1 left-0 z-10 w-full object-cover"
        src="/assets/tear-3.svg"
        alt=""
        aria-hidden="true"
      />
      <Marquee
        speed={20}
        direction="left"
        slides={shuffledSlides.slice(0, 6)}
      />
      <Marquee speed={10} direction="right" slides={shuffledSlides.slice(-6)} />
      <img
        className="absolute -bottom-1 left-0 z-10 w-full object-cover"
        src="/assets/tear-4.svg"
        alt=""
        aria-hidden="true"
      />
    </section>
  );
}
