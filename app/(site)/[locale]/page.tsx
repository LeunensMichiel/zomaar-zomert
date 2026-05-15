import { Doodle } from "@components/doodle";
import { GrainOverlay } from "@components/grain-overlay";
import { HotGradient } from "@components/hot-gradient";
import { Triangle } from "@components/icons/triangle";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import { Logo } from "@components/ui/logo";
import { Link } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import {
  isSignupOpen,
  ZZ_DATE_FRIDAY,
  ZZ_DATE_SATURDAY,
  ZZ_DATE_SUNDAY,
  ZZ_YEAR,
} from "@lib/models";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/lib/client";
import {
  ASSETS_BY_TAGS_QUERY,
  FEATURED_PARTNERS_QUERY,
  type Headliner,
  HEADLINER_ARTISTS_QUERY,
  type Partner,
  SITE_SETTINGS_QUERY,
  type SiteSettings,
  type TaggedAsset,
} from "@/sanity/lib/queries";

import { ConsentVideo } from "./_components/consent-video";
import { CountdownHero } from "./_components/countdown-hero";
import { DayMiniCard } from "./_components/day-mini-card";
import { HeadlinerCard } from "./_components/headliner-card";
import { PhotoMarquees } from "./_components/photo-marquees";
import { RevealCard } from "./_components/reveal-card";
import { TickerStrip } from "./_components/ticker-strip";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

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

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tHome = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const signupDisabled = !isSignupOpen();

  const visibleHeadliners = await client.fetch<Headliner[]>(
    HEADLINER_ARTISTS_QUERY,
    {
      locale,
      yearStart: `${String(ZZ_YEAR)}-01-01T00:00:00Z`,
    },
    { next: { tags: ["artist"] } },
  );
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

  const partnerSamples = await client.fetch<Partner[]>(
    FEATURED_PARTNERS_QUERY,
    {},
    { next: { tags: ["partner"] } },
  );

  const settings = await client.fetch<SiteSettings | null>(
    SITE_SETTINGS_QUERY,
    { locale },
    { next: { tags: ["siteSettings"] } },
  );

  const photoTags = [
    "slideshow",
    "paella",
    "petanque",
    "crew",
    "friday",
    "saturday",
    "sunday",
  ];
  const photos = await client.fetch<TaggedAsset[]>(ASSETS_BY_TAGS_QUERY, {
    tags: photoTags,
  });
  const photoByTag = (tag: string) => photos.find((p) => p.tags.includes(tag));
  // Marquee renders two strips of six photos with a client-side shuffle.
  // Limit the pool to keep the JSON payload light — 24 is more than
  // enough variety for the slice(0,6) / slice(-6) picks.
  const slideshowAssets = photos
    .filter((p) => p.tags.includes("slideshow"))
    .slice(0, 24);
  const foodPhoto = photoByTag("paella");
  const petanquePhoto = photoByTag("petanque");
  const crewPhoto = photoByTag("crew");
  const days: Array<{ date: string; image: string; alt: string }> = [
    {
      date: ZZ_DATE_FRIDAY,
      image: photoByTag("friday")?.url ?? "",
      alt: photoByTag("friday")?.alt ?? "",
    },
    {
      date: ZZ_DATE_SATURDAY,
      image: photoByTag("saturday")?.url ?? "",
      alt: photoByTag("saturday")?.alt ?? "",
    },
    {
      date: ZZ_DATE_SUNDAY,
      image: photoByTag("sunday")?.url ?? "",
      alt: photoByTag("sunday")?.alt ?? "",
    },
  ];

  return (
    <>
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
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <HotGradient className="opacity-50" />
          <div className="bg-brand-500 animate-hero-blob-a absolute -bottom-1/4 -left-1/5 h-[75vh] w-[75vh] rounded-full mix-blend-screen blur-2xl md:h-[100vh] md:w-[100vh] md:blur-3xl" />
          <div className="animate-hero-blob-b absolute -top-1/4 -right-1/5 h-[60vh] w-[60vh] rounded-full bg-pink-400 mix-blend-screen blur-2xl md:h-[85vh] md:w-[85vh] md:blur-3xl" />
          <div className="animate-hero-blob-c absolute -right-1/4 -bottom-1/5 h-[50vh] w-[50vh] rounded-full bg-yellow-400 mix-blend-screen blur-2xl md:top-1/4 md:right-auto md:bottom-auto md:-left-1/5 md:h-[70vh] md:w-[70vh] md:blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2">
            <div className="animate-hero-star-drift h-full w-full">
              <div className="animate-doodle-spin-slow h-full w-full opacity-50 mix-blend-overlay blur-lg md:blur-xl">
                <Doodle
                  shape="star-burst"
                  color="dimmed-led"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
          <GrainOverlay />
        </div>

        <div className="container-wide relative flex flex-1 flex-col items-center justify-center pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="relative z-30 flex flex-col items-center text-center">
            <Logo
              variant="full"
              className="w-full max-w-72 text-white md:max-w-160 xl:max-w-200"
            />

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
            items={settings?.marqueeItems?.map((i) => i.value) ?? []}
            speed={50}
            className="bg-yellow-400 text-gray-900"
          />
        </div>
      </section>

      <section className="relative bg-blue-500 text-white">
        <PaperTear edge="top" tear={4} color="yellow-400" bgColor="blue-500" />
        <Doodle
          shape="asterisk"
          color="linear-sunset"
          rotate={20}
          className="absolute -top-4 -right-40 h-80 md:-top-12 md:-right-24 md:h-96 lg:h-112"
        />
        <Doodle
          shape="coil"
          color="royal-yellow"
          rotate={-12}
          className="absolute bottom-32 left-6 hidden h-32 md:left-12 md:block md:h-40"
        />
        <div className="container-wide section-y relative z-20">
          <div className="mb-10 flex flex-col items-start gap-6 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
            <h2 className="text-7xl leading-[0.85] text-yellow-400 md:text-[10rem] xl:text-[14rem]">
              {tHome("lineup.heading")}
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
                  slug={h.slug}
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

          <div className="mt-14 flex items-center gap-4 md:mt-20 md:gap-6">
            <Sticker color="ink" size="sm" rotate={-3}>
              {tHome("programme.eyebrow")}
            </Sticker>
            <span aria-hidden="true" className="bg-linear-sunset h-px flex-1" />
          </div>
          <div className="mt-6 grid gap-5 md:mt-8 md:grid-cols-3 md:gap-6">
            {days.map((day, i) => (
              <RevealCard key={day.date} index={i}>
                <DayMiniCard
                  date={day.date}
                  image={day.image}
                  index={i}
                  locale={locale}
                />
              </RevealCard>
            ))}
          </div>
        </div>
        <PaperTear edge="bottom" tear={4} color="pink-50" />
      </section>

      <section className="relative overflow-hidden bg-pink-50">
        <Doodle
          shape="horns"
          color="royal-yellow"
          accent="summer-red"
          rotate={-12}
          className="hidden"
        />
        <Doodle
          shape="radial"
          color="royal-yellow"
          rotate={-15}
          className="absolute -bottom-10 left-1/6 hidden h-100 md:block"
        />
        <div className="container-wide section-y relative z-20 pt-3 md:pt-12">
          <CountdownHero />
          <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t-2 border-gray-900/10 pt-8 md:mt-14 md:flex-row md:gap-10 md:pt-10 lg:grid-cols-12 lg:gap-12">
            <p className="text-base text-gray-700 md:text-lg lg:col-span-7 lg:max-w-2xl">
              {tHome("intro.body")}
            </p>
            <Link href="/info" className="w-full md:w-auto">
              <Button
                variant="brand"
                size="xl"
                fullWidth
                sticker
                iconRight={<ChevronRight />}
              >
                {tCommon("links.info")}
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:mt-16 md:gap-8 lg:grid-cols-12">
            <article className="shadow-sticker-lg relative flex flex-col overflow-hidden border-2 border-gray-900 bg-yellow-400 lg:col-span-7 lg:row-span-2">
              <div className="relative aspect-16/10 overflow-hidden border-b-2 border-gray-900">
                <Image
                  src={foodPhoto?.url ?? ""}
                  alt={foodPhoto?.alt ?? ""}
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
                  {...(!signupDisabled &&
                    settings?.paellaSignupUrl && {
                      href: settings.paellaSignupUrl,
                      target: "_blank",
                      rel: "noreferrer noopener",
                    })}
                  disabled={signupDisabled || !settings?.paellaSignupUrl}
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

            <article className="shadow-sticker-lg relative overflow-hidden border-2 border-gray-900 bg-blue-500 text-white lg:col-span-5">
              <div className="relative aspect-5/4 overflow-hidden border-b-2 border-gray-900">
                <Image
                  src={petanquePhoto?.url ?? ""}
                  alt={petanquePhoto?.alt ?? ""}
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
                  {...(!signupDisabled &&
                    settings?.petanqueSignupUrl && {
                      href: settings.petanqueSignupUrl,
                      target: "_blank",
                      rel: "noreferrer noopener",
                    })}
                  disabled={signupDisabled || !settings?.petanqueSignupUrl}
                  variant="accent"
                  size="lg"
                  sticker
                  iconRight={<ChevronRight />}
                >
                  {tHome(signupDisabled ? "petanqueSoon" : "petanque")}
                </Button>
              </div>
            </article>

            <article className="shadow-sticker-lg relative overflow-hidden border-2 border-gray-900 bg-pink-300 lg:col-span-5">
              <div className="grid grid-cols-5 items-stretch">
                <div className="relative col-span-2 min-h-40 border-r-2 border-gray-900 md:min-h-50">
                  <Image
                    src={crewPhoto?.url ?? ""}
                    alt={crewPhoto?.alt ?? ""}
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

      <section className="relative bg-yellow-400">
        <div className="relative isolate">
          <PaperTear
            className="absolute top-0 z-40 translate-y-[-20%]"
            edge="bottom"
            tear={5}
            color="pink-50"
          />
          <PhotoMarquees
            slides={slideshowAssets.map((a) => ({
              url: a.url,
              alt: a.alt,
              lqip: a.lqip,
            }))}
          />
          <PaperTear
            className="absolute bottom-0 z-40 translate-y-[30%]"
            edge="top"
            tear={5}
            color="brand-500"
          />
        </div>
      </section>

      <section className="bg-brand-500 relative text-pink-50">
        <Doodle
          shape="star"
          color="royal-yellow"
          rotate={-12}
          className="absolute right-1/4 bottom-12 hidden h-12 md:block md:h-16"
        />
        <ConsentVideo />
      </section>

      <section className="bg-brand-500 relative text-pink-50">
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

      <section className="relative bg-pink-50">
        <Doodle
          shape="lips"
          color="80s-gum"
          className="absolute -right-20 -bottom-20 h-40 md:-right-20 md:-bottom-16 md:h-80 lg:h-96"
        />
        <Doodle
          shape="cross"
          color="pink"
          accent="summer-red"
          rotate={50}
          className="absolute -top-12 right-0 h-12 md:-top-20 md:right-20 md:h-20"
        />
        <Doodle
          shape="cross"
          color="pink"
          accent="summer-red"
          rotate={6}
          className="absolute top-12 -right-20 h-40 lg:top-0 lg:right-40 lg:h-80"
        />
        <div className="container-wide section-y relative z-20 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Sticker color="brand" size="sm" rotate={-3}>
              {tHome("partners.eyebrow")}
            </Sticker>
            <h2 className="text-brand-500 mt-4 text-7xl leading-[0.85] md:mt-6 md:text-9xl">
              {tHome("partners.heading")}
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
                const logoUrl = p.logo?.asset?.url;
                const logoDims = p.logo?.asset?.metadata.dimensions;
                const logo =
                  logoUrl && logoDims ? (
                    <Image
                      src={logoUrl}
                      alt={p.logo?.alt ?? p.name}
                      width={logoDims.width}
                      height={logoDims.height}
                      unoptimized
                      className="max-h-12 w-auto object-contain opacity-90 transition-opacity group-hover:opacity-100 md:max-h-16"
                    />
                  ) : null;
                return p.website ? (
                  <a
                    key={p._id}
                    href={p.website}
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
                    key={p._id}
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
