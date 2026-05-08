"use client";

import { Sticker } from "@components/sticker";
import { ZZ_DATE_FRIDAY, ZZ_DATE_MONDAY } from "@lib/models";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const TARGET = new Date(`${ZZ_DATE_FRIDAY} 16:00:00`).getTime();
const LAST_DAY = new Date(ZZ_DATE_MONDAY).getTime();

function compute(diff: number): [number, number, number, number] {
  if (diff <= 0) return [0, 0, 0, 0];
  return [
    Math.floor(diff / 86_400_000),
    Math.floor((diff % 86_400_000) / 3_600_000),
    Math.floor((diff % 3_600_000) / 60_000),
    Math.floor((diff % 60_000) / 1_000),
  ];
}

const DIGIT_TRANSITION = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const };

/**
 * Single LED-style digit cell. Vertically rolls in the new digit when
 * its key changes — old digit slides up out of view, new one slides
 * in from below. Honours reduced motion by replacing the animation
 * with a plain static digit.
 */
function DigitCell({
  digit,
  reducedMotion,
}: {
  digit: string;
  reducedMotion: boolean | null;
}) {
  return (
    <div className="font-display shadow-sticker relative grid h-14 w-10 place-items-center overflow-hidden border-2 border-gray-900 bg-gray-900 text-yellow-400 md:h-20 md:w-14 xl:h-24 xl:w-16">
      {reducedMotion ? (
        <span className="text-3xl font-bold tabular-nums md:text-5xl xl:text-6xl">
          {digit}
        </span>
      ) : (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={digit}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={DIGIT_TRANSITION}
            // `inset-0` makes the span the same size as the cell so
            // y: ±100% translates by the full cell height — without it
            // the span only matches the text glyph height and the
            // outgoing digit briefly flickers at the top edge.
            className="absolute inset-0 grid place-items-center text-3xl font-bold tabular-nums md:text-5xl xl:text-6xl"
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}

/** Pair of digit cells fed by a 0–99 value, plus a small unit label. */
function DigitPair({
  value,
  label,
  reducedMotion,
}: {
  value: number;
  label: string;
  reducedMotion: boolean | null;
}) {
  const [tens, ones] = String(value).padStart(2, "0").split("");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1.5 md:gap-2">
        <DigitCell digit={tens} reducedMotion={reducedMotion} />
        <DigitCell digit={ones} reducedMotion={reducedMotion} />
      </div>
      <span className="font-display text-[10px] font-bold tracking-[0.3em] text-gray-700 uppercase md:text-xs">
        {label}
      </span>
    </div>
  );
}

/** Pulsing red colon that ticks once per second. */
function Colon({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <motion.span
      aria-hidden
      className="font-display text-brand-500 flex h-14 items-center text-3xl font-bold md:h-20 md:text-5xl xl:h-24 xl:text-6xl"
      animate={reducedMotion ? undefined : { opacity: [1, 0.25, 1] }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      :
    </motion.span>
  );
}

/**
 * Days-as-headline countdown. The day count is the giant poster word
 * (replacing the previous static "ZOMAAR." stamp), paired with a
 * chunky-block "DAGEN." stamp at opposite tilt. Below sits a live
 * HH:MM:SS clock where each digit rolls in on change.
 */
export function CountdownHero() {
  const t = useTranslations("home");
  const reducedMotion = useReducedMotion();
  const [diff, setDiff] = useState<number | null>(null);
  // Captured once at mount — avoids an impure read inside the
  // "see you next year" branch.
  const [mountedAt] = useState(() => Date.now());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- avoid 1s delay before first tick; Date.now() is not SSR-safe
    setDiff(TARGET - Date.now());
    const id = setInterval(() => {
      setDiff(TARGET - Date.now());
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const ended = diff !== null && diff <= 0;

  if (ended) {
    return (
      <div className="flex flex-col items-start gap-5 md:gap-7">
        <Sticker color="brand" size="md" rotate={-3}>
          {t("countdown.daysAway")}
        </Sticker>
        <p className="font-display text-brand-500 text-6xl leading-[0.85] font-bold uppercase md:text-8xl xl:text-9xl">
          {mountedAt >= LAST_DAY
            ? "See you next year!"
            : t("festivalHasStarted")}
        </p>
      </div>
    );
  }

  const [d, h, m, s] = compute(diff ?? 0);
  const dayWord = d === 1 ? t("countdown.dayWord") : t("countdown.daysWord");

  return (
    <motion.div
      initial={reducedMotion ? false : "hidden"}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
      }}
      className="flex flex-col items-start gap-6 md:gap-8"
    >
      <motion.div
        variants={{
          hidden: { y: 12, opacity: 0 },
          show: { y: 0, opacity: 1 },
        }}
      >
        <Sticker color="brand" size="md" rotate={-3}>
          {t("countdown.daysAway")}
        </Sticker>
      </motion.div>

      {/* Days lockup — giant number stacked on a chunky-block stamp. */}
      <div className="flex flex-col items-start gap-2 md:gap-3">
        <motion.div
          variants={{
            hidden: { y: 32, opacity: 0, rotate: -6, scale: 0.9 },
            show: {
              y: 0,
              opacity: 1,
              rotate: -2,
              scale: 1,
              transition: { type: "spring", damping: 14, stiffness: 130 },
            },
          }}
          className="relative"
        >
          {/* AnimatePresence on the day value so the rare day-roll-over
              gets a satisfying flip rather than a jump cut. */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={d}
              initial={
                reducedMotion ? false : { y: "20%", opacity: 0, rotate: -8 }
              }
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { y: "-40%", opacity: 0, rotate: 5 }
              }
              transition={{ type: "spring", damping: 16, stiffness: 140 }}
              className="font-display text-brand-500 inline-block text-[clamp(7rem,22vw,16rem)] leading-[0.78] font-bold uppercase tabular-nums"
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.h2
          variants={{
            hidden: { scale: 0.7, rotate: -8, opacity: 0 },
            show: {
              scale: 1,
              rotate: 2,
              opacity: 1,
              transition: { type: "spring", damping: 12, stiffness: 160 },
            },
          }}
          className="font-display shadow-sticker-lg inline-block bg-gray-900 px-4 py-1.5 text-5xl leading-[0.9] font-bold text-yellow-400 uppercase md:px-6 md:py-2 md:text-7xl xl:text-8xl"
        >
          {dayWord}
        </motion.h2>
      </div>

      {/* Live HH:MM:SS row. Each digit rolls in on change; colons pulse. */}
      <motion.div
        variants={{
          hidden: { y: 16, opacity: 0 },
          show: { y: 0, opacity: 1 },
        }}
        className="flex items-start gap-2 md:gap-3"
      >
        <DigitPair value={h} label={t("hours")} reducedMotion={reducedMotion} />
        <Colon reducedMotion={reducedMotion} />
        <DigitPair
          value={m}
          label={t("minutes")}
          reducedMotion={reducedMotion}
        />
        <Colon reducedMotion={reducedMotion} />
        <DigitPair
          value={s}
          label={t("seconds")}
          reducedMotion={reducedMotion}
        />
      </motion.div>
    </motion.div>
  );
}
