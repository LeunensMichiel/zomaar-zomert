"use client";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { ExternalLink } from "lucide-react";
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { type RecapPhoto } from "@/sanity/lib/queries";

type Props = {
  photos: RecapPhoto[];
  albumUrl: string;
  heading: string;
  edition: string;
  cta: string;
};

const COLUMNS = 5;
// Enough rows that a column still covers the frame at its furthest travel,
// even on tall phone and tablet screens.
const PER_COLUMN = 20;
// Travel per column in vh over the full track; different speeds give the depth.
const TRAVEL = [40, 25, 50, 30, 35];

const GROW = 1.25;
const SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.8,
} as const;

type ColumnProps = {
  photos: RecapPhoto[];
  albumUrl: string;
  progress: MotionValue<number>;
  travel: number;
  hoverable: boolean;
};

function Column({
  photos,
  albumUrl,
  progress,
  travel,
  hoverable,
}: ColumnProps) {
  const shift = useTransform(progress, [0, 1], [travel, -travel]);
  const y = useMotionTemplate`calc(-50% + ${shift}vh)`;

  return (
    <motion.div
      style={{ y }}
      className="absolute inset-x-0 top-1/2 flex flex-col gap-[7vw] md:gap-[5vw]"
    >
      {photos.map((photo, row) => (
        <motion.a
          key={`${photo.key}-${String(row)}`}
          href={albumUrl}
          target="_blank"
          rel="noreferrer noopener"
          initial="rest"
          animate="rest"
          whileHover={hoverable ? "hover" : undefined}
          // Portrait photos get the column width as their height instead,
          // so every photo's longest side is the same length.
          style={{
            width:
              photo.height > photo.width
                ? `${String((photo.width / photo.height) * 100)}%`
                : "100%",
          }}
          className="relative mx-auto block hover:z-10"
        >
          {/* Only the unscaled link takes the pointer, so the hover ends as
              soon as the cursor leaves the photo's original bounds. */}
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: GROW } }}
            transition={SPRING}
            className="pointer-events-none bg-gray-100"
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 768px) 32vw, 14vw"
              placeholder={photo.lqip ? "blur" : "empty"}
              blurDataURL={photo.lqip ?? undefined}
              className="h-auto w-full"
            />
          </motion.div>
        </motion.a>
      ))}
    </motion.div>
  );
}

export function RecapGallery({
  photos,
  albumUrl,
  heading,
  edition,
  cta,
}: Props) {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });

  // Steps of 7 and 11 spread repeats apart, so the same photo rarely shows
  // twice in one column or side by side.
  const columns = Array.from({ length: COLUMNS }, (_, c) =>
    Array.from(
      { length: PER_COLUMN },
      (_, r) => photos[(c * 11 + r * 7) % photos.length],
    ),
  );

  return (
    <div
      ref={trackRef}
      className={cn("relative", reducedMotion ? "h-screen" : "h-[300vh]")}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 text-center">
          <span className="text-xl text-gray-900 md:text-3xl">{heading}</span>
          <span className="font-display text-[clamp(2.25rem,7.5vw,9rem)] leading-none font-bold whitespace-nowrap text-gray-900 uppercase">
            {edition}
          </span>
        </div>

        <div className="relative z-10 -mx-[5vw] grid h-full grid-cols-3 gap-x-[10vw] md:grid-cols-5">
          {columns.map((col, c) => (
            <div
              key={c}
              className={cn(
                "relative has-[a:hover]:z-10",
                c >= 3 && "hidden md:block",
              )}
            >
              <Column
                photos={col}
                albumUrl={albumUrl}
                progress={scrollYProgress}
                travel={reducedMotion ? 0 : TRAVEL[c]}
                hoverable={!reducedMotion}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-[max(2rem,6vw)] z-20 flex justify-center md:bottom-[max(3rem,7vw)]">
          <Button
            as="a"
            href={albumUrl}
            target="_blank"
            rel="noreferrer noopener"
            variant="accent"
            size="xl"
            sticker
            iconRight={<ExternalLink />}
          >
            {cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
