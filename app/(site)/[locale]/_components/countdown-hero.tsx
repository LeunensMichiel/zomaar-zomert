"use client";

import { ZZ_DATE_FRIDAY, ZZ_DATE_MONDAY, ZZ_YEAR } from "@lib/models";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

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
            className="absolute inset-0 grid place-items-center text-3xl font-bold tabular-nums md:text-5xl xl:text-6xl"
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  );
}

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
      <span className="font-display text-[10px] font-bold tracking-[0.3em] text-gray-950 uppercase md:text-xs">
        {label}
      </span>
    </div>
  );
}

function Colon({ reducedMotion }: { reducedMotion: boolean | null }) {
  return (
    <motion.span
      aria-hidden
      className="font-display text-brand-500 flex h-14 items-center text-3xl font-bold md:h-20 md:text-5xl xl:h-24 xl:text-6xl"
      animate={reducedMotion ? undefined : { opacity: [1, 0.5, 1] }}
      transition={{
        duration: 1,
        ease: "backOut",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      :
    </motion.span>
  );
}

const STROKE_PATH =
  "M63.2093 43.0917L137.51 40.5994L52.1302 111.359L232.573 41.2719L46.9445 163.596L220.386 74.8238L23.2239 225.272L425.018 16.0246L10.2916 303.448L325.238 140.553L157.491 258.867L269.449 247.26";
const STROKE_PAINT_LENGTH = 4000;

function StrokeBackdrop({
  gradientId,
  size = "md",
}: {
  gradientId: string;
  size?: "md" | "lg";
}) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const sizing =
    size === "lg"
      ? "max-w-md scale-170 md:max-w-2xl md:scale-100"
      : "max-w-md md:max-w-2xl";

  const targetOffset = reducedMotion || inView ? 0 : STROKE_PAINT_LENGTH;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 grid place-items-center"
    >
      <div
        className={`aspect-[1.36/1] w-full translate-x-[12%] translate-y-[8%] opacity-90 md:translate-x-[13%] md:translate-y-[-8%] ${sizing}`}
      >
        <svg
          viewBox="0 0 435.309 319.496"
          fill="none"
          aria-hidden
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
          className="h-full w-full"
        >
          <defs>
            <linearGradient
              id={gradientId}
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
          <motion.path
            d={STROKE_PATH}
            stroke={`url(#${gradientId})`}
            strokeWidth="36.1349"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={STROKE_PAINT_LENGTH}
            initial={{
              strokeDashoffset: reducedMotion ? 0 : STROKE_PAINT_LENGTH,
            }}
            animate={{ strokeDashoffset: targetOffset }}
            transition={{
              type: "spring",
              damping: 18,
              stiffness: 45,
              mass: 1.1,
            }}
          />
        </svg>
      </div>
    </div>
  );
}

function EndedState({ pastFestival }: { pastFestival: boolean }) {
  const t = useTranslations("home");
  const reducedMotion = useReducedMotion();

  const headline = pastFestival ? t("seeYouNextYear") : t("festivalHasStarted");
  const editionYear = pastFestival ? ZZ_YEAR + 1 : ZZ_YEAR;
  const yearShort = String(editionYear).slice(-2);

  const blockText = pastFestival ? "text-yellow-400" : "text-pink-300";

  return (
    <motion.div
      initial={reducedMotion ? false : "hidden"}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
      }}
      className="relative isolate mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center md:px-10 md:pt-12 md:pb-28"
    >
      <StrokeBackdrop gradientId="ended-stroke-gradient" />

      <motion.div
        aria-hidden
        variants={{
          hidden: { scale: 0, rotate: -30, opacity: 0 },
          show: {
            scale: 1,
            rotate: -8,
            opacity: 1,
            transition: { type: "spring", damping: 11, stiffness: 180 },
          },
        }}
        className="absolute top-2 left-2 h-10 w-10 md:top-4 md:left-6 md:h-14 md:w-14"
      >
        <Image
          src={
            pastFestival
              ? "/assets/doodles/star.svg"
              : "/assets/doodles/flame.svg"
          }
          alt=""
          fill
          sizes="56px"
          className="object-contain"
        />
      </motion.div>

      <motion.div
        aria-hidden
        variants={{
          hidden: { scale: 0, rotate: -25, opacity: 0 },
          show: {
            scale: 1,
            rotate: -14,
            opacity: 1,
            transition: { type: "spring", damping: 13, stiffness: 160 },
          },
        }}
        className="absolute right-3 bottom-3 h-9 w-9 md:right-8 md:bottom-6 md:h-12 md:w-12"
      >
        <Image
          src="/assets/doodles/cross.svg"
          alt=""
          fill
          sizes="48px"
          className="object-contain"
        />
      </motion.div>

      <motion.span
        variants={{
          hidden: { y: 12, opacity: 0 },
          show: { y: 0, opacity: 1 },
        }}
        className="font-display text-[0.7rem] font-bold tracking-[0.45em] text-gray-950 uppercase md:text-sm"
      >
        {t("month")} &rsquo;{yearShort}
      </motion.span>

      <motion.div
        variants={{
          hidden: { scale: 0.7, rotate: -10, opacity: 0 },
          show: {
            scale: 1,
            rotate: -2,
            opacity: 1,
            transition: { type: "spring", damping: 12, stiffness: 130 },
          },
        }}
        className="relative mt-6 md:mt-8"
      >
        <span
          aria-hidden
          className="tape-strip absolute -top-3 left-6 z-30 h-5 w-20 -rotate-12 md:-top-4 md:left-14 md:h-6 md:w-28"
        />
        <motion.h2
          animate={reducedMotion ? undefined : { rotate: [-2, -0.8, -2.4, -2] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`font-display shadow-sticker-lg inline-block border-2 border-gray-900 bg-gray-900 px-6 py-4 text-4xl leading-[0.92] font-bold uppercase md:px-10 md:py-6 md:text-6xl xl:text-7xl ${blockText}`}
          style={{ textWrap: "balance" }}
        >
          {headline}
        </motion.h2>
      </motion.div>
    </motion.div>
  );
}

export function CountdownHero() {
  const t = useTranslations("home");
  const reducedMotion = useReducedMotion();
  const [diff, setDiff] = useState<number | null>(null);
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
    return <EndedState pastFestival={mountedAt >= LAST_DAY} />;
  }

  const [d, h, m, s] = compute(diff ?? 0);
  const dayWord = d === 1 ? t("countdown.dayWord") : t("countdown.daysWord");

  return (
    <motion.div
      initial={reducedMotion ? false : "hidden"}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
      className="relative isolate mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 py-10 text-center md:gap-5 md:px-10 md:py-14"
    >
      <StrokeBackdrop gradientId="countdown-stroke-gradient" size="lg" />
      <motion.span
        variants={{
          hidden: { y: 12, opacity: 0 },
          show: { y: 0, opacity: 1 },
        }}
        className="font-display text-[0.7rem] font-bold tracking-[0.45em] text-gray-950 uppercase md:text-sm"
      >
        {t("countdown.daysAway")}
      </motion.span>

      <div className="flex flex-col items-center gap-1 md:gap-2">
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
              className="font-display inline-block text-[clamp(8rem,12vw,15rem)] leading-[0.78] font-bold text-white uppercase tabular-nums"
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
          className="font-display shadow-sticker-lg inline-block bg-gray-900 px-5 py-1.5 text-5xl leading-[0.9] font-bold text-pink-400 uppercase md:px-7 md:py-2 md:text-6xl xl:text-6xl"
        >
          {dayWord}
        </motion.h2>
      </div>

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
