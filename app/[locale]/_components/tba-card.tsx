"use client";

import { Sticker } from "@components/sticker";
import { cn } from "@lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

type Tone = "blue" | "brand" | "pink" | "yellow";

type Props = {
  tone: Tone;
  tilt?: number;
  tbaLabel: string;
  /**
   * Text scale for the "TBA / ✦" footer. `md` matches the line-up
   * page's 4-column grid; `lg` matches the home page's 3-column
   * headliner row, where each card is wider so the label can be
   * larger to keep visual weight.
   */
  size?: "md" | "lg";
};

const toneClass: Record<Tone, string> = {
  blue: "bg-blue-500 text-white",
  brand: "bg-brand-500 text-white",
  pink: "bg-pink-300 text-gray-900",
  yellow: "bg-yellow-400 text-gray-900",
};

const labelTextClass: Record<NonNullable<Props["size"]>, string> = {
  md: "text-2xl md:text-3xl xl:text-4xl",
  // `lg` mirrors HeadlinerCard's name scale — no md jump so the TBA
  // card doesn't overshoot the artist cards in the 3-col iPad layout.
  lg: "text-3xl lg:text-5xl xl:text-6xl",
};

const symbolTextClass: Record<NonNullable<Props["size"]>, string> = {
  md: "text-2xl md:text-3xl",
  lg: "text-3xl lg:text-4xl",
};

const labelPadClass: Record<NonNullable<Props["size"]>, string> = {
  md: "px-4 py-3 md:px-5 md:py-4",
  lg: "px-4 py-4 md:px-5",
};

const cardFrame =
  "group relative flex h-full flex-col border-2 border-gray-900 shadow-sticker md:shadow-sticker-lg";

/**
 * Shared TBA placeholder card — used by the home page's
 * `<HeadlinerCard>` and the line-up page's artist grid. Static visual
 * (star-burst doodle + plus accents + "Soon" sticker as the wax seal)
 * with a subtle hover: card scales 1 → 1.015 + 1° rotation nudge,
 * star-burst inside swings -12° → 8°. Distinct from the artist cards'
 * lift — signals "stirs but not clickable".
 */
export function TBACard({ tone, tilt = 0, tbaLabel, size = "md" }: Props) {
  return (
    <motion.div
      className={cn(cardFrame, toneClass[tone])}
      initial={{ rotate: tilt, scale: 1 }}
      whileHover={{ rotate: tilt + 1, scale: 1.015 }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
    >
      <CardBack label={tbaLabel} />
      <div
        className={cn(
          "flex flex-1 items-center justify-between gap-2",
          labelPadClass[size],
        )}
      >
        <span
          className={cn(
            "font-display block leading-[0.9] font-bold uppercase",
            labelTextClass[size],
          )}
        >
          TBA
        </span>
        <span
          aria-hidden="true"
          className={cn("font-display leading-none", symbolTextClass[size])}
        >
          ✦
        </span>
      </div>
    </motion.div>
  );
}

function CardBack({ label }: { label: string }) {
  return (
    <div className='relative aspect-4/5 overflow-hidden border-b-2 border-gray-900 before:absolute before:inset-0 before:z-10 before:opacity-50 before:content-[""]'>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/assets/doodles/star-burst.svg"
          alt=""
          width={400}
          height={400}
          aria-hidden="true"
          className="h-[85%] w-auto -rotate-12 transition-transform duration-700 ease-out group-hover:rotate-[8deg]"
        />
      </div>
      <PlusMark className="absolute top-3 left-3 z-20" />
      <PlusMark className="absolute top-3 right-3 z-20" />
      <PlusMark className="absolute bottom-3 left-3 z-20" />
      <PlusMark className="absolute right-3 bottom-3 z-20" />
      <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <Sticker color="brand" size="md" rotate={-8}>
          {label}
        </Sticker>
      </div>
    </div>
  );
}

function PlusMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn("h-5 w-5 text-gray-900 md:h-6 md:w-6", className)}
    >
      <path
        d="M50 8 V92 M8 50 H92"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="square"
      />
    </svg>
  );
}
