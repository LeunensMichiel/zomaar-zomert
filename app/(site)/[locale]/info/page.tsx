import { Doodle } from "@components/doodle";
import { InfoBlock } from "@components/info-block";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import { Link } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import { isSignupEnabled } from "@lib/models";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/lib/client";
import {
  INFO_BLOCKS_QUERY,
  type InfoBlock as InfoBlockData,
  SITE_SETTINGS_QUERY,
  type SiteSettings,
} from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

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
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const [settings, blocks] = await Promise.all([
    client.fetch<SiteSettings | null>(
      SITE_SETTINGS_QUERY,
      { locale },
      { next: { tags: ["siteSettings"] } },
    ),
    client.fetch<InfoBlockData[]>(
      INFO_BLOCKS_QUERY,
      { locale },
      { next: { tags: ["infoBlock"] } },
    ),
  ]);
  const paellaDisabled =
    !isSignupEnabled(settings?.paellaSignupEnabledFrom) ||
    !settings?.paellaSignupUrl;
  const petanqueOpen =
    isSignupEnabled(settings?.petanqueSignupEnabledFrom) &&
    !!settings?.petanqueSignupUrl;
  const petanqueFull = petanqueOpen && (settings.petanqueFull ?? false);
  const petanqueDisabled = !petanqueOpen || petanqueFull;
  const petanquePrice = settings?.petanquePrice || "€10";
  const quizPrice = settings?.quizPrice || "€20";

  return (
    <>
      <section className="bg-brand-500 relative">
        <div className="h-12 md:h-16 lg:h-20" />
        <PaperTear edge="bottom" tear={1} color="pink-50" />
      </section>

      <section className="relative bg-pink-50">
        <Doodle
          shape="asterisk"
          color="tardis-blue"
          rotate={12}
          className="absolute right-2 -bottom-20 h-40 md:right-12 md:-bottom-100 md:h-240"
        />
        <div className="container-wide relative z-20 pt-2 pb-12 md:pb-16">
          <h1 className="font-display shadow-sticker-lg inline-block -rotate-2 bg-gray-900 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-300 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
            {t("hero.title")}
          </h1>
          <div className="mt-8 grid grid-flow-dense gap-4 md:mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-12">
            {blocks.map((block, index) => (
              <InfoBlock
                key={block._id}
                block={block}
                index={index}
                mapsLabel={tCommon("openInMaps")}
              />
            ))}
          </div>
        </div>
        <PaperTear edge="bottom" tear={2} bgColor="pink-50" color="blue-500" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACTIVITIES — the page's call to action. Big poster word, a
          short intro, then a card per side-event. Zomaar Bike + Zomaar
          Run lead with a link to their own pages; paella, petanque and
          quiz stay brief.
          ─────────────────────────────────────────────────────────────*/}
      <section
        id="activiteiten"
        className="relative scroll-mt-24 bg-blue-500 text-white md:scroll-mt-28"
      >
        <Doodle
          shape="star-burst"
          color="royal-yellow"
          rotate={20}
          className="absolute -right-12 -bottom-16 h-56 md:-right-20 md:-bottom-24 md:h-96 lg:h-112"
        />
        <div className="container-wide section-y relative z-20">
          <div className="max-w-2xl">
            <Sticker color="ink" size="sm" rotate={-3}>
              {t("activities.eyebrow")}
            </Sticker>
            <h2 className="mt-6 text-6xl leading-[0.85] text-yellow-400 md:mt-8 md:text-8xl xl:text-9xl">
              {t("activities.title")}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-pink-50 md:text-lg">
              {t("activities.intro")}
            </p>
          </div>

          {/* Bike + Run — the two events with their own pages. */}
          <div className="mt-10 grid gap-4 md:mt-12 md:gap-6 lg:grid-cols-2">
            {(["bike", "run"] as const).map((key) => (
              <article
                key={key}
                className="shadow-sticker flex h-full flex-col border-2 border-gray-900 bg-pink-50 p-6 text-gray-900 md:p-8"
              >
                <span className="font-display text-xs font-bold tracking-wider text-blue-700 uppercase md:text-sm">
                  {t(`activities.cards.${key}.day`)}
                </span>
                <h3 className="font-display mt-2 text-3xl leading-[0.95] font-bold uppercase md:text-4xl">
                  {t(`activities.cards.${key}.title`)}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed md:text-base">
                  {t(`activities.cards.${key}.body`)}
                </p>
                <Link href={key === "bike" ? "/bike" : "/run"} className="mt-6">
                  <Button
                    variant="sky"
                    size="lg"
                    sticker
                    iconRight={<ChevronRight />}
                  >
                    {t("activities.cards.readMore")}
                  </Button>
                </Link>
              </article>
            ))}
          </div>

          {/* Paella, petanque, quiz — brief, no separate pages. */}
          <div className="mt-6 grid gap-4 md:mt-6 md:gap-6 lg:grid-cols-3">
            <article className="shadow-sticker flex h-full flex-col border-2 border-gray-900 bg-pink-50 p-5 text-gray-900 md:p-6">
              <span className="font-display text-xs font-bold tracking-wider text-blue-700 uppercase md:text-sm">
                {t("activities.cards.paella.day")}
              </span>
              <h3 className="font-display mt-2 text-2xl leading-[0.95] font-bold uppercase md:text-3xl">
                {t("activities.cards.paella.title")}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed md:text-base">
                {t("activities.cards.paella.body")}
              </p>
              <Button
                as="a"
                {...(!paellaDisabled &&
                  settings.paellaSignupUrl && {
                    href: settings.paellaSignupUrl,
                    target: "_blank",
                    rel: "noreferrer noopener",
                  })}
                disabled={paellaDisabled}
                className="mt-5"
                variant="brand"
                size="sm"
                sticker
                iconRight={<ChevronRight />}
              >
                {t(
                  paellaDisabled
                    ? "activities.cards.paella.soon"
                    : "activities.cards.paella.cta",
                )}
              </Button>
            </article>

            <article className="shadow-sticker flex h-full flex-col border-2 border-gray-900 bg-pink-50 p-5 text-gray-900 md:p-6">
              <span className="font-display text-xs font-bold tracking-wider text-blue-700 uppercase md:text-sm">
                {t("activities.cards.petanque.day")}
              </span>
              <h3 className="font-display mt-2 text-2xl leading-[0.95] font-bold uppercase md:text-3xl">
                {t("activities.cards.petanque.title")}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed md:text-base">
                {t("activities.cards.petanque.body", { price: petanquePrice })}
              </p>
              <Button
                as="a"
                {...(!petanqueDisabled &&
                  settings.petanqueSignupUrl && {
                    href: settings.petanqueSignupUrl,
                    target: "_blank",
                    rel: "noreferrer noopener",
                  })}
                disabled={petanqueDisabled}
                className="mt-5"
                variant="brand"
                size="sm"
                sticker
                iconRight={<ChevronRight />}
              >
                {t(
                  petanqueFull
                    ? "activities.cards.petanque.full"
                    : petanqueDisabled
                      ? "activities.cards.petanque.soon"
                      : "activities.cards.petanque.cta",
                )}
              </Button>
            </article>

            <article className="shadow-sticker flex h-full flex-col border-2 border-gray-900 bg-pink-50 p-5 text-gray-900 md:p-6">
              <span className="font-display text-xs font-bold tracking-wider text-blue-700 uppercase md:text-sm">
                {t("activities.cards.quiz.day")}
              </span>
              <h3 className="font-display mt-2 text-2xl leading-[0.95] font-bold uppercase md:text-3xl">
                {t("activities.cards.quiz.title")}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed md:text-base">
                {t("activities.cards.quiz.body", { price: quizPrice })}
              </p>
            </article>
          </div>
        </div>
        <PaperTear edge="bottom" tear={3} bgColor="pink-50" color="blue-500" />
      </section>
    </>
  );
}
