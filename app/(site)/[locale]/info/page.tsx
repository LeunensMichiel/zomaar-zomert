import { Doodle } from "@components/doodle";
import { InfoBlock } from "@components/info-block";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import { type Locale } from "@lib/i18n/routing";
import { isSignupOpen } from "@lib/models";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { client } from "@/sanity/lib/client";
import {
  ASSETS_BY_TAGS_QUERY,
  INFO_BLOCKS_QUERY,
  type InfoBlock as InfoBlockData,
  SITE_SETTINGS_QUERY,
  type SiteSettings,
  type TaggedAsset,
} from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

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

  const [photos, settings, blocks] = await Promise.all([
    client.fetch<TaggedAsset[]>(ASSETS_BY_TAGS_QUERY, { tags: ["petanque"] }),
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
  const petanquePhoto = photos.find((p) => p.tags.includes("petanque"));

  return (
    <>
      <section className="bg-brand-500 relative">
        <div className="h-16 md:h-20 lg:h-24" />
        <PaperTear edge="bottom" tear={1} color="pink-50" />
      </section>

      <section className="relative bg-pink-50">
        <Doodle
          shape="asterisk"
          color="tardis-blue"
          rotate={12}
          className="absolute right-2 -bottom-20 h-40 md:right-12 md:-bottom-100 md:h-240"
        />
        <div className="container-wide relative z-20 pt-8 pb-12 md:pt-10 md:pb-16">
          <h1 className="font-display shadow-sticker-lg inline-block -rotate-2 bg-gray-900 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-300 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
            {t("hero.title")}
          </h1>
          <div className="mt-8 grid grid-flow-dense gap-4 md:mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-12">
            {blocks.map((block, index) => (
              <InfoBlock key={block._id} block={block} index={index} />
            ))}
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
                {t(signupDisabled ? "faq.8.petanqueSoon" : "faq.8.petanque")}
              </Button>
              <Button
                as="a"
                {...(!signupDisabled &&
                  settings?.paellaSignupUrl && {
                    href: settings.paellaSignupUrl,
                    target: "_blank",
                    rel: "noreferrer noopener",
                  })}
                disabled={signupDisabled || !settings?.paellaSignupUrl}
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
                  src={petanquePhoto?.url ?? ""}
                  alt={petanquePhoto?.alt ?? ""}
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
