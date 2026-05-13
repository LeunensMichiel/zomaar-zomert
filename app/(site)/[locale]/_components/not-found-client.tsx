"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";

type Props = {
  centerDoodle: ReactNode;
  orbitDoodles: ReactNode[];
};

const ORBIT_POSITIONS = [
  { top: "8%", left: "12%", drift: { x: [-12, 14, -12], y: [-10, 8, -10] } },
  { top: "14%", right: "10%", drift: { x: [10, -16, 10], y: [-8, 12, -8] } },
  { top: "62%", left: "6%", drift: { x: [-14, 10, -14], y: [10, -10, 10] } },
  { top: "68%", right: "8%", drift: { x: [12, -12, 12], y: [8, -14, 8] } },
  { top: "38%", left: "2%", drift: { x: [-8, 12, -8], y: [-6, 10, -6] } },
  { top: "44%", right: "2%", drift: { x: [10, -10, 10], y: [12, -8, 12] } },
] as const;

export function NotFoundClient({ centerDoodle, orbitDoodles }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto h-72 w-full max-w-2xl overflow-hidden md:h-96">
      {orbitDoodles.map((doodle, i) => {
        const pos = ORBIT_POSITIONS[i % ORBIT_POSITIONS.length];
        const duration = 5.5 + (i % 3) * 1.2;
        const rotate = i % 2 === 0 ? [-12, 14, -12] : [16, -12, 16];
        return (
          <motion.div
            key={i}
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: pos.top,
              left: "left" in pos ? pos.left : undefined,
              right: "right" in pos ? pos.right : undefined,
            }}
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={
              reducedMotion
                ? { x: 0, y: 0, rotate: 0 }
                : {
                    x: [...pos.drift.x],
                    y: [...pos.drift.y],
                    rotate,
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.25,
                  }
            }
          >
            {doodle}
          </motion.div>
        );
      })}

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ x: 0, rotate: 0 }}
        animate={
          reducedMotion
            ? { x: 0, rotate: 0 }
            : {
                x: [-40, 40, -40],
                rotate: [-6, 6, -6],
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <motion.div
          animate={
            reducedMotion
              ? { y: 0 }
              : {
                  y: [0, -10, 0, -6, 0],
                }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          {centerDoodle}
        </motion.div>
      </motion.div>
    </div>
  );
}
