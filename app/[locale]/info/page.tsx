import { Doodle } from "@components/doodle";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import { Map } from "@components/ui/map";
import { type Locale } from "@lib/i18n/routing";
import { isSignupOpen, PAELLA_LINK, PETANQUE_LINK } from "@lib/models";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type ReactNode } from "react";

type Props = { params: Promise<{ locale: Locale }> };

const richBr = { br: () => <br /> };
const richStrongBr = {
  strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
  br: () => <br />,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "info" });
  return {
    title: t("SEO.title"),
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

export default async function InfoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "info" });
  const signupDisabled = !isSignupOpen();

  return (
    <>
      <section className="bg-brand-500 relative">
        <div className="container-wide relative z-20 pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <h1 className="font-display shadow-sticker-lg inline-block -rotate-2 self-start bg-gray-900 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-300 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
              {t("hero.title")}
            </h1>
            <div className="self-end">
              <Doodle
                shape="star"
                color="dimmed-led"
                rotate={-8}
                className="h-24 md:h-28 lg:h-36"
              />
            </div>
          </div>
        </div>
        <PaperTear edge="bottom" tear={6} color="pink-50" />
      </section>

      <section className="relative bg-pink-50">
        <Doodle
          shape="asterisk"
          color="tardis-blue"
          rotate={12}
          className="absolute right-6 bottom-12 hidden h-10 md:right-12 md:block md:h-14"
        />
        <div className="container-wide relative z-20 pt-12 pb-12 md:pt-16 md:pb-16">
          <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-12">
            {/* How / what / where — yellow tile, slight left-tilt */}
            <article className="shadow-sticker-lg relative -rotate-1 border-2 border-gray-900 bg-yellow-400 p-6 md:p-8 lg:col-span-7">
              <h3 className="font-display text-2xl leading-[0.95] font-bold text-gray-900 uppercase md:text-3xl">
                {t("faq.1.title")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-gray-900 md:text-lg">
                {t.rich("faq.1.content", richBr)}
              </p>
            </article>

            {/* Parking — cream tile */}
            <article className="shadow-sticker-lg relative rotate-1 border-2 border-gray-900 bg-pink-50 p-6 md:p-8 lg:col-span-5">
              <h3 className="font-display text-2xl leading-[0.95] font-bold text-gray-900 uppercase md:text-3xl">
                {t("faq.2.title")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-gray-900 md:text-lg">
                {t.rich("faq.2.content", richBr)}
              </p>
            </article>

            {/* Map tile — bordered card with venue stamp overlay */}
            <div className="relative lg:col-span-5">
              <div className="shadow-sticker-lg h-72 overflow-hidden border-2 border-gray-900 md:h-80 lg:h-full lg:min-h-96">
                <Map height="100%" />
              </div>
              <div className="absolute -top-4 -right-4 z-10">
                <Sticker color="brand" size="md" rotate={-6}>
                  {t("mapVenue")}
                </Sticker>
              </div>
            </div>

            {/* Public transport — blue tile, lots of bus numbers */}
            <article className="shadow-sticker-lg relative -rotate-1 border-2 border-gray-900 bg-blue-500 p-6 text-white md:p-8 lg:col-span-7">
              <h3 className="font-display text-2xl leading-[0.95] font-bold uppercase md:text-3xl">
                {t("faq.3.title")}
              </h3>
              <div className="mt-4 text-base leading-relaxed md:text-lg [&_strong]:text-yellow-300">
                {t.rich("faq.3.content", richStrongBr)}
              </div>
            </article>

            {/* Ecology — pink-300 tile */}
            <article className="shadow-sticker-lg relative rotate-1 border-2 border-gray-900 bg-pink-300 p-6 md:p-8 lg:col-span-4">
              <h3 className="font-display text-2xl leading-[0.95] font-bold text-gray-900 uppercase md:text-3xl">
                {t("faq.4.title")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-gray-900 md:text-lg">
                {t.rich("faq.4.content", richBr)}
              </p>
            </article>

            {/* Tickets — the loud "FREE!" tile. The title shrinks to
                an eyebrow; the meaning becomes the visual. */}
            <article className="bg-brand-500 shadow-sticker-lg relative flex -rotate-2 flex-col justify-center border-2 border-gray-900 p-6 text-white md:p-8 lg:col-span-4">
              <span className="font-display text-xs font-bold tracking-[0.2em] uppercase opacity-80 md:text-sm">
                {t("faq.5.title")}
              </span>
              <span className="font-display mt-2 text-6xl leading-[0.85] font-bold uppercase md:text-7xl xl:text-8xl">
                {t("faq.5.poster")}
              </span>
              <p className="mt-3 text-sm leading-relaxed md:text-base">
                {t("faq.5.content")}
              </p>
            </article>

            {/* Fair — title-as-poster on yellow */}
            <article className="shadow-sticker-lg relative flex rotate-2 flex-col justify-center border-2 border-gray-900 bg-yellow-400 p-6 md:p-8 lg:col-span-4">
              <span className="font-display text-5xl leading-[0.85] font-bold text-gray-900 uppercase md:text-6xl">
                {t("faq.6.title")}.
              </span>
              <p className="mt-3 text-sm leading-relaxed text-gray-900 md:text-base">
                {t("faq.6.content")}
              </p>
            </article>

            {/* Terras polaroid — tape strip on top, oversized
                bottom margin like a real polaroid, handwritten
                caption underneath. */}
            <div className="relative lg:col-span-5">
              <span
                aria-hidden="true"
                className="tape-strip absolute -top-3 left-10 z-30 h-5 w-24 -rotate-12 md:left-14"
              />
              <article className="shadow-sticker-lg relative -rotate-2 border-2 border-gray-900 bg-white p-3 pb-10 md:p-4 md:pb-14">
                <div className="relative h-64 overflow-hidden border-2 border-gray-900 md:h-72 lg:h-80">
                  <Image
                    src="/assets/random/terras.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover object-center"
                  />
                  <div
                    aria-hidden="true"
                    className="halftone pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
                  />
                </div>
                <p className="font-display mt-4 text-center text-base font-bold tracking-wide text-gray-900 uppercase md:mt-6 md:text-lg">
                  {t("bento.terrasCaption")}
                </p>
              </article>
            </div>

            {/* Vouchers — cream tile */}
            <article className="shadow-sticker-lg relative rotate-1 border-2 border-gray-900 bg-pink-50 p-6 md:p-8 lg:col-span-7">
              <h3 className="font-display text-2xl leading-[0.95] font-bold text-gray-900 uppercase md:text-3xl">
                {t("faq.7.title")}
              </h3>
              <div className="mt-4 text-base leading-relaxed text-gray-900 md:text-lg">
                {t.rich("faq.7.content", richStrongBr)}
              </div>
            </article>
          </div>
        </div>
        <PaperTear edge="bottom" tear={2} bgColor="pink-50" color="blue-500" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACTIVITIES — pulled out of the bento as the page's call to
          action. Big poster word, full activities content, two
          sticker buttons (petanque + paella) and a polaroid of
          actual pétanque on the right.
          ─────────────────────────────────────────────────────────────*/}
      <section className="relative bg-blue-500 text-white">
        <Doodle
          shape="star-burst"
          color="royal-yellow"
          rotate={20}
          className="absolute -right-12 -bottom-16 h-56 md:-right-20 md:-bottom-24 md:h-96 lg:h-112"
        />
        <Doodle
          shape="cocktail"
          color="dimmed-led"
          rotate={-6}
          className="absolute top-12 left-6 hidden h-12 md:left-12 md:block md:h-16"
        />
        <div className="container-wide section-y relative z-20 grid gap-10 md:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Sticker color="ink" size="sm" rotate={-3}>
              {t("activities.eyebrow")}
            </Sticker>
            <h2 className="mt-6 text-7xl leading-[0.85] text-yellow-400 md:mt-8 md:text-9xl xl:text-[14rem]">
              {t("activities.title")}
            </h2>
            <div className="mt-6 max-w-xl text-base leading-relaxed text-pink-50 md:text-lg [&_strong]:text-yellow-300">
              {t.rich("faq.8.content", richStrongBr)}
            </div>
            {signupDisabled && (
              <p className="mt-4 text-sm text-pink-50/80 italic md:text-base">
                {t("faq.8.tba")}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
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
                {t(signupDisabled ? "faq.8.petanqueSoon" : "faq.8.petanque")}
              </Button>
              <Button
                as="a"
                {...(!signupDisabled && {
                  href: PAELLA_LINK,
                  target: "_blank",
                  rel: "noreferrer noopener",
                })}
                disabled={signupDisabled}
                variant="brand"
                size="lg"
                sticker
                iconRight={<ChevronRight />}
              >
                {t(signupDisabled ? "faq.8.paellaSoon" : "faq.8.paella")}
              </Button>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <span
              aria-hidden="true"
              className="tape-strip absolute -top-3 left-10 z-30 h-5 w-24 -rotate-12 md:left-16"
            />
            <article className="shadow-sticker-lg relative rotate-2 border-2 border-gray-900 bg-pink-50 p-3 pb-10 md:p-4 md:pb-14">
              <div className="relative aspect-4/5 overflow-hidden border-2 border-gray-900">
                <Image
                  src="/assets/random/petanque.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="halftone pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
                />
              </div>
              <p className="font-display mt-4 text-center text-base font-bold tracking-wide text-gray-900 uppercase md:mt-6 md:text-lg">
                {t("activities.petanqueCaption")}
              </p>
            </article>
          </div>
        </div>
        <PaperTear edge="bottom" tear={3} bgColor="pink-50" color="blue-500" />
      </section>
    </>
  );
}
