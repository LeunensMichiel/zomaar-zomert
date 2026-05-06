import { Triangle } from "@components/icons/Triangle";
import { Button } from "@components/ui/button";
import { Logo } from "@components/ui/logo";
import artistsData from "@lib/data/artists.json";
import partnersData from "@lib/data/partners.json";
import { Link } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import {
  isSignupOpen,
  PAELLA_LINK,
  PETANQUE_LINK,
  ZZ_DATE_FRIDAY,
  ZZ_DATE_SATURDAY,
  ZZ_DATE_SUNDAY,
  ZZ_YEAR,
} from "@lib/models";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ConsentVideo } from "@/app/[locale]/_components/consent-video";
import { DayCard } from "@/app/[locale]/redesign/_components/day-card";
import { Doodle } from "@/app/[locale]/redesign/_components/doodle";
import { HeadlinerCard } from "@/app/[locale]/redesign/_components/headliner-card";
import { PaperTear } from "@/app/[locale]/redesign/_components/paper-tear";
import { PhotoMarquees } from "@/app/[locale]/redesign/_components/photo-marquees";
import { RedesignCountdown } from "@/app/[locale]/redesign/_components/redesign-countdown";
import { StarBurst } from "@/app/[locale]/redesign/_components/star-burst";
import { Sticker } from "@/app/[locale]/redesign/_components/sticker";
import { TickerStrip } from "@/app/[locale]/redesign/_components/ticker-strip";

type Props = { params: Promise<{ locale: Locale }> };

const days: Array<{ date: string; image: string }> = [
  { date: ZZ_DATE_FRIDAY, image: "/assets/days/friday.webp" },
  { date: ZZ_DATE_SATURDAY, image: "/assets/days/saturday.webp" },
  { date: ZZ_DATE_SUNDAY, image: "/assets/days/sunday.jpg" },
];

const dayDates: Record<"friday" | "saturday" | "sunday", string> = {
  friday: ZZ_DATE_FRIDAY,
  saturday: ZZ_DATE_SATURDAY,
  sunday: ZZ_DATE_SUNDAY,
};

const headlinerTones = ["blue", "yellow", "pink"] as const;
const headlinerTilts = [-1.5, 1.2, -0.8];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tHome = await getTranslations({ locale, namespace: "home" });
  return {
    title: { absolute: tHome("SEO.title") },
    description: tHome("SEO.description"),
  };
}

export default async function RedesignHome({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHome = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const signupDisabled = !isSignupOpen();

  // Pick up to 3 headliners from the data file. Pad with placeholders if fewer.
  const headliners = artistsData.slice(0, 3).map((a) => ({
    name: a.name,
    hour: a.hour,
    day: a.day as "friday" | "saturday" | "sunday",
    imgSrc: a.imgSrc,
  }));

  // Highlight a small sampling of partner logos in the partners teaser.
  const partnerSamples = partnersData
    .filter((p) => !p.disabled && p.logoWhite)
    .slice(0, 8);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          HERO — full-bleed video, halftone overlay, logo + date stamp,
          scatter doodles, and an in-hero marquee so motion is already
          visible above the fold. Height is intentionally short enough
          that the yellow ticker (next section) peeks at the bottom of
          the viewport on first load. The transparent navbar sits on top
          (handled in components/layout.tsx via `transparentRoutes`).
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden bg-gray-900 text-white">
        <video
          playsInline
          autoPlay
          muted
          loop
          preload="auto"
          poster="/assets/landing.webp"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source src="/assets/landing.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-gray-900/40 via-gray-900/30 to-gray-900/80" />
        <div className='halftone absolute inset-0 -z-10 opacity-90 mix-blend-multiply content-[""]' />

        {/* Scatter doodles — sparse and size-varied so it reads as a
            hand-pinned poster, not a sticker-bombed laptop. One large
            anchor + one mid + one tiny accent per region. */}
        <Doodle
          shape="halftone-star"
          color="yellow"
          accent="brand"
          rotate={-14}
          grain
          className="absolute top-24 -left-8 z-10 h-44 w-44 md:top-28 md:-left-12 md:h-72 md:w-72 lg:top-32 lg:-left-16 lg:h-96 lg:w-96"
        />
        <Doodle
          shape="squiggle"
          color="pink"
          rotate={12}
          className="absolute top-36 right-4 z-10 h-12 w-12 md:top-40 md:right-12 md:h-20 md:w-20"
        />
        <Doodle
          shape="lightning"
          color="yellow"
          rotate={-10}
          grain
          className="absolute right-1/4 bottom-44 z-10 hidden h-8 w-8 md:block"
        />

        {/* Logo + date — vertically centered. The marquee sits flush at
            the bottom (no extra reserved padding needed). */}
        <div className="container-wide relative flex flex-1 flex-col items-center justify-center pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="relative z-20 flex flex-col items-center text-center">
            <Logo
              variant="full"
              className="w-full max-w-72 text-white md:max-w-160 xl:max-w-200"
            />

            {/* Sticker-style date stamp instead of an inline triangle row. */}
            <div className="mt-6 inline-flex items-center gap-3 md:mt-8">
              <Sticker color="yellow" size="lg" rotate={-3}>
                <span className="inline-flex items-center gap-2">
                  <span>{ZZ_DATE_FRIDAY.slice(-2)}</span>
                  <Triangle className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{ZZ_DATE_SATURDAY.slice(-2)}</span>
                  <Triangle className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{ZZ_DATE_SUNDAY.slice(-2)}</span>
                </span>
              </Sticker>
              <Sticker color="brand" size="lg" rotate={3}>
                {tHome("month")} {ZZ_YEAR}
              </Sticker>
            </div>

            <span className="mt-5 inline-flex items-center gap-2 text-sm tracking-[0.3em] uppercase md:text-base">
              <span aria-hidden="true">●</span>
              <span>Itterbeek · Dilbeek · BE</span>
              <span aria-hidden="true">●</span>
            </span>
          </div>
        </div>

        {/* In-hero marquee — anchored at the bottom of the hero so the
            yellow ticker is part of the 100vh frame, not a separate
            element below. The tear is nested *inside* this wrapper with
            `bottom-full` so it sits ABOVE the marquee (not on top of
            the text); its yellow body extends up into the dark hero,
            with the marquee text fully visible below. Use `tear={5}` —
            its natural ink aspect (~22:1) is the most compact. */}
        <div className="relative z-20">
          <PaperTear edge="top" tear={5} color="yellow-400" />
          <TickerStrip
            items={tHome.raw("ticker") as string[]}
            speed={50}
            className="bg-yellow-400 text-gray-900"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          INTRO + COUNTDOWN — short story of the festival next to a
          big countdown. The countdown component is unchanged.
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative overflow-hidden bg-pink-50">
        {/* One big anchor in the lower-left bleed; one tiny accent. */}
        <Doodle
          shape="halftone-blob"
          color="brand"
          accent="ink"
          rotate={-12}
          grain
          className="absolute -bottom-15 -left-12 h-48 w-48 md:-right-20 md:-bottom-50 md:left-auto md:h-80 md:w-80 lg:h-112 lg:w-md"
        />
        <Doodle
          shape="smile"
          color="yellow"
          accent="ink"
          rotate={8}
          className="absolute top-12 left-6 h-10 w-10 md:top-16 md:left-12 md:h-14 md:w-14"
        />
        <div className="container-wide section-y grid gap-10 md:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* Poster-style display word — replaces the eyebrow + sentence
                title with a single oversized statement. */}
            <h2 className="text-brand-500 text-7xl leading-[0.85] md:text-9xl xl:text-[14rem]">
              ZOMAAR.
            </h2>
            <p className="mt-6 max-w-xl text-base text-gray-700 md:text-lg">
              {tHome("intro.body")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/line-up">
                <Button
                  as="span"
                  variant="brand"
                  size="xl"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tCommon("links.line-up")}
                </Button>
              </Link>
              <Link href="/info">
                <Button
                  as="span"
                  variant="ink"
                  size="xl"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tCommon("links.info")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Countdown panel — date repeated below the clock was redundant
              with the hero stickers, so it's gone. */}
          <div className="relative lg:col-span-5">
            <div className="bg-brand-500 shadow-sticker-lg relative border-2 border-gray-900 p-6 text-pink-50 md:p-8">
              <div className='halftone absolute inset-0 z-0 opacity-25 mix-blend-screen content-[""]' />
              <div className="relative z-10 flex flex-col gap-6">
                <Sticker color="yellow" size="sm" rotate={-3}>
                  {tHome("countdown.daysAway")}
                </Sticker>
                <RedesignCountdown />
              </div>
            </div>
            <div className="absolute -top-6 -right-4 hidden md:block">
              <Sticker color="ink" size="md" rotate={9}>
                Itterbeek
              </Sticker>
            </div>
          </div>
        </div>
        <PaperTear edge="bottom" tear={3} color="yellow-400" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          DAYS — three hand-cut cards with sticker numbers
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative overflow-hidden bg-pink-300 pb-20 md:pb-28">
        <PaperTear edge="top" tear={2} color="pink-50" />
        {/* Big anchor in the right bleed + one tiny accent. */}
        <Doodle
          shape="eye-iris"
          color="ink"
          accent="brand"
          rotate={8}
          grain
          className="absolute -top-12 left-16 h-56 w-56 md:-top-20 md:-right-24 md:h-80 md:w-80 lg:h-96 lg:w-96"
        />
        <Doodle
          shape="checkered"
          color="ink"
          accent="pink"
          rotate={-12}
          className="absolute bottom-20 left-6 hidden h-10 w-10 md:left-12 md:block md:h-14 md:w-14"
        />
        <div className="container-wide section-y">
          {/* Just an eyebrow — the day cards do the talking. */}
          <div className="mb-10 md:mb-14">
            <Sticker color="ink" size="sm" rotate={-3}>
              Programma
            </Sticker>
          </div>

          <div className="grid gap-12 md:gap-8 lg:grid-cols-3">
            {days.map((day, i) => (
              <DayCard
                key={day.date}
                date={day.date}
                image={day.image}
                index={i}
                locale={locale}
                ctaLabel={tHome("lineup.seeDay")}
              />
            ))}
          </div>
        </div>
        <PaperTear edge="bottom" tear={3} color="pink-50" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          HEADLINERS — featured artists w/ overlay sticker
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative overflow-hidden bg-blue-500 pb-24 text-white md:pb-32">
        {/* Big halftone star bleeding off the right + one small note. */}
        <Doodle
          shape="halftone-star"
          color="yellow"
          accent="pink"
          rotate={20}
          grain
          className="absolute -top-12 -right-16 h-56 w-56 md:-top-20 md:-right-24 md:h-96 md:w-96 lg:h-112 lg:w-md"
        />
        <Doodle
          shape="note"
          color="yellow"
          className="absolute bottom-32 left-6 hidden h-10 w-10 md:left-12 md:block md:h-14 md:w-14"
        />
        <div className="container-wide section-y">
          {/* Single oversized poster word — context speaks for itself. */}
          <div className="mb-10 flex flex-col items-start gap-6 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
            <h2 className="text-7xl leading-[0.85] text-yellow-400 md:text-[10rem] xl:text-[14rem]">
              Line-up.
            </h2>
            <Link href="/line-up">
              <Button
                as="span"
                variant="accent"
                size="xl"
                sticker
                iconRight={<ChevronRight />}
              >
                {tHome("lineup.all")}
              </Button>
            </Link>
          </div>

          <div className="grid gap-10 md:gap-8 lg:grid-cols-3">
            {headliners.map((h, i) => (
              <HeadlinerCard
                key={h.name}
                name={h.name}
                hour={h.hour}
                day={h.day}
                imgSrc={h.imgSrc}
                date={dayDates[h.day]}
                locale={locale}
                tilt={headlinerTilts[i % headlinerTilts.length]}
                tone={headlinerTones[i % headlinerTones.length]}
              />
            ))}
          </div>
        </div>
        <PaperTear edge="bottom" tear={4} color="pink-50" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACTIVITIES — bento layout: paella + petanque + food + crew
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative overflow-hidden bg-pink-50">
        {/* Big flame anchor in the right bleed + one small spiral. */}
        <Doodle
          shape="cross"
          color="brand"
          rotate={-8}
          grain
          className="absolute -top-12 -right-12 h-48 w-48 md:-top-20 md:-right-20 md:h-80 md:w-80 lg:h-96 lg:w-96"
        />
        <Doodle
          shape="spiral"
          color="brand"
          rotate={-15}
          className="absolute right-1/3 bottom-12 hidden h-10 w-10 md:block md:h-14 md:w-14"
        />
        <div className="container-wide section-y">
          {/* Single oversized poster word, no sentence-y subtitle. */}
          <h2 className="text-brand-500 mb-10 text-7xl leading-[0.85] md:mb-14 md:text-9xl xl:text-[14rem]">
            Doe mee.
          </h2>

          {/* Bento */}
          <div className="grid gap-6 md:gap-8 lg:grid-cols-12">
            {/* Paella — large hero tile */}
            <article className="shadow-sticker-lg relative overflow-hidden border-2 border-gray-900 bg-yellow-400 lg:col-span-7 lg:row-span-2">
              <div className="relative aspect-16/10 overflow-hidden border-b-2 border-gray-900">
                <Image
                  src="/assets/random/food.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center"
                />
                <div className='halftone absolute inset-0 opacity-30 mix-blend-multiply content-[""]' />
                <div className="absolute top-4 left-4">
                  <Sticker color="ink" size="md" rotate={-6}>
                    {tHome("activities.paella.title")}
                  </Sticker>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 md:p-8">
                <h3 className="text-3xl leading-[0.95] md:text-5xl">
                  {tHome("activities.paella.title")}
                </h3>
                <p className="max-w-md text-base md:text-lg">
                  {tHome("activities.paella.body")}
                </p>
                <Button
                  as="a"
                  {...(!signupDisabled && {
                    href: PAELLA_LINK,
                    target: "_blank",
                    rel: "noreferrer noopener",
                  })}
                  disabled={signupDisabled}
                  variant="brand"
                  size="xl"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tHome("paella")}
                </Button>
              </div>
            </article>

            {/* Pétanque */}
            <article className="shadow-sticker-lg relative overflow-hidden border-2 border-gray-900 bg-blue-500 text-white lg:col-span-5">
              <div className="relative aspect-5/4 overflow-hidden border-b-2 border-gray-900">
                <Image
                  src="/assets/random/petanque.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div className='halftone absolute inset-0 opacity-40 mix-blend-multiply content-[""]' />
              </div>
              <div className="flex flex-col gap-3 p-5 md:p-6">
                <h3 className="text-2xl leading-[0.95] md:text-4xl">
                  {tHome("activities.petanque.title")}
                </h3>
                <p className="text-sm md:text-base">
                  {tHome("activities.petanque.body")}
                </p>
                <Button
                  as="a"
                  {...(!signupDisabled && {
                    href: PETANQUE_LINK,
                    target: "_blank",
                    rel: "noreferrer noopener",
                  })}
                  disabled={signupDisabled}
                  variant="accent"
                  size="lg"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tHome("petanque")}
                </Button>
              </div>
            </article>

            {/* Crew tile */}
            <article className="shadow-sticker-lg relative overflow-hidden border-2 border-gray-900 bg-pink-300 lg:col-span-5">
              <div className="grid grid-cols-5 items-stretch">
                <div className="relative col-span-2 min-h-40 border-r-2 border-gray-900 md:min-h-50">
                  <Image
                    src="/assets/random/crew.webp"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover object-center"
                  />
                  <div className='halftone absolute inset-0 opacity-40 mix-blend-multiply content-[""]' />
                </div>
                <div className="col-span-3 flex flex-col gap-2 p-5 md:p-6">
                  <Sticker color="ink" size="xs" rotate={-4}>
                    {tCommon("footer.contact.activities")}
                  </Sticker>
                  <p className="font-display text-2xl leading-[0.95] md:text-3xl">
                    Doe mee als vrijwilliger of partner.
                  </p>
                  <Link
                    href="/contact"
                    className="font-display mt-auto text-base font-bold text-gray-900 uppercase underline md:text-lg"
                  >
                    {tHome("activities.contact")} →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
        <PaperTear edge="bottom" tear={5} color="brand-500" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          AFTERMOVIE — keep the existing consent video section,
          wrap with eyebrow/title and stronger frame.
          ─────────────────────────────────────────────────────────────*/}
      <section className="bg-brand-500 relative overflow-hidden pb-16 text-pink-50 md:pb-24">
        {/* Single oversized peace sign in the bleed + a small note. */}
        <Doodle
          shape="peace"
          color="yellow"
          rotate={20}
          className="absolute -top-16 -right-16 h-56 w-56 md:-top-24 md:-right-24 md:h-96 md:w-96"
        />
        <Doodle
          shape="note"
          color="yellow"
          rotate={-12}
          grain
          className="absolute right-1/4 bottom-12 hidden h-12 w-12 md:block md:h-16 md:w-16"
        />
        <div className="container-wide pt-12 md:pt-20">
          <h2 className="mb-8 text-7xl leading-[0.85] text-pink-50 md:mb-12 md:text-9xl xl:text-[14rem]">
            Aftermovie.
          </h2>
        </div>
        <ConsentVideo />
        <PaperTear edge="bottom" tear={6} color="yellow-400" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          GALLERY — keep marquees, frame them like a polaroid wall
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative overflow-hidden bg-yellow-400 pb-16 md:pb-24">
        {/* Single huge flower in the right gutter + a small arrow. */}
        <Doodle
          shape="flower"
          color="brand"
          accent="pink"
          rotate={6}
          grain
          className="absolute -top-16 -right-16 h-56 w-56 md:-top-20 md:-right-20 md:h-96 md:w-96 lg:h-112 lg:w-md"
        />
        <Doodle
          shape="arrow"
          color="brand"
          rotate={-6}
          className="absolute bottom-12 left-6 hidden h-10 w-10 md:left-12 md:block md:h-14 md:w-14"
        />
        <div className="container-wide pt-16 md:pt-20">
          <h2 className="text-7xl leading-[0.85] text-gray-900 md:text-9xl xl:text-[14rem]">
            Vibes.
          </h2>
        </div>
        <div className="relative mt-8 md:mt-12">
          <PhotoMarquees />
        </div>
        <PaperTear edge="bottom" tear={7} color="brand-500" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          NUMBERS — chunky stat stickers on a brand-orange field
          ─────────────────────────────────────────────────────────────*/}
      <section className="bg-brand-500 relative overflow-hidden pb-24 text-pink-50 md:pb-32">
        <div className='halftone absolute inset-0 opacity-30 mix-blend-multiply content-[""]' />
        {/* Big burst anchor + one small wave for variation. */}
        <Doodle
          shape="burst-dot"
          color="yellow"
          accent="pink"
          rotate={10}
          grain
          className="absolute -top-12 -right-12 h-48 w-48 md:-top-16 md:-right-16 md:h-80 md:w-80 lg:h-96 lg:w-96"
        />
        <Doodle
          shape="wave-pair"
          color="pink"
          accent="yellow"
          rotate={-8}
          className="absolute right-1/4 bottom-12 hidden h-12 w-12 md:block md:h-16 md:w-16"
        />
        <div className="container-wide section-y relative">
          {/* No header — the stat stickers are the design. */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {[
              {
                value: "3",
                label: tHome("numbers.days"),
                tone: "bg-yellow-400 text-gray-900",
                tilt: -2,
              },
              {
                value: "30+",
                label: tHome("numbers.artists"),
                tone: "bg-pink-50 text-gray-900",
                tilt: 2,
              },
              {
                value: "100%",
                label: tHome("numbers.free"),
                tone: "bg-blue-500 text-white",
                tilt: -1,
              },
              {
                value: "5K+",
                label: tHome("numbers.visitors"),
                tone: "bg-pink-300 text-gray-900",
                tilt: 1.5,
              },
            ].map((n) => (
              <div
                key={n.label}
                className={`shadow-sticker-lg relative border-2 border-gray-900 px-6 py-8 ${n.tone}`}
                style={{ transform: `rotate(${String(n.tilt)}deg)` }}
              >
                <span className="font-display block text-7xl leading-[0.85] font-bold md:text-8xl xl:text-9xl">
                  {n.value}
                </span>
                <span className="font-display mt-2 block text-xl leading-none font-bold uppercase md:text-2xl">
                  {n.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <PaperTear edge="bottom" tear={1} color="pink-50" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PARTNERS TEASER — small partner cluster + CTA. Full list
          remains in the global footer.
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative overflow-hidden bg-pink-50">
        {/* Big radio-waves anchor in the bottom-right + a small smile. */}
        <Doodle
          shape="radio-waves"
          color="blue"
          className="absolute -right-16 -bottom-12 h-56 w-56 md:-right-20 md:-bottom-16 md:h-80 md:w-80 lg:h-96 lg:w-96"
        />
        <Doodle
          shape="smile"
          color="yellow"
          accent="brand"
          rotate={6}
          className="absolute top-12 right-6 h-12 w-12 md:top-20 md:right-12 md:h-16 md:w-16"
        />
        <div className="container-wide section-y grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Sticker color="brand" size="sm" rotate={-3}>
              {tHome("partners.eyebrow")}
            </Sticker>
            <h2 className="text-brand-500 mt-4 text-7xl leading-[0.85] md:mt-6 md:text-9xl xl:text-[12rem]">
              100% Gratis.
            </h2>
            <p className="mt-6 max-w-md text-base text-gray-700 md:text-lg">
              {tHome("partners.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/partners">
                <Button
                  as="span"
                  variant="ink"
                  size="xl"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tHome("partners.all")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  as="span"
                  variant="accent"
                  size="xl"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tHome("partners.become")}
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {partnerSamples.map((p, i) => (
                <a
                  key={p.name}
                  {...(p.site && {
                    href: p.site,
                    target: "_blank",
                    rel: "noreferrer noopener",
                  })}
                  className="group shadow-sticker-sm relative flex aspect-square items-center justify-center border-2 border-gray-900 bg-gray-900 p-4 transition-transform hover:-translate-y-1"
                  style={{
                    transform: `rotate(${String(((i % 4) - 1.5) * 1.5)}deg)`,
                  }}
                  aria-label={p.name}
                >
                  {p.logoWhite && (
                    <Image
                      src={p.logoWhite}
                      alt={p.name}
                      width={160}
                      height={120}
                      className="max-h-12 w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100 md:max-h-16"
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CLOSING CTA — last loud moment before the footer.
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative overflow-hidden bg-gray-900 text-pink-50">
        <div className='halftone absolute inset-0 opacity-25 mix-blend-screen content-[""]' />
        <PaperTear edge="top" tear={6} color="pink-50" />
        {/* One huge halftone-star anchor + a small bars accent. */}
        <Doodle
          shape="halftone-star"
          color="yellow"
          accent="brand"
          rotate={20}
          grain
          className="absolute -right-12 -bottom-16 h-64 w-64 md:-right-20 md:-bottom-24 md:h-112 md:w-md lg:h-128 lg:w-lg"
        />
        <Doodle
          shape="bars"
          color="pink"
          rotate={-6}
          className="absolute top-44 left-1/3 hidden h-10 w-10 md:block md:h-14 md:w-14"
        />
        <div className="container-wide section-y relative grid gap-10 md:gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Sticker color="brand" size="sm" rotate={-4}>
              {tHome("cta.eyebrow")}
            </Sticker>
            <h2 className="mt-4 text-7xl leading-[0.85] md:text-9xl xl:text-[14rem]">
              Tot dan.
            </h2>
            <p className="mt-6 max-w-xl text-base md:text-lg">
              {tHome("cta.body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/line-up">
                <Button
                  as="span"
                  variant="brand"
                  size="xl"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tCommon("links.line-up")}
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  as="span"
                  variant="accent"
                  size="xl"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tCommon("links.contact")}
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:col-span-5 lg:block">
            <div className="absolute -top-10 right-10">
              <StarBurst
                fill="text-yellow-400"
                className="h-44 w-44"
                style={{ transform: "rotate(-8deg)" }}
              >
                <span className="font-display text-2xl leading-[0.9] font-bold text-gray-900 uppercase">
                  {ZZ_DATE_FRIDAY.slice(-2)}
                  <br />
                  →
                  <br />
                  {ZZ_DATE_SUNDAY.slice(-2)}
                </span>
              </StarBurst>
            </div>
            <div className="absolute right-2 bottom-0">
              <Sticker color="pink" size="lg" rotate={-7}>
                Itterbeek · BE
              </Sticker>
            </div>
            <div className="absolute right-32 bottom-24">
              <Sticker color="paper" size="md" rotate={6}>
                {tHome("month")} {ZZ_YEAR}
              </Sticker>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
