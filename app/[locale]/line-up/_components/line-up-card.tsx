"use client";

import { ArtistModalContent } from "@components/artist-modal";
import { Sticker } from "@components/sticker";
import { Dialog, DialogContent } from "@components/ui/dialog";
import { type Artist } from "@lib/models";
import { cn } from "@lib/utils";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useState } from "react";

import { TBACard } from "../../_components/tba-card";

type Tone = "blue" | "brand" | "pink";

type Props = {
  artist: Artist;
  date: string;
  tone: Tone;
  tilt?: number;
  tbaLabel: string;
};

const toneClass: Record<Tone, string> = {
  blue: "bg-blue-500 text-white",
  brand: "bg-brand-500 text-white",
  pink: "bg-pink-300 text-gray-900",
};

const cardFrame =
  "group relative block w-full border-2 border-gray-900 shadow-sticker md:shadow-sticker-lg text-left";

export function LineUpArtistCard({
  artist,
  date,
  tone,
  tilt = 0,
  tbaLabel,
}: Props) {
  const lang = useLocale();
  const [open, setOpen] = useState(false);
  const isTBA = artist.name === "TBA";
  const style = { transform: `rotate(${String(tilt)}deg)` };

  if (isTBA) {
    return <TBACard tone={tone} tilt={tilt} tbaLabel={tbaLabel} size="md" />;
  }

  const dayLabel = new Date(date).toLocaleString(lang, { weekday: "long" });
  // Short weekday for mobile so the day/hour sticker fits on one line
  // inside the narrow card. Strips the trailing period nl/fr add.
  const shortDayLabel = new Date(date)
    .toLocaleString(lang, { weekday: "short" })
    .replace(/\.$/, "");

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
        className={cn(
          cardFrame,
          toneClass[tone],
          "cursor-pointer transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none",
        )}
        style={style}
      >
        <div className='before:halftone relative aspect-4/5 overflow-hidden border-b-2 border-gray-900 before:absolute before:inset-0 before:z-10 before:opacity-60 before:mix-blend-multiply before:content-[""]'>
          <Image
            src={artist.imgSrc}
            alt={artist.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 left-2 z-20 md:top-3 md:left-3">
            {/* Smaller padding + text on mobile so the sticker covers
                less of the artist's face. Size "sm" defaults restore
                from md: onwards. */}
            <Sticker
              color="ink"
              size="sm"
              rotate={-6}
              className="px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-base"
            >
              <span className="md:hidden">
                {shortDayLabel} · {artist.hour}
              </span>
              <span className="hidden md:inline">
                {dayLabel} · {artist.hour}
              </span>
            </Sticker>
          </div>
        </div>
        <div className="flex items-baseline justify-between gap-2 px-4 py-3 md:px-5 md:py-4">
          <span className="font-display block text-xl leading-[0.9] font-bold wrap-break-word uppercase md:text-2xl xl:text-3xl">
            {artist.name}
          </span>
          <span
            aria-hidden="true"
            className="font-display text-2xl leading-none md:text-3xl"
          >
            →
          </span>
        </div>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <ArtistModalContent
            data={{
              imgSrc: artist.imgSrc,
              title: artist.name,
              subtitle: artist.hour,
              date,
              description: artist.description,
              link: artist.link,
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
