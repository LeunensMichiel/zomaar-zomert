"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: ReactNode;
}

/**
 * Vertical timeline with sticky year markers on the left and an
 * animated trailing line that fills as the user scrolls. Adapted
 * from the Aceternity UI timeline and re-skinned in the festival
 * vocabulary:
 *
 * - Sticky markers are square yellow stickers (2px black border +
 *   `shadow-sticker`), not round circles — square corners are the
 *   ZZ default.
 * - Year titles use `font-display` Oswald in `text-brand-500` for
 *   high contrast on the cream background.
 * - The trailing line is a brand-red → royal-yellow gradient
 *   (loosely echoing the Linear Sunset doodle style).
 *
 * The component renders only the timeline body — the page provides
 * its own hero/heading above it.
 */
export function Timeline({ data }: { data: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="relative w-full font-sans">
      <div ref={ref} className="relative">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-20 md:gap-10 md:pt-48"
          >
            {/* Sticky year marker — chunky square sticker dot + the
                year title in poster-scale Oswald. */}
            <div className="sticky top-32 z-30 flex max-w-xs flex-col items-center self-start md:w-full md:max-w-sm md:flex-row">
              <div
                aria-hidden="true"
                className="shadow-sticker absolute left-3 h-10 w-10 border-2 border-gray-900 bg-yellow-400 md:left-3"
              />
              <h3 className="font-display text-brand-500 hidden text-5xl leading-none font-bold uppercase md:block md:pl-24 md:text-7xl xl:text-8xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pr-4 pl-20 md:pl-4">
              <h3 className="font-display text-brand-500 mb-4 block text-5xl leading-none font-bold uppercase md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        {/* Vertical track + scroll-driven trailing fill. The track
            sits at low opacity in ink; the active fill is a warm
            brand-red → yellow gradient that grows as the user
            scrolls through the section. */}
        <div
          style={{ height: `${String(height)}px` }}
          className="absolute top-0 left-8 w-0.5 overflow-hidden bg-gray-900/15 mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="from-brand-500 absolute inset-x-0 top-0 w-0.5 rounded-full bg-linear-to-t via-yellow-400 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
