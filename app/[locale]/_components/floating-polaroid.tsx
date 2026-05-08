"use client";

import { cn } from "@lib/utils";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { type ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  /** Pre-rendered sticker / caption (server-rendered upstream so
   *  translations can be resolved on the server). */
  caption?: ReactNode;
  /** Base tilt — the float animation oscillates ±0.6° around it. */
  tilt?: number;
  className?: string;
};

/**
 * Tilted festival polaroid with a tape strip and gentle floating
 * animation — reused inside layouts that need a single image card
 * with character (countdown intro right column, etc.). Wraps the
 * Polaroid recipe from Design.md and adds the motion that makes it
 * "breathe".
 */
export function FloatingPolaroid({
  src,
  alt,
  caption,
  tilt = -2,
  className,
}: Props) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={cn("relative", className)}
      animate={
        reducedMotion
          ? undefined
          : {
              y: [0, -8, 0],
              rotate: [tilt, tilt + 0.8, tilt],
            }
      }
      transition={{
        duration: 6,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      <span
        aria-hidden
        className="tape-strip absolute -top-3 left-10 z-30 h-5 w-24 -rotate-12"
      />
      <article className="shadow-sticker-lg relative border-2 border-gray-900 bg-white p-3 pb-10 md:p-4 md:pb-14">
        <div className="relative aspect-4/3 overflow-hidden border-2 border-gray-900">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 80vw, 360px"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="halftone absolute inset-0 opacity-30 mix-blend-multiply"
          />
        </div>
        {caption ? (
          <div className="mt-4 flex items-center justify-center">{caption}</div>
        ) : null}
      </article>
    </motion.div>
  );
}
