import artistsData from "@lib/data/artists.json";
import { type Locale } from "@lib/i18n/routing";
import { type APIArtist, type Artist } from "@lib/models";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LineUpClient } from "./_components/line-up-client";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "line-up" });
  return {
    title: t("SEO.title"),
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

const loadArtists = (locale: Locale): Artist[] =>
  (artistsData as APIArtist[]).map(({ description, ...artist }) => ({
    ...artist,
    description: description[locale],
  }));

export default async function LineUpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const artists = loadArtists(locale);
  return <LineUpClient artists={artists} />;
}
