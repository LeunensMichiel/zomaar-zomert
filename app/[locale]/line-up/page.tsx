import fsPromises from "node:fs/promises";
import path from "node:path";

import { type Locale } from "@lib/i18n/routing";
import { type APIArtist, type Artist } from "@lib/models";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import LineUpClient from "./_components/line-up-client";

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

const loadArtists = async (locale: Locale): Promise<Artist[]> => {
  const filePath = path.join(process.cwd(), "public/data.json");
  const jsonData = await fsPromises.readFile(filePath, "utf-8");
  const apiArtists = JSON.parse(jsonData) as APIArtist[];
  return apiArtists.map(({ description, ...artist }) => ({
    ...artist,
    description: description[locale],
  }));
};

export default async function LineUpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const artists = await loadArtists(locale);
  return (
    <Suspense>
      <LineUpClient artists={artists} />
    </Suspense>
  );
}
