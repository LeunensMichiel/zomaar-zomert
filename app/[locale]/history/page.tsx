import { Doodle } from "@components/doodle";
import { ScrollBg } from "@components/scroll-bg";
import { Sticker } from "@components/sticker";
import { Timeline } from "@components/ui/timeline";
import { type Locale } from "@lib/i18n/routing";
import { ZZ_YEAR } from "@lib/models";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Warm wave through the milestones:
// cream → soft yellow → hot pink → soft yellow → cream.
const HISTORY_BG_COLORS = [
  "#fff1f7", // pink-50    (cream — 1998)
  "#fee198", // yellow-100 (dimmed-led — early years)
  "#ff9bb6", // pink-300   (growth)
  "#fee198", // yellow-100 (covid pause)
  "#fff1f7", // pink-50    (current)
];

type Props = { params: Promise<{ locale: Locale }> };

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

  return (
    <ScrollBg colors={HISTORY_BG_COLORS}>
      <Doodle
        shape="flame"
        rotate={-12}
        className="absolute -right-12 -bottom-16 h-40 md:-right-20 md:-bottom-24 md:h-72 lg:h-96"
      />
      <Doodle
        shape="cross"
        color="tardis-blue"
        accent="summer-red"
        rotate={8}
        className="absolute top-12 right-6 hidden h-12 md:top-20 md:right-12 md:block md:h-16"
      />
      <div className="container-wide relative z-20 pt-6 pb-20 md:pt-8 md:pb-28">
        {/* Hero — chunky block, fourth variation in the per-page
            header rotation. Yellow-on-tardis-blue + -rotate-1 + LEFT
            keeps it in step with /info, /contact, /line-up while
            still being distinct. Banner doodle on the right balances
            the composition. */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12">
          <h1 className="font-display shadow-sticker-lg inline-block -rotate-1 self-start bg-blue-900 px-5 py-2 text-5xl leading-[0.9] font-bold text-yellow-400 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
            {t("hero.title")}
          </h1>
          <div className="self-end">
            <Doodle
              shape="banner"
              color="summer-red"
              rotate={6}
              className="h-20 md:h-28 lg:h-32"
            />
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-base text-gray-700 md:mt-10 md:text-lg">
          {t("hero.intro")}
        </p>

        <Timeline
          data={[
            {
              title: "1998",
              content: (
                <MilestoneContent
                  label={t("origin.label")}
                  stickerColor="ink"
                  stickerRotate={-3}
                  body={t("origin.body")}
                  extra={
                    <PosterCard
                      src="/assets/affiches/first_edition.webp"
                      alt="Zomaar Zomert eerste editie poster"
                      eyebrow={t("posters.firstEdition")}
                      year="'98"
                      tilt={-2}
                    />
                  }
                />
              ),
            },
            {
              title: "2003",
              content: (
                <MilestoneContent
                  label={t("earlyYears.label")}
                  stickerColor="yellow"
                  stickerRotate={2}
                  body={t("earlyYears.body")}
                  extra={
                    <PhotoPair
                      photos={[
                        { src: "/assets/slides/slide1.webp", tilt: -2 },
                        { src: "/assets/slides/slide5.webp", tilt: 2 },
                      ]}
                    />
                  }
                />
              ),
            },
            {
              title: "2012",
              content: (
                <MilestoneContent
                  label={t("growth.label")}
                  stickerColor="brand"
                  stickerRotate={3}
                  body={t("growth.body")}
                  extra={
                    <PhotoPair
                      photos={[
                        { src: "/assets/slides/slide10.webp", tilt: 2 },
                        { src: "/assets/slides/slide15.webp", tilt: -2 },
                      ]}
                    />
                  }
                />
              ),
            },
            {
              title: "2020",
              content: (
                <MilestoneContent
                  label={t("covid.label")}
                  stickerColor="ink"
                  stickerRotate={-2}
                  body={t("covid.body")}
                />
              ),
            },
            {
              title: String(ZZ_YEAR),
              content: (
                <MilestoneContent
                  label={t("now.label")}
                  stickerColor="brand"
                  stickerRotate={-3}
                  body={t("now.body")}
                  extra={
                    <PhotoPair
                      photos={[
                        { src: "/assets/slides/slide25.webp", tilt: -2 },
                        { src: "/assets/slides/slide28.webp", tilt: 2 },
                      ]}
                    />
                  }
                />
              ),
            },
          ]}
        />

        {/* Closing crew portrait — pulled out of the 2012 entry so
            it can read as a centerpiece. Wide bordered card with
            tape strips on the corners + a brand-coloured caption
            sticker, slight tilt to keep it scrapbook-y. */}
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
                src="/assets/random/crew26.webp"
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
    </ScrollBg>
  );
}

type StickerColor = "ink" | "brand" | "yellow";

function MilestoneContent({
  label,
  stickerColor,
  stickerRotate,
  body,
  extra,
}: {
  label: string;
  stickerColor: StickerColor;
  stickerRotate: number;
  body: string;
  extra?: React.ReactNode;
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
      {extra}
    </div>
  );
}

/**
 * Vertical poster card used for 1998's `first_edition.webp`. 3:4
 * aspect (matches the source image), bordered + halftoned, slight
 * tilt + tape strip top, with a `Eerste editie '98` sticker stamp at
 * the corner. Drop in another `<PosterCard>` per future scanned
 * affiche.
 */
function PosterCard({
  src,
  alt,
  eyebrow,
  year,
  tilt = 0,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  year: string;
  tilt?: number;
}) {
  return (
    <div className="relative mt-2 max-w-65">
      <span
        aria-hidden="true"
        className="tape-strip absolute -top-3 left-12 z-30 h-5 w-20 -rotate-6"
      />
      <article
        className="shadow-sticker-lg relative aspect-3/4 overflow-hidden border-2 border-gray-900"
        style={{ transform: `rotate(${String(tilt)}deg)` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 60vw, 260px"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="halftone pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply"
        />
      </article>
      <div className="absolute -top-3 -right-3 z-20">
        <Sticker color="brand" size="sm" rotate={-6}>
          {eyebrow} {year}
        </Sticker>
      </div>
    </div>
  );
}

/**
 * Two small festival photos arranged as a tilted pair. Each photo is
 * a bordered + halftoned card; alternating tilts make the pair read
 * as a couple of snapshots tossed onto a scrapbook page rather than
 * a tidy gallery row. Stacks vertically on mobile, side-by-side on
 * sm+.
 */
function PhotoPair({ photos }: { photos: { src: string; tilt: number }[] }) {
  return (
    <div className="mt-2 grid gap-4 sm:grid-cols-2 md:gap-5">
      {photos.map((photo) => (
        <div
          key={photo.src}
          className="relative max-w-xs"
          style={{ transform: `rotate(${String(photo.tilt)}deg)` }}
        >
          <div className="shadow-sticker-lg relative aspect-3/2 overflow-hidden border-2 border-gray-900">
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 280px"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="halftone pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
