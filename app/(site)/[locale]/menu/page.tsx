import { PaperTear } from "@components/paper-tear";
import { type Locale } from "@lib/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/lib/client";
import { MENU_QUERY, type MenuItem } from "@/sanity/lib/queries";

import { MenuClient } from "./_components/menu-client";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

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

export default async function MenuPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const menu = await client.fetch<MenuItem[]>(
    MENU_QUERY,
    { locale },
    { next: { tags: ["menuItem"] } },
  );

  return (
    <>
      <section className="relative bg-pink-300">
        <div className="h-16" />
      </section>
      <MenuClient
        menu={menu}
        topTear={<PaperTear edge="top" tear={2} color="pink-300" />}
        bottomTear={<PaperTear edge="bottom" tear={6} color="pink-50" />}
      />
    </>
  );
}
