import { Doodle } from "@components/doodle";
import { PaperTear } from "@components/paper-tear";
import menuData from "@lib/data/menu.json";
import { type Locale } from "@lib/i18n/routing";
import { type APIMenuItem, type MenuItem } from "@lib/models";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { MenuClient } from "./_components/menu-client";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "menu" });
  return {
    title: t("SEO.title"),
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

const loadMenu = (locale: Locale): MenuItem[] =>
  (menuData as APIMenuItem[]).map(
    ({ name, description, subCategory, ...menuitem }) => ({
      ...menuitem,
      name: name[locale],
      description: description[locale],
      subCategory: subCategory[locale],
    }),
  );

export default async function MenuPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "menu" });
  const menu = loadMenu(locale);

  return (
    <>
      <section className="relative bg-blue-500">
        <Doodle
          shape="coil"
          rotate={12}
          className="pointer-events-none absolute -bottom-12 -left-12 hidden h-56 md:-bottom-16 md:-left-20 md:block md:h-80 lg:h-96"
        />
        <Doodle
          shape="plus"
          color="dimmed-led"
          rotate={20}
          className="pointer-events-none absolute top-32 right-6 hidden h-10 md:right-12 md:block md:h-12"
        />
        <div className="container-wide relative z-20 pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="order-2 self-start md:order-1">
              <Doodle
                shape="cocktail"
                color="summer-red"
                rotate={-8}
                className="h-24 md:h-28 lg:h-36"
              />
            </div>
            <h1 className="font-display shadow-sticker-lg bg-brand-500 order-1 inline-block rotate-2 self-end px-5 py-2 text-5xl leading-[0.9] font-bold text-yellow-400 uppercase md:order-2 md:px-7 md:py-3 md:text-7xl xl:text-8xl">
              {t("hero.title")}
            </h1>
          </div>
        </div>
      </section>

      <MenuClient
        menu={menu}
        topTear={<PaperTear edge="top" tear={2} color="blue-500" />}
        bottomTear={<PaperTear edge="bottom" tear={6} color="pink-50" />}
      />
    </>
  );
}
