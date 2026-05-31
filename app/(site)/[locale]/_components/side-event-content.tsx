import { Doodle, type DoodleColor, type DoodleShape } from "@components/doodle";
import { PaperTear } from "@components/paper-tear";
import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import { Link } from "@lib/i18n/navigation";
import { isSignupEnabled } from "@lib/models";
import { cn } from "@lib/utils";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Euro,
  Info,
  MapPin,
  Route,
} from "lucide-react";
import Image from "next/image";
import { type ComponentType } from "react";

import { type SideEvent, type SideEventFactIcon } from "@/sanity/lib/queries";

import { RevealCard } from "./reveal-card";

export type SideEventVariant = "run" | "bike";

type Labels = {
  factsEyebrow: string;
  tracks: string;
  practical: string;
  gallery: string;
  signupTitle: string;
  signupBody: string;
  signup: string;
  signupSoon: string;
  backToInfo: string;
};

type VariantStyle = {
  heroBg: string;
  heroIntro: string;
  block: string;
  eyebrow: "yellow" | "ink" | "pink" | "blue";
  ctaBanner: string;
  heroDoodle: { shape: DoodleShape; color: DoodleColor; accent?: DoodleColor };
  scatterDoodle: { shape: DoodleShape; color: DoodleColor };
};

const VARIANTS: Record<SideEventVariant, VariantStyle> = {
  bike: {
    heroBg: "bg-blue-900",
    heroIntro: "text-blue-50",
    block: "rotate-1 bg-yellow-400 text-gray-900",
    eyebrow: "yellow",
    ctaBanner: "bg-brand-500",
    heroDoodle: { shape: "coil", color: "royal-yellow" },
    scatterDoodle: { shape: "flame", color: "linear-sunset" },
  },
  run: {
    heroBg: "bg-brand-500",
    heroIntro: "text-pink-50",
    block: "-rotate-2 bg-gray-900 text-yellow-400",
    eyebrow: "ink",
    ctaBanner: "bg-blue-500",
    heroDoodle: { shape: "sun-rays", color: "royal-yellow" },
    scatterDoodle: { shape: "flame", color: "linear-sunset" },
  },
};

const FACT_ICON: Record<
  SideEventFactIcon,
  ComponentType<{ className?: string }>
> = {
  distance: Route,
  clock: Clock,
  location: MapPin,
  euro: Euro,
  info: Info,
};

// Colored sticker tiles cycle through this palette so the facts strip
// reads as a paper-cut sticker pack rather than a uniform grid.
const FACT_TONES = [
  "bg-blue-500 text-white",
  "bg-yellow-400 text-gray-900",
  "bg-pink-300 text-gray-900",
  "bg-gray-900 text-white",
];

const TRACK_TONES = ["bg-yellow-400 text-gray-900", "bg-blue-500 text-white"];
const GALLERY_TILTS = [-2, 1.5, -1, 2, -1.5, 1];

type Props = {
  data: SideEvent;
  variant: SideEventVariant;
  labels: Labels;
};

export function SideEventContent({ data, variant, labels }: Props) {
  const v = VARIANTS[variant];
  const facts = data.facts ?? [];
  const tracks = data.tracks ?? [];
  const sections = data.sections ?? [];
  const gallery = (data.gallery ?? []).filter((g) => g.url);

  const signupReady = isSignupEnabled(data.signupEnabledFrom);
  const signupDisabled = !signupReady || !data.signupUrl;

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        className={cn(
          "relative isolate overflow-hidden",
          v.heroBg,
          "text-white",
        )}
      >
        <Doodle
          shape={v.heroDoodle.shape}
          color={v.heroDoodle.color}
          accent={v.heroDoodle.accent}
          rotate={-12}
          className="pointer-events-none absolute -top-10 -right-12 h-56 opacity-80 md:-right-16 md:h-96 lg:h-112"
        />
        <div className="container-wide relative z-10 pt-28 pb-16 md:pt-32 md:pb-24">
          <Link
            href="/info"
            className="font-display inline-flex items-center gap-2 text-xs font-bold tracking-wider text-white/70 uppercase transition-colors hover:text-white md:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {labels.backToInfo}
          </Link>

          <div className="mt-8 grid items-center gap-10 md:mt-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <div className="flex flex-col items-start gap-0">
                {data.heroEyebrow && (
                  <Sticker color={v.eyebrow} size="sm" rotate={-3}>
                    {data.heroEyebrow}
                  </Sticker>
                )}
                <h1
                  className={cn(
                    "font-display shadow-sticker-lg mt-6 inline-block px-5 py-2 text-5xl leading-[0.9] font-bold uppercase md:mt-8 md:px-7 md:py-3 md:text-7xl xl:text-8xl",
                    v.block,
                  )}
                >
                  {data.heroTitle}
                </h1>
              </div>
              {data.intro && (
                <p
                  className={cn(
                    "mt-12 max-w-xl text-base leading-relaxed whitespace-pre-line md:text-lg",
                    v.heroIntro,
                  )}
                >
                  {data.intro}
                </p>
              )}
            </div>

            {data.heroImage?.url && (
              <div className="mx-auto w-full max-w-xl lg:col-span-6 lg:max-w-none">
                <div
                  className="shadow-sticker-lg relative aspect-4/3 overflow-hidden border-2 border-gray-900"
                  style={{
                    transform: `rotate(${variant === "bike" ? "2" : "-2"}deg)`,
                  }}
                >
                  <Image
                    src={data.heroImage.url}
                    alt={data.heroImage.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 720px"
                    priority
                    placeholder={data.heroImage.lqip ? "blur" : undefined}
                    blurDataURL={data.heroImage.lqip ?? undefined}
                    className="object-cover object-center"
                  />
                  <div
                    aria-hidden
                    className="halftone pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <PaperTear edge="bottom" tear={2} color="pink-50" />
      </section>

      {/* ── CONTENT (paper) ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-pink-50">
        <Doodle
          shape={v.scatterDoodle.shape}
          color={v.scatterDoodle.color}
          rotate={14}
          className="pointer-events-none absolute top-160 -right-16 hidden h-72 opacity-90 md:block lg:h-96"
        />
        <div className="container-wide section-y relative z-10 pt-4">
          {/* QUICK FACTS */}
          {facts.length > 0 && (
            <div>
              <Sticker color="ink" size="sm" rotate={-3}>
                {labels.factsEyebrow}
              </Sticker>
              <div className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:grid-cols-4 md:gap-6">
                {facts.map((fact, i) => {
                  const Icon = FACT_ICON[fact.icon];
                  return (
                    <RevealCard key={`${fact.label}-${i}`} index={i}>
                      <div
                        className={cn(
                          "shadow-sticker flex h-full flex-col border-2 border-gray-900 p-5 md:p-6",
                          FACT_TONES[i % FACT_TONES.length],
                        )}
                      >
                        <Icon className="h-7 w-7 md:h-8 md:w-8" />
                        <p className="font-display mt-4 text-xs font-bold tracking-wider uppercase opacity-80 md:text-sm">
                          {fact.label}
                        </p>
                        <p className="font-display mt-1 text-xl leading-[0.95] font-bold md:text-2xl xl:text-3xl">
                          {fact.value}
                        </p>
                      </div>
                    </RevealCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* DISTANCES / PARCOURS */}
          {tracks.length > 0 && (
            <div className="mt-16 md:mt-24">
              <Sticker color="brand" size="sm" rotate={2}>
                {labels.tracks}
              </Sticker>
              <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 md:gap-8">
                {tracks.map((track, i) => (
                  <RevealCard key={`${track.name}-${i}`} index={i}>
                    <article
                      className={cn(
                        "shadow-sticker-lg flex h-full flex-col border-2 border-gray-900 p-6 md:p-8",
                        TRACK_TONES[i % TRACK_TONES.length],
                      )}
                    >
                      {track.distance && (
                        <span className="font-display shadow-sticker-sm inline-block -rotate-2 self-start border-2 border-gray-900 bg-pink-50 px-3 py-1 text-sm font-bold tracking-wide text-gray-900 uppercase md:text-base">
                          {track.distance}
                        </span>
                      )}
                      <h3 className="font-display mt-5 text-3xl leading-[0.95] font-bold uppercase md:text-5xl">
                        {track.name}
                      </h3>
                      {track.body && (
                        <p className="mt-4 text-sm leading-relaxed whitespace-pre-line md:text-base">
                          {track.body}
                        </p>
                      )}
                    </article>
                  </RevealCard>
                ))}
              </div>
            </div>
          )}

          {/* TEXT SECTIONS + PRACTICAL */}
          {(sections.length > 0 || data.practicalNote) && (
            <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 md:gap-12">
              {sections.map((section, i) => (
                <div key={`${section.title}-${i}`} className="max-w-prose">
                  <h2 className="font-display text-2xl leading-[0.95] font-bold text-gray-900 uppercase md:text-3xl">
                    {section.title}
                  </h2>
                  {section.body && (
                    <p className="mt-4 text-base leading-relaxed whitespace-pre-line text-gray-700 md:text-lg">
                      {section.body}
                    </p>
                  )}
                </div>
              ))}
              {data.practicalNote && (
                <div className="shadow-sticker self-start border-2 border-gray-900 bg-white p-6 md:p-8">
                  <Sticker color="yellow" size="xs" rotate={-2}>
                    {labels.practical}
                  </Sticker>
                  <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-gray-800 md:text-base">
                    {data.practicalNote}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SIGNUP CTA — anchored banner so the call to action doesn't
              float in the whitespace below the text columns. */}
          <div className="mt-16 md:mt-24">
            <div
              className={cn(
                "shadow-sticker-lg relative isolate overflow-hidden border-2 border-gray-900 px-6 py-10 text-white md:px-12 md:py-14",
                v.ctaBanner,
              )}
            >
              <Doodle
                shape={v.heroDoodle.shape}
                color="royal-yellow"
                rotate={-18}
                className="pointer-events-none absolute -right-10 -bottom-12 h-44 opacity-30 md:-right-6 md:h-64"
              />
              <div className="relative z-10 flex flex-col items-start gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
                <div className="max-w-xl">
                  <h2 className="font-display text-3xl leading-[0.95] font-bold text-yellow-300 uppercase md:text-5xl">
                    {labels.signupTitle}
                  </h2>
                  <p className="mt-3 text-base text-white/85 md:text-lg">
                    {labels.signupBody}
                  </p>
                </div>
                <Button
                  as="a"
                  {...(!signupDisabled &&
                    data.signupUrl && {
                      href: data.signupUrl,
                      target: "_blank",
                      rel: "noreferrer noopener",
                    })}
                  disabled={signupDisabled}
                  variant="accent"
                  size="2xl"
                  sticker
                  iconRight={<ChevronRight />}
                  className="w-full shrink-0 md:w-auto"
                >
                  {signupDisabled ? labels.signupSoon : labels.signup}
                </Button>
              </div>
            </div>
          </div>

          {/* GALLERY */}
          {gallery.length > 0 && (
            <div className="mt-16 md:mt-24">
              <Sticker color="blue" size="sm" rotate={-2}>
                {labels.gallery}
              </Sticker>
              <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-3 md:gap-6">
                {gallery.map((img, i) => (
                  <RevealCard key={`${img.url ?? "img"}-${i}`} index={i}>
                    <figure
                      className="shadow-sticker border-2 border-gray-900 bg-white p-2 md:p-3"
                      style={{
                        transform: `rotate(${String(GALLERY_TILTS[i % GALLERY_TILTS.length])}deg)`,
                      }}
                    >
                      <div className="relative aspect-4/3 overflow-hidden border-2 border-gray-900">
                        <Image
                          src={img.url ?? ""}
                          alt={img.alt}
                          fill
                          sizes="(max-width: 768px) 50vw, 30vw"
                          placeholder={img.lqip ? "blur" : undefined}
                          blurDataURL={img.lqip ?? undefined}
                          className="object-cover object-center"
                        />
                        <div
                          aria-hidden
                          className="halftone pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
                        />
                      </div>
                    </figure>
                  </RevealCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
