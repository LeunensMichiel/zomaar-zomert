import { PaperTear } from "@components/paper-tear";
import { type Locale } from "@lib/i18n/routing";
import { ZZ_YEAR } from "@lib/models";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/lib/client";
import {
  ACTIVITIES_QUERY,
  type Activity,
  type Artist,
  ARTISTS_QUERY,
} from "@/sanity/lib/queries";

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
  const [artists, activities] = await Promise.all([
    client.fetch<Artist[]>(
      ARTISTS_QUERY,
      {
        locale,
        yearStart: `${String(ZZ_YEAR)}-01-01T00:00:00Z`,
      },
      { next: { tags: ["artist"] } },
    ),
    client.fetch<Activity[]>(
      ACTIVITIES_QUERY,
      { locale },
      { next: { tags: ["activity"] } },
    ),
  ]);
  return (
    <LineUpClient artists={artists} activities={activities}>
      {/* Bottom paper-tear bridges the dark blue section into the
          footer's photo strip. Server-rendered (PaperTear is
          server-only) and passed through as children so the client
          tree never imports it directly. */}
      <PaperTear edge="bottom" tear={6} color="pink-50" />
    </LineUpClient>
  );
}
