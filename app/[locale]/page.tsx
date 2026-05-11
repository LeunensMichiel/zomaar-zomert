import { Doodle } from "@components/doodle";
import { Triangle } from "@components/icons/Triangle";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import { GradientDots } from "@components/ui/gradient-dots";
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

import { ConsentVideo } from "./_components/consent-video";
import { CountdownHero } from "./_components/countdown-hero";
import { DayCard } from "./_components/day-card";
import { FloatingPolaroid } from "./_components/floating-polaroid";
import { HeadlinerCard } from "./_components/headliner-card";
import { PhotoMarquees } from "./_components/photo-marquees";
import { RevealCard } from "./_components/reveal-card";
import { ScrollStrokeDoodle } from "./_components/scroll-stroke-doodle";
import { TickerStrip } from "./_components/ticker-strip";

type Props = { params: Promise<{ locale: Locale }> };

type Headliner = {
  name: string;
  hour: string;
  day: "friday" | "saturday" | "sunday";
  imgSrc: string;
};

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

  // Mirror the line-up page's TBA logic: only show artists whose `showFrom`
  // date has passed and that belong to this edition, then pad to 3 with TBA
  // placeholder cards so the row is always visually complete.

  // Server components re-execute per request, so reading the clock at render
  // is safe — react-hooks/purity targets re-rendering client components.
  // eslint-disable-next-line react-hooks/purity
  const today = Date.now();

  const visibleHeadliners: Headliner[] = artistsData
    .filter(
      (a) =>
        new Date(a.showFrom).getTime() <= today &&
        new Date(a.showFrom).getFullYear() >= ZZ_YEAR,
    )
    .slice(0, 3)
    .map((a) => ({
      name: a.name,
      hour: a.hour,
      day: a.day as "friday" | "saturday" | "sunday",
      imgSrc: a.imgSrc,
    }));
  const headliners: Headliner[] = [
    ...visibleHeadliners,
    ...Array.from(
      { length: 3 - visibleHeadliners.length },
      (): Headliner => ({
        name: "TBA",
        hour: "",
        day: "friday",
        imgSrc: "",
      }),
    ),
  ];

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
      <section className="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-blue-900 text-white">
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
        <div className="animate-doodle-spin-slow pointer-events-none absolute -top-40 -left-40 z-0 h-80 will-change-transform md:-top-100 md:-left-100 md:h-200 lg:-top-125 lg:-left-125 lg:h-250">
          <Doodle
            shape="sun-rays"
            color="royal-yellow"
            accent="summer-red"
            rotate={-14}
            className="h-full w-full"
          />
        </div>
        <ScrollStrokeDoodle
          rotate={12}
          className="pointer-events-none absolute -right-35 -bottom-20 z-0 h-60 md:-right-45 md:-bottom-30 md:h-120"
        />
        <GradientDots
          className="-z-10 mix-blend-hard-light filter-[brightness(1.25)_saturate(1.55)_drop-shadow(0_0_1.5px_rgba(255,255,255,0.55))]"
          dotSize={2}
          spacing={6}
          colors={["#ffb600", "#ff8faa", "#193d6b", "#fee198"]}
        />
        {/* Soft centred vignette — sits between the LEDs and the
            content so the logo + location strip read on a darker
            "spotlight" while the LEDs keep glowing at the edges. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[-5]"
          style={{
            background:
              "radial-gradient(ellipse 65% 45% at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 80%)",
          }}
        />
        {/* Logo + date — vertically centered. The marquee sits flush at
            the bottom (no extra reserved padding needed). */}
        <div className="container-wide relative flex flex-1 flex-col items-center justify-center pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="relative z-30 flex flex-col items-center text-center">
            <Logo
              variant="full"
              className="w-full max-w-72 text-white md:max-w-160 xl:max-w-200"
            />

            {/* Sticker-style date stamp instead of an inline triangle row. */}
            <div className="mt-6 inline-flex items-center gap-3 md:mt-8">
              <Sticker color="brand" size="lg" rotate={-3}>
                <span className="inline-flex items-center gap-2">
                  <span>{ZZ_DATE_FRIDAY.slice(-2)}</span>
                  <Triangle className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{ZZ_DATE_SATURDAY.slice(-2)}</span>
                  <Triangle className="h-4 w-4 md:h-5 md:w-5" />
                  <span>{ZZ_DATE_SUNDAY.slice(-2)}</span>
                </span>
              </Sticker>
              <Sticker color="yellow" size="lg" rotate={3}>
                {tHome("month")} {ZZ_YEAR}
              </Sticker>
            </div>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-black tracking-[0.3em] uppercase md:text-base">
              <span aria-hidden="true">●</span>
              <span>Itterbeek · Dilbeek · BE</span>
              <span aria-hidden="true">●</span>
            </span>
          </div>
        </div>
        <div className="relative z-20">
          <PaperTear
            edge="top"
            tear={5}
            color="yellow-400"
            className="translate-y-px"
          />
          <TickerStrip
            items={tHome.raw("ticker") as string[]}
            speed={50}
            className="bg-yellow-400 text-gray-900"
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-pink-50">
        <PaperTear edge="top" tear={4} bgColor="pink-50" color="yellow-400" />
        <Doodle
          shape="cross"
          color="dimmed-led"
          accent="summer-red"
          rotate={8}
          className="absolute top-10 right-6 z-0 h-10 md:top-16 md:right-12 md:h-14"
        />

        <div className="container-wide relative z-20 py-10 md:py-12 lg:py-14">
          <CountdownHero />

          <div className="mt-8 grid items-center gap-6 md:mt-10 md:gap-8 lg:grid-cols-12 lg:gap-12">
            <FloatingPolaroid
              src="/assets/slides/slide14.webp"
              alt=""
              caption={
                <Sticker color="brand" size="sm" rotate={4}>
                  Zin in.
                </Sticker>
              }
              tilt={-2}
              float={false}
              className="mx-auto w-full max-w-44 md:max-w-48 lg:col-span-3 lg:mx-0"
            />

            <p className="text-center text-base text-gray-700 md:text-lg lg:col-span-5 lg:text-left">
              {tHome("intro.body")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 lg:col-span-4 lg:justify-end">
              <Link href="/line-up">
                <Button
                  as="span"
                  variant="brand"
                  size="lg"
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
                  size="lg"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tCommon("links.info")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          DAYS — three hand-cut cards with sticker numbers
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative bg-pink-300">
        <PaperTear edge="top" tear={2} color="pink-50" />
        {/* Big anchor in the right bleed + one tiny accent. The `eye` is
            the lone inline doodle we kept from the original set. */}
        <Doodle
          shape="eye"
          color="summer-red"
          accent="blue-cola"
          rotate={8}
          className="absolute -top-12 -left-12 h-56 w-56 md:-top-20 md:-right-24 md:left-auto md:h-80 md:w-80 lg:h-96 lg:w-96"
        />
        <Doodle
          shape="coil"
          color="blue-cola"
          rotate={-12}
          className="absolute bottom-20 left-6 hidden h-40 md:left-12 md:block md:h-40"
        />
        <div className="container-wide section-y relative z-20">
          {/* Just an eyebrow — the day cards do the talking. */}
          <div className="mb-10 flex justify-end md:mb-14 md:justify-start">
            <Sticker color="ink" size="sm" rotate={-3}>
              {tHome("programme.eyebrow")}
            </Sticker>
          </div>

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {days.map((day, i) => (
              <RevealCard key={day.date} index={i}>
                <DayCard
                  date={day.date}
                  image={day.image}
                  index={i}
                  locale={locale}
                  ctaLabel={tHome("lineup.seeDay")}
                />
              </RevealCard>
            ))}
          </div>
        </div>
        <PaperTear edge="bottom" tear={3} color="pink-300" bgColor="blue-500" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          HEADLINERS — featured artists w/ overlay sticker
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative bg-blue-500 text-white">
        {/* Big asterisk bleeding off the right + one small accent. */}
        <Doodle
          shape="asterisk"
          color="linear-sunset"
          rotate={20}
          className="absolute -top-12 -right-16 h-56 md:-top-20 md:-right-24 md:h-96 lg:h-112"
        />
        <div className="container-wide section-y relative z-20">
          {/* Single oversized poster word — context speaks for itself. */}
          <div className="mb-10 flex flex-col items-start gap-6 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
            <h2 className="text-7xl leading-[0.85] text-yellow-400 md:text-[10rem] xl:text-[14rem]">
              Line-up
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

          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {headliners.map((h, i) => (
              <RevealCard key={`${h.name}_${i}`} index={i}>
                <HeadlinerCard
                  name={h.name}
                  hour={h.hour}
                  day={h.day}
                  imgSrc={h.imgSrc}
                  date={dayDates[h.day]}
                  locale={locale}
                  tilt={headlinerTilts[i % headlinerTilts.length]}
                  tone={headlinerTones[i % headlinerTones.length]}
                  tbaLabel={tHome("lineup.tba")}
                />
              </RevealCard>
            ))}
          </div>
        </div>
        <PaperTear edge="bottom" tear={4} color="pink-50" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACTIVITIES — bento layout: paella + petanque + food + crew
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative bg-pink-50">
        {/* Big horns anchor in the right bleed + one small play accent. */}
        <Doodle
          shape="horns"
          color="royal-yellow"
          accent="summer-red"
          rotate={-8}
          className="absolute -top-12 -right-16 h-40 md:-top-20 md:-right-20 md:h-80 lg:h-96"
        />
        <Doodle
          shape="radial"
          color="royal-yellow"
          rotate={-15}
          className="absolute right-1/3 bottom-20 hidden h-15 md:block md:h-16"
        />
        <div className="container-wide section-y relative z-20">
          {/* Single oversized poster word, no sentence-y subtitle. */}
          <h2 className="text-brand-500 mb-10 text-7xl leading-[0.85] md:mb-14 md:text-9xl xl:text-[14rem]">
            Doe mee.
          </h2>

          {/* Bento */}
          <div className="grid gap-6 md:gap-8 lg:grid-cols-12">
            {/* Paella — large hero tile */}
            <article className="shadow-sticker-lg relative flex flex-col overflow-hidden border-2 border-gray-900 bg-yellow-400 lg:col-span-7 lg:row-span-2">
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
              <div className="flex grow flex-col gap-4 p-6 md:p-8">
                <h3 className="text-3xl leading-[0.95] md:text-5xl">
                  {tHome("activities.paella.title")}
                </h3>
                <p className="max-w-md flex-1 text-base md:text-lg">
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
                  className="mt-auto"
                  variant="brand"
                  size="xl"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tHome(signupDisabled ? "paellaSoon" : "paella")}
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
                  {tHome(signupDisabled ? "petanqueSoon" : "petanque")}
                </Button>
              </div>
            </article>

            {/* Crew tile */}
            <article className="shadow-sticker-lg relative overflow-hidden border-2 border-gray-900 bg-pink-300 lg:col-span-5">
              <div className="grid grid-cols-5 items-stretch">
                <div className="relative col-span-2 min-h-40 border-r-2 border-gray-900 md:min-h-50">
                  <Image
                    src="/assets/random/crew26.webp"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover object-center"
                  />
                  <div className='halftone absolute inset-0 opacity-40 mix-blend-multiply content-[""]' />
                </div>
                <div className="col-span-3 flex flex-col gap-2 p-5 md:p-6">
                  <p className="font-display text-2xl leading-[0.95] md:text-3xl">
                    {tHome("activities.crew.body")}
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
      </section>

      {/* ─────────────────────────────────────────────────────────────
          GALLERY — keep marquees, frame them like a polaroid wall
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative bg-yellow-400">
        <div className="relative isolate">
          <PaperTear
            className="absolute top-0 z-40 translate-y-[-20%]"
            edge="bottom"
            tear={5}
            color="pink-50"
          />
          <PhotoMarquees />
          <PaperTear
            className="absolute bottom-0 z-40 translate-y-[30%]"
            edge="top"
            tear={5}
            color="brand-500"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          AFTERMOVIE — untitled; the Vibes section above already sets
          the visual mood, so the video gets to speak for itself.
          ─────────────────────────────────────────────────────────────*/}
      <section className="bg-brand-500 relative text-pink-50">
        <Doodle
          shape="star"
          color="royal-yellow"
          rotate={-12}
          className="absolute right-1/4 bottom-12 hidden h-12 md:block md:h-16"
        />
        <ConsentVideo />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          NUMBERS — chunky stat stickers on a brand-orange field
          ─────────────────────────────────────────────────────────────*/}
      <section className="bg-brand-500 relative text-pink-50">
        {/* Big star anchor + one stripes accent. */}
        <Doodle
          shape="star"
          color="pink"
          rotate={10}
          className="absolute -top-12 -right-12 h-48 md:-top-16 md:-right-16 md:h-80 lg:h-96"
        />
        <Doodle
          shape="plus"
          color="royal-yellow"
          rotate={-8}
          className="absolute right-1/4 bottom-12 hidden h-10 md:block md:h-14"
        />
        <div className="container-wide section-y relative z-20">
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
                value: "10+",
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
      <section className="relative bg-pink-50">
        <Doodle
          shape="lips"
          color="80s-gum"
          className="absolute -right-20 -bottom-20 h-40 md:-right-20 md:-bottom-16 md:h-80 lg:h-96"
        />
        <Doodle
          shape="cross"
          color="tardis-blue"
          accent="summer-red"
          rotate={6}
          className="absolute top-12 right-6 h-12 md:top-20 md:right-12 md:h-16"
        />
        <div className="container-wide section-y relative z-20 grid gap-12 lg:grid-cols-12 lg:gap-16">
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
              {partnerSamples.map((p, i) => {
                const tileClass =
                  "group shadow-sticker-sm relative flex aspect-square items-center justify-center border-2 border-gray-900 bg-gray-900 p-4";
                const tileStyle = {
                  transform: `rotate(${String(((i % 4) - 1.5) * 1.5)}deg)`,
                };
                const logo = p.logoWhite ? (
                  <Image
                    src={p.logoWhite}
                    alt={p.name}
                    width={160}
                    height={120}
                    className="max-h-12 w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100 md:max-h-16"
                  />
                ) : null;
                return p.site ? (
                  <a
                    key={p.name}
                    href={p.site}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`${tileClass} transition-transform hover:-translate-y-1`}
                    style={tileStyle}
                    aria-label={p.name}
                  >
                    {logo}
                  </a>
                ) : (
                  <span
                    key={p.name}
                    className={tileClass}
                    style={tileStyle}
                    aria-label={p.name}
                  >
                    {logo}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
