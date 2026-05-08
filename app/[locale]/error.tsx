"use client";

import { Button } from "@components/ui/button";
import { Link } from "@lib/i18n/navigation";
import { ChevronRight, RotateCw, Zap } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

type SparkPos = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
  delay: number;
};

const SPARK_POSITIONS: SparkPos[] = [
  { top: "8%", left: "12%", rotate: -18, delay: 0 },
  { top: "14%", right: "10%", rotate: 22, delay: 0.35 },
  { bottom: "18%", left: "8%", rotate: 12, delay: 0.7 },
  { bottom: "10%", right: "14%", rotate: -24, delay: 1.05 },
  { top: "48%", right: "4%", rotate: 6, delay: 0.55 },
  { top: "50%", left: "4%", rotate: -8, delay: 0.85 },
];

export default function Error({ error, unstable_retry }: Props) {
  const t = useTranslations("common");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative bg-blue-900 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="container-wide relative z-20 text-center">
        <p className="font-display shadow-sticker-sm inline-block -rotate-2 border-2 border-gray-900 bg-yellow-400 px-3 py-1 text-sm font-bold text-gray-900 uppercase md:text-base">
          {t("error.eyebrow")}
        </p>

        <div className="relative mx-auto mt-10 flex h-72 w-full max-w-3xl items-center justify-center md:mt-14 md:h-96">
          {SPARK_POSITIONS.map((spark, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute"
              style={{
                top: spark.top,
                bottom: spark.bottom,
                left: spark.left,
                right: spark.right,
              }}
              initial={{ scale: reducedMotion ? 1 : 0, rotate: spark.rotate }}
              animate={
                reducedMotion
                  ? { scale: 1 }
                  : { scale: [0, 1, 1, 0], rotate: spark.rotate }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 1.4,
                      times: [0, 0.3, 0.7, 1],
                      repeat: Infinity,
                      repeatDelay: 0.4,
                      delay: spark.delay,
                      ease: "easeOut",
                    }
              }
            >
              <Zap
                className={
                  i % 2 === 0
                    ? "h-8 w-8 text-yellow-400 md:h-12 md:w-12"
                    : "h-8 w-8 text-pink-300 md:h-12 md:w-12"
                }
                fill="currentColor"
                strokeWidth={2}
              />
            </motion.span>
          ))}

          <motion.h1
            className="font-display shadow-sticker-lg bg-brand-500 inline-block border-2 border-gray-900 px-6 py-3 text-7xl leading-[0.85] font-bold text-pink-50 uppercase md:px-10 md:py-5 md:text-9xl xl:text-[12rem]"
            initial={{ rotate: reducedMotion ? 3 : -3 }}
            animate={
              reducedMotion ? { rotate: 3 } : { rotate: [-3, 3, -2, 4, -3] }
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
            500.
          </motion.h1>
        </div>

        <h2 className="font-display mt-12 text-3xl leading-tight font-bold text-pink-50 uppercase md:mt-16 md:text-5xl xl:text-6xl">
          {t("error.title")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pink-50/80 md:text-lg">
          {t("error.message")}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4 md:mt-12">
          <Button
            variant="brand"
            size="lg"
            sticker
            onClick={() => {
              unstable_retry();
            }}
            iconRight={<RotateCw />}
          >
            {t("error.button")}
          </Button>
          <Link href="/">
            <Button
              variant="accent"
              size="lg"
              sticker
              as="span"
              iconRight={<ChevronRight />}
            >
              {t("error.home")}
            </Button>
          </Link>
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 z-10 block h-6 w-full md:h-10"
      >
        <path
          d="M0 40 L0 22 L40 28 L80 18 L130 30 L180 14 L240 26 L300 12 L360 24 L420 16 L480 28 L540 14 L600 22 L660 10 L720 26 L780 16 L840 28 L900 12 L960 24 L1020 18 L1080 30 L1140 16 L1200 24 L1200 40 Z"
          fill="var(--color-pink-50)"
        />
      </svg>
    </section>
  );
}
