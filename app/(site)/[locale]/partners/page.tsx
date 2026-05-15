import { Doodle } from "@components/doodle";
import { FitText } from "@components/fit-text";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import { getPathname } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import { cn } from "@lib/utils";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/lib/client";
import { type Partner, PARTNERS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

const LEAD_TILT = [-1.5, 1.2, -0.8, 1.5, -1.2, 0.9, -1.6, 1.3] as const;

const PERK_KINDS = ["terrain", "online", "extras"] as const;
type PerkKind = (typeof PERK_KINDS)[number];

const PERK_VARIANTS: Record<
  PerkKind,
  {
    card: string;
    stickerColor: "brand" | "yellow" | "ink";
    tilt: number;
  }
> = {
  terrain: {
    card: "bg-yellow-400 text-gray-900",
    stickerColor: "brand",
    tilt: -1.5,
  },
  online: {
    card: "bg-blue-500 text-pink-50",
    stickerColor: "yellow",
    tilt: 1.2,
  },
  extras: {
    card: "bg-pink-300 text-gray-900",
    stickerColor: "ink",
    tilt: -0.8,
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partners" });
  return {
    title: t("SEO.title"),
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partners" });

  const contactHref = getPathname({ locale, href: "/contact" });

  const partners = await client.fetch<Partner[]>(
    PARTNERS_QUERY,
    {},
    { next: { tags: ["partner"] } },
  );

  const lead = partners.filter((p) => p.tier === 1);
  const support = partners.filter((p) => p.tier !== 1);

  return (
    <>
      <section className="bg-80s-gum relative">
        <div className="h-16" />
        <PaperTear edge="bottom" tear={2} color="blue-500" />
      </section>

      <section className="relative bg-blue-500 text-pink-50">
        <Doodle
          shape="cocktail"
          color="linear-sunset"
          rotate={20}
          className="pointer-events-none absolute -right-12 -bottom-16 hidden h-56 md:-right-20 md:-bottom-20 md:block md:h-80 lg:h-96"
        />
        <div className="container-wide relative z-20 pt-8 pb-16 md:pt-10 md:pb-20">
          <h1 className="font-display shadow-sticker-lg inline-block -rotate-2 bg-gray-950 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-400 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-pink-50 md:mt-8 md:text-lg">
            {t("hero.intro")}
          </p>
          <div className="mt-10 md:mt-14">
            <Sticker color="brand" size="lg" rotate={-3}>
              {t("lead.eyebrow")}
            </Sticker>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {lead.map((p, i) => (
              <LeadPartnerCard
                key={p._id}
                partner={p}
                tilt={LEAD_TILT[i % LEAD_TILT.length]}
              />
            ))}
          </div>

          <div className="mt-16 md:mt-20">
            <div className="mb-6 flex items-center gap-4 md:mb-8">
              <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
              <Sticker color="ink" size="sm" shape="tag" rotate={-2}>
                {t("support.eyebrow")}
              </Sticker>
              <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
              {support.map((p) => (
                <SupportPartnerLogo key={p._id} partner={p} />
              ))}
            </div>
          </div>
        </div>
        <PaperTear edge="bottom" tear={6} color="pink-50" />
      </section>

      <section className="relative bg-pink-50">
        <Doodle
          shape="cross"
          color="royal-yellow"
          rotate={-8}
          className="pointer-events-none absolute -bottom-8 -left-6 hidden h-40 md:-bottom-12 md:-left-10 md:block md:h-64 lg:h-80"
        />
        <Doodle
          shape="plus"
          color="summer-red"
          rotate={20}
          className="pointer-events-none absolute top-10 right-4 z-10 h-9 md:top-16 md:right-12 md:h-14"
        />
        <div className="container-wide relative z-20 pt-12 pb-16 md:pt-16 md:pb-20">
          <div className="max-w-4xl">
            <Sticker color="ink" size="sm" rotate={-3}>
              {t("become.eyebrow")}
            </Sticker>
            <h2 className="text-brand-500 mt-6 text-7xl leading-[0.85] md:mt-8 md:text-9xl xl:text-[12rem]">
              {t("become.title")}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-900 md:text-lg">
              {t("become.body")}
            </p>
            <div className="mt-8 md:mt-10">
              <Button
                as="a"
                href={contactHref}
                variant="brand"
                size="lg"
                sticker
                iconRight={<ChevronRight />}
              >
                {t("become.cta")}
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 md:mt-20 md:gap-10 lg:grid-cols-3">
            {PERK_KINDS.map((kind) => (
              <PerkCard
                key={kind}
                kind={kind}
                label={t(`become.perks.${kind}.label`)}
                items={t.raw(`become.perks.${kind}.items`) as string[]}
              />
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-base leading-relaxed text-gray-900 md:mt-16 md:text-lg">
            {t("become.closing")}
          </p>
        </div>
        <PaperTear edge="bottom" tear={6} color="pink-50" />
      </section>
    </>
  );
}

function PartnerLogo({ partner }: { partner: Partner }) {
  const url = partner.logo?.asset?.url;
  const dims = partner.logo?.asset?.metadata.dimensions;
  if (!url || !dims) return null;
  return (
    <Image
      src={url}
      alt={partner.logo?.alt ?? partner.name}
      width={dims.width}
      height={dims.height}
      unoptimized
      className="h-full w-full object-contain"
    />
  );
}

function LeadPartnerCard({
  partner,
  tilt,
}: {
  partner: Partner;
  tilt: number;
}) {
  const Wrapper = partner.website ? "a" : "div";
  return (
    <Wrapper
      {...(partner.website && {
        href: partner.website,
        target: "_blank",
        rel: "noreferrer noopener",
      })}
      className="shadow-sticker-lg bg-linear-sunset relative flex aspect-4/3 items-center justify-center border-2 border-gray-900 p-8 transition-transform hover:-translate-y-1 hover:rotate-0 md:p-10"
      style={{ transform: `rotate(${String(tilt)}deg)` }}
    >
      <div
        aria-hidden="true"
        className="halftone pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
      />
      {partner.logo ? (
        <PartnerLogo partner={partner} />
      ) : (
        <FitText
          text={partner.name}
          className="font-display relative leading-none text-white"
        />
      )}
    </Wrapper>
  );
}

function PerkCard({
  kind,
  label,
  items,
}: {
  kind: PerkKind;
  label: string;
  items: string[];
}) {
  const v = PERK_VARIANTS[kind];
  return (
    <article
      className={cn(
        "shadow-sticker-lg relative flex flex-col border-2 border-gray-900 p-6 md:p-7",
        v.card,
      )}
      style={{ transform: `rotate(${String(v.tilt)}deg)` }}
    >
      {kind === "terrain" && (
        <Doodle
          shape="sun-rays"
          color="summer-red"
          accent="ink"
          rotate={-12}
          className="pointer-events-none absolute -top-7 -right-6 h-14 md:-top-9 md:-right-8 md:h-20"
        />
      )}
      {kind === "online" && (
        <Doodle
          shape="zz"
          color="royal-yellow"
          rotate={-6}
          className="pointer-events-none absolute -top-6 -right-5 h-12 md:-top-8 md:-right-7 md:h-16"
        />
      )}
      {kind === "extras" && (
        <Doodle
          shape="cocktail"
          color="summer-red"
          rotate={10}
          className="pointer-events-none absolute -top-7 -right-5 h-14 md:-top-9 md:-right-7 md:h-20"
        />
      )}
      <Sticker
        color={v.stickerColor}
        size="md"
        rotate={-2}
        className="self-start"
      >
        {label}
      </Sticker>
      <ul className="mt-6 space-y-3 md:mt-8 md:space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2 h-2.5 w-2.5 shrink-0 rotate-45 bg-current md:mt-2.5"
            />
            <span className="text-base leading-snug md:text-lg">{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SupportPartnerLogo({ partner }: { partner: Partner }) {
  const Wrapper = partner.website ? "a" : "div";
  return (
    <Wrapper
      {...(partner.website && {
        href: partner.website,
        target: "_blank",
        rel: "noreferrer noopener",
      })}
      className="flex aspect-4/3 items-center justify-center p-3 opacity-70 transition-opacity hover:opacity-100"
    >
      {partner.logo ? (
        <PartnerLogo partner={partner} />
      ) : (
        <FitText
          text={partner.name}
          className="font-display text-sm leading-none text-white"
        />
      )}
    </Wrapper>
  );
}
