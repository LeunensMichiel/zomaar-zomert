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
import { useRef, useState } from "react";

import { type RecapPhoto } from "@/sanity/lib/queries";

type Props = {
  photos: RecapPhoto[];
  albumUrl: string;
  heading: string;
  edition: string;
  cta: string;
};

const COLUMNS = 5;
const PER_COLUMN = 6;
// Travel per column in vh over the full track; different speeds give the depth.
const TRAVEL = [70, 45, 90, 55, 65];

const GROW = 1.25;
const SPRING = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.8,
} as const;

type Hover = { col: number; row: number; dx: number; dy: number };

type ColumnProps = {
  col: number;
  photos: RecapPhoto[];
  albumUrl: string;
  progress: MotionValue<number>;
  travel: number;
  hover: Hover | null;
  onHover: (hover: Hover | null) => void;
};

function Column({
  col,
  photos,
  albumUrl,
  progress,
  travel,
  hover,
  onHover,
}: ColumnProps) {
  const shift = useTransform(progress, [0, 1], [travel, -travel]);
  const y = useMotionTemplate`calc(-50% + ${shift}vh)`;
  const push =
    hover && hover.col !== col ? (col < hover.col ? -hover.dx : hover.dx) : 0;

  return (
    <motion.div
      style={{ y }}
      animate={{ x: push }}
      transition={SPRING}
      className="absolute inset-x-0 top-1/2 flex flex-col gap-[7vw] md:gap-[5vw]"
    >
      {photos.map((photo, row) => {
        const active = hover?.col === col;
        const isHovered = active && hover.row === row;
        const nudge =
          active && !isHovered ? (row < hover.row ? -hover.dy : hover.dy) : 0;
        return (
          <motion.a
            key={`${photo.key}-${String(row)}`}
            href={albumUrl}
            target="_blank"
            rel="noreferrer noopener"
            animate={{ y: nudge }}
            transition={SPRING}
            // Portrait photos get the column width as their height instead,
            // so every photo's longest side is the same length.
            style={{
              width:
                photo.height > photo.width
                  ? `${String((photo.width / photo.height) * 100)}%`
                  : "100%",
            }}
            className={cn("relative mx-auto block", isHovered && "z-10")}
            onPointerEnter={(e) => {
              const { width, height } = e.currentTarget.getBoundingClientRect();
              // Half the growth on each side, plus a little breathing room.
              onHover({
                col,
                row,
                dx: (width * (GROW - 1)) / 2 + 16,
                dy: (height * (GROW - 1)) / 2 + 16,
              });
            }}
            onPointerLeave={() => {
              onHover(null);
            }}
          >
            <motion.div
              animate={{ scale: isHovered ? GROW : 1 }}
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
        );
      })}
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
  const [hover, setHover] = useState<Hover | null>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });

  // Cycle through the photos so every column stays filled during its travel.
  const columns = Array.from({ length: COLUMNS }, (_, c) =>
    Array.from(
      { length: PER_COLUMN },
      (_, r) => photos[(c + r * COLUMNS) % photos.length],
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
                "relative",
                hover?.col === c && "z-20",
                c >= 3 && "hidden md:block",
              )}
            >
              <Column
                col={c}
                photos={col}
                albumUrl={albumUrl}
                progress={scrollYProgress}
                travel={reducedMotion ? 0 : TRAVEL[c]}
                hover={hover}
                onHover={reducedMotion ? () => undefined : setHover}
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
