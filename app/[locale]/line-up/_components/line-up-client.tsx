"use client";

import { ImageCard } from "@components/image-card";
import { Button } from "@components/ui/button";
import { usePathname, useRouter } from "@lib/i18n/navigation";
import {
  type Artist,
  getDateByDayString,
  ZZ_DATE_FRIDAY,
  ZZ_DATES,
  ZZ_YEAR,
} from "@lib/models";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

const containerVariants = {
  hidden: { y: 10, opacity: 0, transition: { duration: 0.2 } },
  exit: { y: -10, opacity: 0, transition: { duration: 0.2 } },
  show: {
    y: 0,
    opacity: 1,
    transition: { staggerChildren: 0.05, duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  exit: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

type Props = { artists: Artist[] };

export function LineUpClient({ artists }: Props) {
  const t = useTranslations("line-up");
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentDate = searchParams.get("date") ?? ZZ_DATE_FRIDAY;

  const filteredArtists = useMemo(() => {
    const today = new Date();
    // Keep showing artists for 6 months after the festival ends so the
    // line-up page stays useful for archival/recap purposes off-season.
    const festivalEnd = new Date(ZZ_DATES[2]);
    const endDate = new Date(festivalEnd.setMonth(festivalEnd.getMonth() + 6));

    const result = artists
      .filter(
        (artist) =>
          new Date(artist.showFrom).getTime() <= today.getTime() &&
          today.getTime() <= endDate.getTime() &&
          getDateByDayString(artist.day) === currentDate &&
          new Date(artist.showFrom).getFullYear() >= ZZ_YEAR,
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    if (result.length < 3) {
      const TBAs: Artist[] = Array.from(
        { length: 3 - result.filter((x) => x.name !== "TBA").length },
        (_, i) => ({
          name: "TBA",
          day: "friday",
          hour: "to be announced",
          description:
            "This artist will be announced soon! Stay in touch with our social channels or revisit zomaarzomert.be in the near future.",
          imgSrc: "/assets/artists/tba.webp",
          showFrom: i.toString(),
        }),
      );
      result.push(...TBAs);
    }
    return result;
  }, [artists, currentDate]);

  const formattedDate = new Date(currentDate);

  const handleDaySelect = useCallback(
    (newDate: string) => {
      router.replace({ pathname, query: { date: newDate } }, { scroll: false });
    },
    [pathname, router],
  );

  return (
    <section className="container-wide section-y-sm grid gap-14 text-center font-bold md:gap-20">
      <header>
        <AnimatePresence mode="wait">
          <motion.div
            className="relative z-[1] flex flex-col items-center justify-center"
            key={currentDate}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="mb-3 text-center text-5xl font-bold uppercase md:mb-5 md:text-6xl xl:mb-9">
              {formattedDate.toLocaleString(lang, { weekday: "long" })}
            </h1>
            <span className="font-display text-2xl">
              {formattedDate.toLocaleString(lang, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <img
              style={{
                transform: `rotate(${(ZZ_DATES.indexOf(currentDate) + 1) * 45}deg)`,
                maxHeight: "15rem",
              }}
              className="absolute z-[-1] block max-w-[200px] md:max-w-[300px] lg:max-w-[350px]"
              src="/assets/star.svg"
              alt=""
            />
          </motion.div>
        </AnimatePresence>
      </header>

      <div className="grid grid-cols-3">
        {ZZ_DATES.map((day) => (
          <Button
            key={day}
            size="md"
            variant="minimal"
            className="hover:text-pink-400 focus:text-pink-400"
            onClick={() => {
              handleDaySelect(day);
            }}
          >
            {new Date(day).toLocaleString(lang, { weekday: "long" })}
            {day === currentDate ? (
              <motion.div
                className="bg-brand-500 absolute right-0 -bottom-0.5 left-0 z-[3] h-1 w-full"
                layoutId="underline"
              />
            ) : null}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredArtists.map((artist) => (
            <motion.div
              variants={itemVariants}
              key={`${artist.name} - ${artist.day} - ${artist.showFrom}`}
            >
              <ImageCard
                data={{
                  imgSrc: artist.imgSrc,
                  title: artist.name,
                  subtitle: artist.hour,
                  date: getDateByDayString(artist.day),
                  description: artist.description,
                  link: artist.link,
                }}
                opensModal={artist.name !== "TBA"}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">{t("SEO.title")}</span>
    </section>
  );
}
