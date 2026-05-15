import { Doodle } from "@components/doodle";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Link } from "@lib/i18n/navigation";
import { type Locale, routing } from "@lib/i18n/routing";
import { getDateByDayString, ZZ_YEAR } from "@lib/models";
import { formatArtistName } from "@lib/utils/string-utils";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/lib/client";
import {
  type Artist,
  ARTIST_BY_SLUG_QUERY,
  ARTIST_SLUGS_QUERY,
} from "@/sanity/lib/queries";

import { ArtistBio } from "./_components/artist-bio";
import { ArtistSocials } from "./_components/artist-socials";
import { ScrollSpin } from "./_components/scroll-spin";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const revalidate = 3600;

const yearStartIso = `${String(ZZ_YEAR)}-01-01T00:00:00Z`;

async function fetchArtist(locale: Locale, slug: string) {
  return client.fetch<Artist | null>(
    ARTIST_BY_SLUG_QUERY,
    { locale, slug, yearStart: yearStartIso },
    { next: { tags: ["artist"] } },
  );
}

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(ARTIST_SLUGS_QUERY, {
    yearStart: yearStartIso,
  });
  return slugs.flatMap(({ slug }) =>
    routing.locales.map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const artist = await fetchArtist(locale, slug);
  if (!artist) return {};

  const t = await getTranslations({ locale, namespace: "line-up" });
  const dayName = new Date(getDateByDayString(artist.day)).toLocaleString(
    locale,
    { weekday: "long" },
  );
  const title = t("detail.SEO.title", { name: artist.name });
  const description = t("detail.SEO.description", {
    name: artist.name,
    day: dayName,
  });
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: artist.imgSrc ? [{ url: artist.imgSrc }] : undefined,
    },
  };
}

export default async function ArtistDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const artist = await fetchArtist(locale, slug);
  if (!artist) notFound();

  const t = await getTranslations({ locale, namespace: "line-up" });
  const date = getDateByDayString(artist.day);
  const dayName = new Date(date).toLocaleString(locale, { weekday: "long" });
  const dateLong = new Date(date).toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="overflow-x-clip">
        <section className="relative bg-blue-500">
          <div className="h-16 md:h-20 lg:h-24" />
          <PaperTear edge="bottom" tear={6} color="blue-900" />
        </section>

        <div className="relative bg-blue-900 text-pink-50">
          <div className="container-wide relative z-10 py-12 md:py-16 lg:grid lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[5fr_6fr] lg:gap-10 lg:py-16 xl:gap-14">
            {/* LEFT: back-link + info card. Sticky on lg+. DOM-first so
                mobile reads card → image → text. */}
            <aside className="relative z-10 lg:col-start-1 lg:row-span-2 lg:row-start-1">
              <div className="lg:sticky lg:top-24">
                <Link
                  href={{ pathname: "/line-up" }}
                  aria-label={t("detail.backAria")}
                  className="mb-5 inline-block transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none md:mb-6"
                >
                  <Sticker color="brand" size="sm" rotate={-3}>
                    <span aria-hidden="true" className="mr-1">
                      ←
                    </span>
                    {t("detail.back")}
                  </Sticker>
                </Link>

                <div className="relative">
                  <ScrollSpin className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square h-128 -translate-x-1/2 -translate-y-1/2 md:h-192 lg:h-160 xl:h-180">
                    <Doodle
                      shape="star-burst"
                      color="royal-yellow"
                      className="h-full w-full"
                    />
                  </ScrollSpin>
                  <article
                    className="shadow-sticker-lg relative z-10 border-2 border-gray-900 bg-yellow-400 p-6 md:p-8 lg:p-7 xl:p-9"
                    style={{ transform: "rotate(-1deg)" }}
                  >
                    <Sticker color="ink" size="md" rotate={-2} className="mb-5">
                      {dayName}
                      {artist.hour ? ` · ${artist.hour}` : ""}
                    </Sticker>

                    <h1 className="font-display text-5xl leading-[0.88] font-bold wrap-break-word text-gray-900 uppercase md:text-6xl lg:text-5xl xl:text-6xl">
                      {formatArtistName(artist.name)}
                    </h1>

                    <p className="font-display mt-4 text-sm font-bold tracking-[0.15em] text-gray-900/70 uppercase md:text-base lg:text-sm">
                      {dateLong}
                    </p>

                    {artist.socials && artist.socials.length > 0 && (
                      <ArtistSocials
                        socials={artist.socials}
                        heading={t("detail.socials")}
                      />
                    )}
                  </article>
                </div>
              </div>
            </aside>

            {/* PHOTO — column 2 row 1 on lg+. */}
            <div className="relative z-10 mt-10 lg:col-start-2 lg:row-start-1 lg:mt-0">
              <div
                className="shadow-sticker-lg relative mx-auto aspect-square w-full max-w-lg overflow-hidden border-2 border-gray-900 bg-blue-800 lg:max-w-none"
                style={{ transform: "rotate(1.5deg)" }}
              >
                {artist.imgSrc && (
                  <Image
                    src={artist.imgSrc}
                    alt={artist.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-cover object-center"
                    quality={90}
                  />
                )}
              </div>
            </div>

            {/* BIO — column 2 row 2 on lg+. */}
            <main className="relative z-10 mt-12 lg:col-start-2 lg:row-start-2 lg:mt-12">
              <ArtistBio bio={artist.bio} fallback={t("detail.bioFallback")} />

              <div className="mt-14 md:mt-20">
                <Link
                  href={{ pathname: "/line-up" }}
                  aria-label={t("detail.backAria")}
                  className="inline-block transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none"
                >
                  <Sticker color="brand" size="md" rotate={-2}>
                    <span aria-hidden="true" className="mr-1">
                      ←
                    </span>
                    {t("detail.back")}
                  </Sticker>
                </Link>
              </div>
            </main>
          </div>
        </div>
        <PaperTear edge="top" tear={2} color="blue-900" />
      </div>
    </>
  );
}
