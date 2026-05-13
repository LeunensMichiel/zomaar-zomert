import { Doodle } from "@components/doodle";
import { Form } from "@components/form";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Map } from "@components/ui/map";
import { type Locale } from "@lib/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

const EMAIL = "info@zomaarzomert.be";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("SEO.title"),
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      <section className="bg-brand-500 relative">
        <div className="h-16 md:h-20 lg:h-24" />
        <PaperTear edge="bottom" tear={4} color="pink-50" />
      </section>
      <section className="relative">
        <Doodle
          shape="radial"
          rotate={12}
          color="linear-sunset"
          className="absolute -bottom-10 -left-8 hidden h-24 md:-bottom-12 md:-left-12 md:block md:h-44 lg:h-80"
        />
        <div className="container-wide relative z-20 pt-8 pb-12 md:pt-10 md:pb-16">
          <h1 className="font-display shadow-sticker-lg inline-block rotate-2 bg-gray-900 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-300 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
            {t("hero.title")}
          </h1>
          <div className="mt-8 grid gap-8 md:mt-10 md:gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="max-w-xl text-base text-gray-700 md:text-lg">
                {t("hero.body")}
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="font-display hover:text-brand-500 focus-visible:text-brand-500 mt-4 inline-block text-xl font-bold tracking-tight text-gray-900 underline decoration-2 underline-offset-[6px] transition-colors md:text-2xl"
              >
                {EMAIL}
              </a>

              <div className="shadow-sticker-lg mt-8 border-2 border-gray-900 bg-yellow-400 p-6 md:mt-10 md:p-8">
                <Form />
              </div>
            </div>

            {/* Map fills the right column. On lg the map stretches to
              match the left column's height (grid items-stretch); on
              smaller screens it's a fixed-height card below the form.
              Single venue sticker overlay reads as a postmark. */}
            <div className="relative lg:col-span-5">
              <div className="shadow-sticker-lg h-72 overflow-hidden border-2 border-gray-900 md:h-96 lg:h-full lg:min-h-112">
                <Map height="100%" />
              </div>
              <div className="absolute -top-4 -right-4 z-10">
                <Sticker color="ink" size="md" rotate={-6}>
                  {t("mapCard.venue")}
                </Sticker>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
