import { PaperTear } from "@components/paper-tear";
import { loadArtists } from "@lib/data/artists";
import { type Locale } from "@lib/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LineUpClient } from "./_components/line-up-client";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

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

export default async function LineUpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const artists = loadArtists(locale);
  return (
    <LineUpClient artists={artists}>
      {/* Bottom paper-tear bridges the dark blue section into the
          footer's photo strip. Server-rendered (PaperTear is
          server-only) and passed through as children so the client
          tree never imports it directly. */}
      <PaperTear edge="bottom" tear={6} color="pink-50" />
    </LineUpClient>
  );
}
