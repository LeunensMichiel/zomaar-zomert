import { type Locale } from "@lib/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/lib/client";
import { SIDE_EVENT_QUERY, type SideEvent } from "@/sanity/lib/queries";

import { SideEventContent } from "../_components/side-event-content";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bike" });
  return {
    title: t("SEO.title"),
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

export default async function BikePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "bike" });

  const data = await client.fetch<SideEvent | null>(
    SIDE_EVENT_QUERY,
    { id: "zomaarBike", locale },
    { next: { tags: ["sideEvent"] } },
  );

  if (!data) return null;

  return (
    <SideEventContent
      data={data}
      variant="bike"
      labels={{
        factsEyebrow: t("labels.factsEyebrow"),
        tracks: t("labels.tracks"),
        practical: t("labels.practical"),
        gallery: t("labels.gallery"),
        signupTitle: t("labels.signupTitle"),
        signupBody: t("labels.signupBody"),
        signup: t("labels.signup"),
        signupSoon: t("labels.signupSoon"),
        backToInfo: t("labels.backToInfo"),
        gpx: {
          eyebrow: t("downloads.eyebrow"),
          heading: t("downloads.heading"),
          hint: t("downloads.hint"),
          download: t("downloads.download"),
          downloading: t("downloads.downloading"),
          retry: t("downloads.retry"),
          done: t("downloads.done"),
          error: t("downloads.error"),
          openStrava: t("downloads.openStrava"),
        },
      }}
    />
  );
}
