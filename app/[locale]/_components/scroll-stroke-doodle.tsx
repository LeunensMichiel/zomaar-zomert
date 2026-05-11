"use client";

import { cn } from "@lib/utils";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";

const POINTS: readonly (readonly [number, number])[] = [
  [63.2093, 43.0917],
  [137.51, 40.5994],
  [52.1302, 111.359],
  [232.573, 41.2719],
  [46.9445, 163.596],
  [220.386, 74.8238],
  [23.2239, 225.272],
  [425.018, 16.0246],
  [10.2916, 303.448],
  [325.238, 140.553],
  [157.491, 258.867],
  [269.449, 247.26],
];

const SEGMENTS = POINTS.slice(1).map((p, i) => {
  const [x0, y0] = POINTS[i];
  const [x1, y1] = p;
  return {
    d: `M${String(x0)} ${String(y0)}L${String(x1)} ${String(y1)}`,
    length: Math.hypot(x1 - x0, y1 - y0),
  };
});

// Within each segment's scroll slot, the draw happens over this
// fraction; the remainder is the "hold" pause before the next zig.
const DRAW_RATIO = 30 / 80;

type SegmentProps = {
  d: string;
  length: number;
  scrollStart: number;
  scrollEnd: number;
  scrollY: MotionValue<number>;
  reducedMotion: boolean;
};

function Segment({
  d,
  length,
  scrollStart,
  scrollEnd,
  scrollY,
  reducedMotion,
}: SegmentProps) {
  const dashOffset = useTransform(
    scrollY,
    [scrollStart, scrollEnd],
    [length, 0],
    { clamp: true },
  );
  // Safari/Firefox render the round linecap at dash boundaries even
  // when the visible stroke length is 0 — leaving a phantom dot at
  // each segment's start point before its draw window begins.
  // Gating the whole path with opacity hides the cap too.
  const opacity = useTransform(dashOffset, (current) =>
    current >= length - 1 ? 0 : 1,
  );
  return (
    <motion.path
      d={d}
      stroke="url(#scroll-stroke-gradient)"
      strokeWidth="36.1349"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      style={{
        strokeDasharray: length,
        strokeDashoffset: reducedMotion ? 0 : dashOffset,
        opacity: reducedMotion ? 1 : opacity,
      }}
    />
  );
}

type Props = {
  className?: string;
  rotate?: number;
};

export function ScrollStrokeDoodle({ className, rotate = 0 }: Props) {
  const reducedMotion = useReducedMotion();
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const update = () => {
      setVh(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  const { scrollY } = useScroll();

  const perSegment = vh / SEGMENTS.length;
  const drawWindow = perSegment * DRAW_RATIO;

  return (
    <div className={cn(className)}>
      <svg
        viewBox="0 0 435.309 319.496"
        fill="none"
        aria-hidden="true"
        className="h-full w-full"
        style={{ transform: `rotate(${String(rotate)}deg)` }}
      >
        <defs>
          <linearGradient
            id="scroll-stroke-gradient"
            x1="333.494"
            y1="292.474"
            x2="298.472"
            y2="52.2879"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFB600" />
            <stop offset="1" stopColor="#FF7BAC" />
          </linearGradient>
        </defs>
        {SEGMENTS.map((seg, i) => {
          const scrollStart = i * perSegment;
          return (
            <Segment
              key={i}
              d={seg.d}
              length={seg.length}
              scrollStart={scrollStart}
              scrollEnd={scrollStart + drawWindow}
              scrollY={scrollY}
              reducedMotion={reducedMotion ?? false}
            />
          );
        })}
      </svg>
    </div>
  );
}
