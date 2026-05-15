import { HistoryImage } from "@components/history-image";
import { PaperTear } from "@components/paper-tear";
import { ScrollBg } from "@components/scroll-bg";
import { Sticker } from "@components/sticker";
import { Timeline } from "@components/ui/timeline";
import { type Locale } from "@lib/i18n/routing";
import { ZZ_YEAR } from "@lib/models";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { client } from "@/sanity/lib/client";
import {
  ASSETS_BY_TAGS_QUERY,
  HISTORY_ENTRIES_QUERY,
  type HistoryEntry,
  type TaggedAsset,
} from "@/sanity/lib/queries";

// Warm wave through the milestones:
// cream → soft yellow → hot pink → soft yellow → cream.
const HISTORY_BG_COLORS = [
  "#fff1f7", // pink-50    (cream — 1998)
  "#fee198", // yellow-100 (dimmed-led — early years)
  "#ff9bb6", // pink-300   (growth)
  "#fee198", // yellow-100 (covid pause)
  "#fff1f7", // pink-50    (current)
];

type StickerColor = "ink" | "brand" | "yellow";
const STICKER_COLORS: StickerColor[] = ["ink", "yellow", "brand"];
const STICKER_ROTATIONS = [-3, 2, 3, -2, -3];

// Keyed by historyEntry._id. Each entry here gets rendered alongside the
// Sanity-managed images for that entry. Use for one-off React content
// that doesn't fit the polaroid/affiche/normal mould — illustrated
// doodles, embedded videos, special call-outs.
//
// Example:
//   "historyEntry.2026": (
//     <Doodle shape="cross" color="royal-yellow" rotate={8} className="h-12" />
//   ),
const HISTORY_ENTRY_EXTRAS: Record<string, ReactNode> = {};

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "history" });
  return {
    title: t("SEO.title"),
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "history" });

  const yearStamp = `'${String(ZZ_YEAR).slice(-2)}`;

  const [photos, entries] = await Promise.all([
    client.fetch<TaggedAsset[]>(ASSETS_BY_TAGS_QUERY, { tags: ["crew"] }),
    client.fetch<HistoryEntry[]>(
      HISTORY_ENTRIES_QUERY,
      { locale },
      { next: { tags: ["historyEntry"] } },
    ),
  ]);
  const crewPhoto = photos.find((p) => p.tags.includes("crew"));

  return (
    <>
      <section className="relative bg-blue-900">
        <div className="h-16" />
      </section>
      <ScrollBg colors={HISTORY_BG_COLORS}>
        <PaperTear edge="top" tear={2} color="blue-900" />
        <div className="container-wide relative z-20 pt-8 pb-20 md:pt-10 md:pb-28">
          <h1 className="font-display shadow-sticker-lg inline-block -rotate-1 bg-gray-950 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-400 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-gray-900 md:mt-8 md:text-lg">
            {t("hero.intro")}
          </p>
          <Timeline
            data={entries.map((entry, index) => {
              const stickerColor =
                STICKER_COLORS[index % STICKER_COLORS.length];
              const stickerRotate =
                STICKER_ROTATIONS[index % STICKER_ROTATIONS.length];
              return {
                title: entry.year,
                content: (
                  <MilestoneContent
                    label={entry.label}
                    stickerColor={stickerColor}
                    stickerRotate={stickerRotate}
                    body={entry.body}
                    images={entry.images ?? []}
                    extra={HISTORY_ENTRY_EXTRAS[entry._id]}
                  />
                ),
              };
            })}
          />

          {/* Closing crew portrait — pulled out of the timeline entries so
            it can read as a centerpiece. Wide bordered card with tape
            strips on the corners + a brand-coloured caption sticker,
            slight tilt to keep it scrapbook-y. */}
          <div className="relative mx-auto mt-20 max-w-5xl md:mt-32">
            <span
              aria-hidden="true"
              className="tape-strip absolute -top-3 left-12 z-30 h-5 w-28 -rotate-6"
            />
            <span
              aria-hidden="true"
              className="tape-strip absolute -top-2 right-16 z-30 h-5 w-24 rotate-6"
            />
            <div className="shadow-sticker-lg relative -rotate-1 overflow-hidden border-2 border-gray-900">
              <div className="relative aspect-3/2">
                <Image
                  src={crewPhoto?.url ?? ""}
                  alt={t("crew.caption")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="halftone pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
                />
              </div>
            </div>
            <div className="absolute right-4 -bottom-6 z-20 md:right-12 md:-bottom-8">
              <Sticker color="brand" size="lg" rotate={-6}>
                {t("crew.caption")} ZZ {yearStamp}
              </Sticker>
            </div>
          </div>
        </div>
        <PaperTear edge="bottom" tear={6} color="pink-50" />
      </ScrollBg>
    </>
  );
}

function MilestoneContent({
  label,
  stickerColor,
  stickerRotate,
  body,
  images,
  extra,
}: {
  label: string;
  stickerColor: StickerColor;
  stickerRotate: number;
  body: string;
  images: HistoryEntry["images"] extends infer T ? NonNullable<T> : never;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div>
        <Sticker color={stickerColor} size="md" rotate={stickerRotate}>
          {label}
        </Sticker>
      </div>
      <p className="max-w-2xl text-base leading-relaxed text-gray-900 md:text-lg">
        {body}
      </p>
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
          {images.map((image, i) => (
            <HistoryImage key={image.key} image={image} index={i} />
          ))}
        </div>
      )}
      {extra}
    </div>
  );
}
