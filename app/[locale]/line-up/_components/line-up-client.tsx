"use client";

import { Sticker } from "@components/sticker";
import { usePathname, useRouter } from "@lib/i18n/navigation";
import {
  type Artist,
  getDateByDayString,
  isArtistVisible,
  ZZ_DATE_FRIDAY,
  ZZ_DATE_SATURDAY,
  ZZ_DATE_SUNDAY,
  ZZ_DATES,
} from "@lib/models";
import { cn } from "@lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useCallback, useMemo } from "react";

import { LineUpArtistCard } from "./line-up-card";

type Tone = "blue" | "brand" | "pink";
const toneCycle: Tone[] = ["blue", "brand", "pink", "brand", "pink", "blue"];
const tiltCycle = [-1.5, 1.2, -0.8, 0.9, -1.2, 1.5];

// Four cycling origins for the "deal" entry animation. Cards fly in
// from these four corners in sequence — bottom-left, top-right,
// bottom-right, top-left — so the deal looks like a dealer slinging
// cards across a table rather than all coming from one direction.
const DEAL_ORIGINS = [
  { x: -340, y: 240 },
  { x: 340, y: -260 },
  { x: 340, y: 240 },
  { x: -340, y: -260 },
] as const;

const dayFromDate = (date: string): "friday" | "saturday" | "sunday" => {
  if (date === ZZ_DATE_SATURDAY) return "saturday";
  if (date === ZZ_DATE_SUNDAY) return "sunday";
  return "friday";
};

type Props = { artists: Artist[]; children?: ReactNode };

export function LineUpClient({ artists, children }: Props) {
  const t = useTranslations("line-up");
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const currentDate = searchParams.get("date");
  const showAll = !currentDate;

  // eslint-disable-next-line react-hooks/purity
  const today = Date.now();
  const visibleArtists = useMemo(
    () => artists.filter((a) => isArtistVisible(a, today)),
    [artists, today],
  );

  const byDay = useMemo(() => {
    const result: Record<string, Artist[]> = {};
    for (const date of ZZ_DATES) {
      const list = visibleArtists
        .filter((a) => getDateByDayString(a.day) === date)
        .sort((a, b) => a.hour.localeCompare(b.hour));
      // Pad each day to 4 cards — real days will always have ≥4 acts.
      while (list.length < 4) {
        list.push({
          name: "TBA",
          day: dayFromDate(date),
          hour: "",
          imgSrc: "",
          showFrom: `tba-${date}-${String(list.length)}`,
          description: "",
        });
      }
      result[date] = list;
    }
    return result;
  }, [visibleArtists]);

  const handleDaySelect = useCallback(
    (date: string | null) => {
      if (date === null) {
        router.replace({ pathname }, { scroll: false });
      } else {
        router.replace({ pathname, query: { date } }, { scroll: false });
      }
    },
    [pathname, router],
  );

  const visibleDates = showAll
    ? ZZ_DATES
    : ZZ_DATES.filter((d) => d === currentDate);

  // Star backdrop rotates with the active filter — gives the page a
  // single piece of moving geometry that responds to interaction
  // without re-rendering the whole grid.
  const starRotation = currentDate
    ? (ZZ_DATES.indexOf(currentDate) + 1) * 45
    : 0;

  // Both long + short weekday labels — long renders md+, short
  // renders on mobile so the filter row never wraps to two lines.
  // `short` strips the trailing period that nl/fr add (e.g. "vr.").
  const weekdayShort = (date: string) =>
    new Date(date)
      .toLocaleString(lang, { weekday: "short" })
      .replace(/\.$/, "");
  const filters: { value: string | null; label: string; short: string }[] = [
    { value: null, label: t("filter.all"), short: t("filter.all") },
    {
      value: ZZ_DATE_FRIDAY,
      label: new Date(ZZ_DATE_FRIDAY).toLocaleString(lang, { weekday: "long" }),
      short: weekdayShort(ZZ_DATE_FRIDAY),
    },
    {
      value: ZZ_DATE_SATURDAY,
      label: new Date(ZZ_DATE_SATURDAY).toLocaleString(lang, {
        weekday: "long",
      }),
      short: weekdayShort(ZZ_DATE_SATURDAY),
    },
    {
      value: ZZ_DATE_SUNDAY,
      label: new Date(ZZ_DATE_SUNDAY).toLocaleString(lang, { weekday: "long" }),
      short: weekdayShort(ZZ_DATE_SUNDAY),
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-blue-900 text-pink-50">
      <div
        aria-hidden="true"
        className="halftone pointer-events-none absolute inset-0 z-0 opacity-25"
      />
      {/* Star backdrop — yellow ZZ asterisk-burst that rotates with the
          active filter. Sits at low opacity behind the header so the
          chunky block + filter chips read clearly on top. */}
      <motion.img
        src="/assets/star-tear.svg"
        alt=""
        aria-hidden="true"
        animate={{ rotate: starRotation }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", duration: 1.2, bounce: 0.2 }
        }
        className="pointer-events-none absolute -top-12 left-1/2 z-0 h-72 -translate-x-1/2 opacity-40 md:-top-16 md:h-96 lg:h-112"
      />

      <div className="container-wide relative z-20 pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Centered chunky-block headline — third position variation
            after /info (left) and /contact (right). Yellow block + red
            text breaks the gray-900 trend used on the other two. */}
        <div className="text-center">
          <h1 className="font-display shadow-sticker-lg text-brand-500 inline-block rotate-1 bg-yellow-400 px-5 py-2 text-5xl leading-[0.9] font-bold uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
            {t("hero.title")}
          </h1>
        </div>

        {/* Filter chips — `layoutId="filter-pill"` slides the active
            yellow indicator between chips on click. Pukkelpop-style. */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:mt-10 md:gap-3">
          {filters.map(({ value, label, short }) => {
            const isActive =
              (value === null && showAll) || value === currentDate;
            return (
              <button
                key={value ?? "all"}
                onClick={() => {
                  handleDaySelect(value);
                }}
                className={cn(
                  "font-display relative min-h-11 touch-manipulation px-4 py-3 text-base font-bold tracking-wide uppercase transition-colors md:px-5 md:py-2.5 md:text-lg",
                  isActive
                    ? "text-gray-900"
                    : "text-pink-50 hover:text-yellow-300",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="shadow-sticker pointer-events-none absolute inset-0 -z-10 border-2 border-gray-900 bg-yellow-400"
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: "spring", duration: 0.4, bounce: 0.2 }
                    }
                  />
                )}
                <span className="relative md:hidden">{short}</span>
                <span className="relative hidden md:inline">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid gap-y-12 md:mt-16 md:gap-y-24">
          {visibleDates.map((date, dayIndex) => (
            <DaySection
              key={`${currentDate ?? "all"}-${date}`}
              date={date}
              artists={byDay[date]}
              showHeading={showAll}
              lang={lang}
              tbaLabel={t("tba")}
              reducedMotion={reducedMotion ?? false}
              animationType={showAll ? "deal" : "flip"}
              dayIndex={dayIndex}
            />
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}

type DaySectionProps = {
  date: string;
  artists: Artist[];
  showHeading: boolean;
  lang: string;
  tbaLabel: string;
  reducedMotion: boolean;
  animationType: "deal" | "flip";
  dayIndex: number;
};

function DaySection({
  date,
  artists,
  showHeading,
  lang,
  tbaLabel,
  reducedMotion,
  animationType,
  dayIndex,
}: DaySectionProps) {
  const dayName = new Date(date).toLocaleString(lang, { weekday: "long" });

  // Two animation modes:
  // - "flip" — used when a single day is selected. Cards enter
  //   edge-on (rotateY -90°) and rotate to flat, like a deck being
  //   flipped face-up.
  // - "deal" — used in "all" view. Each card is "thrown" from
  //   above with a slightly varied trajectory and rotation, like a
  //   dealer sliding cards across a table. Day sections deal
  //   sequentially via `delayChildren` offset by `dayIndex`.
  // Shuffled order so flip stagger fires in random sequence rather
  // than left-to-right. Re-rolls on each filter switch (keyed by
  // animationKey) so users get a fresh order every time. Math.random
  // in render is impure; the useMemo + identity deps keep it stable
  // between switches.
  const shuffleOrder = useMemo(() => {
    const order = artists.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      // eslint-disable-next-line react-hooks/purity
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artists.length]);

  const containerVariants = reducedMotion
    ? undefined
    : {
        hidden: { opacity: 1 },
        show: {
          opacity: 1,
          transition:
            animationType === "deal"
              ? {
                  staggerChildren: 0.09,
                  delayChildren: 0.1 + dayIndex * 0.35,
                }
              : {
                  // Flip mode handles delay per-card via the shuffled
                  // order in `flipItem.show` — no parent stagger.
                  delayChildren: 0.05,
                },
        },
      };

  const flipItem = {
    hidden: { opacity: 0, rotateY: -90, scale: 0.85 },
    show: (i: number) => ({
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.22, 0.61, 0.36, 1] as const,
        delay: shuffleOrder[i] * 0.1,
      },
    }),
  };

  // Deal variants — each card flies in from one of four corners
  // (bottom-left, top-right, bottom-right, top-left), cycled by
  // index. Combined with a varied start rotation, this reads as a
  // dealer slinging cards across a table from different positions
  // rather than dropping them straight from above.
  const dealItem = reducedMotion
    ? undefined
    : {
        hidden: (i: number) => {
          const origin = DEAL_ORIGINS[i % DEAL_ORIGINS.length];
          return {
            opacity: 0,
            x: origin.x,
            y: origin.y,
            rotate: -45 + ((i * 17) % 90),
            scale: 0.95,
          };
        },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: { type: "spring" as const, duration: 0.7, bounce: 0.3 },
        },
      };

  const itemVariants = reducedMotion
    ? undefined
    : animationType === "deal"
      ? dealItem
      : flipItem;

  // Flip mode needs `perspective` on the parent for the 3D rotateY
  // to read as a real hinge. Deal mode is 2D and doesn't need it.
  const gridStyle =
    animationType === "flip" ? { perspective: "1200px" } : undefined;

  return (
    <div>
      {showHeading && (
        <div className="mb-6 md:mb-8">
          <Sticker color="brand" size="lg" rotate={-3}>
            {dayName}
          </Sticker>
        </div>
      )}
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        style={gridStyle}
        className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8"
      >
        {artists.map((artist, i) => (
          <motion.div
            key={`${artist.name}-${artist.showFrom}`}
            custom={i}
            variants={itemVariants}
            style={{
              transformOrigin: "center center",
              transformStyle: "preserve-3d",
            }}
          >
            <LineUpArtistCard
              artist={artist}
              date={date}
              tone={toneCycle[i % toneCycle.length]}
              tilt={tiltCycle[i % tiltCycle.length]}
              tbaLabel={tbaLabel}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
