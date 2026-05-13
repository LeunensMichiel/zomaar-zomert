import { Doodle } from "@components/doodle";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { type Locale } from "@lib/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title") };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });

  const blocks = ["block1", "block2", "block3", "block4", "block5"] as const;

  return (
    <>
      <section className="relative bg-gray-900">
        <div className="h-16 md:h-20 lg:h-24" />
        <PaperTear edge="bottom" tear={1} color="pink-50" />
      </section>

      <section className="relative bg-pink-50">
        <Doodle
          shape="cross"
          color="summer-red"
          accent="dimmed-led"
          rotate={-6}
          className="pointer-events-none absolute -top-2 right-6 hidden h-10 md:right-12 md:block md:h-14"
        />
        <Doodle
          shape="plus"
          color="blue-cola"
          rotate={12}
          className="pointer-events-none absolute -bottom-4 left-6 hidden h-10 md:left-12 md:block md:h-12"
        />
        <div className="container-wide relative z-20 pt-8 pb-20 md:pt-10 md:pb-28">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display shadow-sticker-lg inline-block rotate-3 bg-gray-900 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-300 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-base text-gray-900 md:mt-8 md:text-lg">
              {t("hero.intro")}
            </p>
            <div className="mt-10 md:mt-12">
              <Sticker color="ink" size="sm" rotate={-2}>
                {t("eyebrow")}
              </Sticker>
            </div>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-gray-900 md:mt-10 md:space-y-8 md:text-lg">
              {blocks.map((key) => (
                <p key={key}>{t(key)}</p>
              ))}
            </div>
          </div>
        </div>
        <PaperTear edge="bottom" tear={6} color="pink-50" />
      </section>
    </>
  );
}
