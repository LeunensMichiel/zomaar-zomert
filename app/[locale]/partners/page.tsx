import { Doodle } from "@components/doodle";
import { FitText } from "@components/fit-text";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import partnersData from "@lib/data/partners.json";
import { getPathname } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

const LEAD_TILT = [-1.5, 1.2, -0.8, 1.5, -1.2, 0.9, -1.6, 1.3] as const;

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

  const visible = partnersData.filter((p) => !p.disabled);
  const lead = visible
    .filter((p) => p.formula === 1)
    .sort((a, b) => a.name.localeCompare(b.name));
  const support = visible
    .filter((p) => p.formula !== 1)
    .sort((a, b) => a.formula - b.formula || a.name.localeCompare(b.name));

  return (
    <>
      <section className="bg-brand-900 relative overflow-hidden">
        <Doodle
          shape="sun-rays"
          color="royal-yellow"
          accent="summer-red"
          className="animate-doodle-spin-slow pointer-events-none absolute -top-32 -left-32 aspect-square h-80 sm:-top-40 sm:-left-40 sm:h-110 md:-top-48 md:-left-48 md:h-140 lg:-top-56 lg:-left-56 lg:h-180"
        />
        <Doodle
          shape="plus"
          color="dimmed-led"
          rotate={20}
          className="pointer-events-none absolute top-32 right-6 hidden h-10 md:right-12 md:block md:h-12"
        />
        <div className="container-wide relative z-20 pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="flex justify-end">
            <h1 className="font-display shadow-sticker-lg inline-block -rotate-2 bg-yellow-400 px-5 py-2 text-5xl leading-[0.9] font-bold text-blue-900 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
              {t("hero.title")}
            </h1>
          </div>
          <p className="mt-6 max-w-2xl text-base text-pink-50 md:mt-10 md:text-lg">
            {t("hero.intro")}
          </p>
        </div>
      </section>

      <section className="bg-brand-500 relative text-pink-50">
        <PaperTear edge="top" tear={6} color="brand-900" />
        <Doodle
          shape="cocktail"
          color="linear-sunset"
          rotate={20}
          className="pointer-events-none absolute -right-12 -bottom-16 hidden h-56 md:-right-20 md:-bottom-20 md:block md:h-80 lg:h-96"
        />
        <div className="container-wide relative z-20 pt-16 pb-16 md:pt-20 md:pb-20">
          <Sticker color="brand" size="lg" rotate={-3}>
            {t("lead.eyebrow")}
          </Sticker>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {lead.map((p, i) => (
              <LeadPartnerCard
                key={p.name}
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
                <SupportPartnerLogo key={p.name} partner={p} />
              ))}
            </div>
          </div>
        </div>
        <PaperTear edge="bottom" tear={6} color="pink-50" />
      </section>

      <section className="relative bg-pink-50">
        <Doodle
          shape="cross"
          color="linear-red"
          rotate={-8}
          className="pointer-events-none absolute -bottom-8 -left-6 hidden h-40 md:-bottom-12 md:-left-10 md:block md:h-64 lg:h-80"
        />
        <div className="container-wide relative z-20 pt-12 pb-16 md:pt-16 md:pb-20">
          <div className="grid gap-10 md:gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
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

            <ul className="grid content-start gap-4 md:gap-5 lg:col-span-5">
              {(["1", "2", "3"] as const).map((key, i) => (
                <li
                  key={key}
                  className="shadow-sticker-lg relative flex items-start gap-4 border-2 border-gray-900 bg-yellow-400 p-5 md:gap-5 md:p-6"
                  style={{
                    transform: `rotate(${String(i % 2 === 0 ? -1 : 1)}deg)`,
                  }}
                >
                  <span className="font-display shadow-sticker-sm flex h-10 w-10 shrink-0 items-center justify-center border-2 border-gray-900 bg-gray-900 text-base font-bold text-yellow-300 md:h-12 md:w-12 md:text-lg">
                    {key}
                  </span>
                  <p className="font-display text-base leading-tight font-bold text-gray-900 uppercase md:text-lg">
                    {t(`become.perks.${key}`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <PaperTear edge="bottom" tear={6} color="pink-50" />
      </section>
    </>
  );
}

type Partner = (typeof partnersData)[number];

function LeadPartnerCard({
  partner,
  tilt,
}: {
  partner: Partner;
  tilt: number;
}) {
  const Wrapper = partner.site ? "a" : "div";
  return (
    <Wrapper
      {...(partner.site && {
        href: partner.site,
        target: "_blank",
        rel: "noreferrer noopener",
      })}
      className="shadow-sticker-lg relative flex aspect-4/3 items-center justify-center border-2 border-gray-900 bg-gray-900 p-8 transition-transform hover:-translate-y-1 hover:rotate-0 md:p-10"
      style={{ transform: `rotate(${String(tilt)}deg)` }}
    >
      <div
        aria-hidden="true"
        className="halftone pointer-events-none absolute inset-0 opacity-20 mix-blend-screen"
      />
      {partner.logoWhite ? (
        <Image
          src={partner.logoWhite}
          alt={partner.name}
          width={400}
          height={300}
          quality={100}
          className="relative h-full w-full object-contain"
        />
      ) : (
        <FitText
          text={partner.name}
          className="font-display relative leading-none text-white"
        />
      )}
    </Wrapper>
  );
}

function SupportPartnerLogo({ partner }: { partner: Partner }) {
  const Wrapper = partner.site ? "a" : "div";
  return (
    <Wrapper
      {...(partner.site && {
        href: partner.site,
        target: "_blank",
        rel: "noreferrer noopener",
      })}
      className="flex aspect-4/3 items-center justify-center p-3 opacity-70 transition-opacity hover:opacity-100"
    >
      {partner.logoWhite ? (
        <Image
          src={partner.logoWhite}
          alt={partner.name}
          width={240}
          height={120}
          quality={100}
          className="h-full w-full object-contain"
        />
      ) : (
        <FitText
          text={partner.name}
          className="font-display text-sm leading-none text-white"
        />
      )}
    </Wrapper>
  );
}
