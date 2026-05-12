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
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <section className="bg-brand-500 relative overflow-hidden">
        <Doodle
          shape="stripes"
          color="royal-yellow"
          rotate={-8}
          className="absolute top-3 z-2 h-auto w-140 lg:w-250"
        />
        <div className="container-wide relative z-20 pt-24 pb-16 md:pt-32 md:pb-20">
          {/* The email replaces the page-name headline. The page's
              purpose IS the email; the small eyebrow keeps the wayfinding. */}
          <div className="flex flex-col items-end gap-3">
            <Sticker color="yellow" size="sm" rotate={-3}>
              {tCommon("links.contact")}
            </Sticker>
            <a
              href={`mailto:${EMAIL}`}
              aria-label={t("hero.title")}
              className="font-display shadow-sticker-lg z-5 inline-block rotate-2 bg-gray-900 px-5 py-2 text-3xl leading-[0.9] font-bold tracking-tight text-yellow-400 lowercase transition-transform hover:-translate-y-1 hover:rotate-0 hover:text-yellow-300 focus-visible:-translate-y-1 focus-visible:rotate-0 focus-visible:text-yellow-300 focus-visible:outline-none md:px-7 md:py-3 md:text-5xl xl:text-6xl"
            >
              {EMAIL}
            </a>
          </div>
        </div>
        <PaperTear edge="bottom" tear={7} color="pink-50" />
      </section>

      <section className="relative bg-pink-50">
        <Doodle
          shape="flame"
          rotate={12}
          color="radial-red"
          className="absolute -bottom-10 -left-8 hidden h-24 md:-bottom-12 md:-left-12 md:block md:h-44 lg:h-64"
        />
        <div className="container-wide relative z-20 pt-12 pb-12 md:pt-16 md:pb-16">
          <div className="grid gap-8 md:gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Form column — body line + email link as quick context
              above the form. No eyebrow sticker; the chunky header
              row above already identifies the page. */}
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
                <Sticker color="yellow" size="md" rotate={-6}>
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
