"use client";

import { Sticker } from "@components/sticker";
import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog";
import { cn } from "@lib/utils";
import Image from "next/image";

import type { HistoryImage as HistoryImageData } from "@/sanity/lib/queries";

const TILT_CYCLE = [-2, 2, -1, 1, -2, 2];

type Props = {
  image: HistoryImageData;
  index: number;
};

const altFor = (image: HistoryImageData): string =>
  image.alt || image.tag || image.caption || "";

export function HistoryImage({ image, index }: Props) {
  const tilt = TILT_CYCLE[index % TILT_CYCLE.length];
  const alt = altFor(image);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={alt || "Open image"}
            className="group block cursor-zoom-in text-left focus-visible:outline-none"
          />
        }
      >
        {image.kind === "affiche" && (
          <AfficheCard image={image} alt={alt} tilt={tilt} />
        )}
        {image.kind === "polaroid" && (
          <PolaroidCard image={image} alt={alt} tilt={tilt} />
        )}
        {image.kind === "normal" && (
          <NormalCard image={image} alt={alt} tilt={tilt} />
        )}
      </DialogTrigger>
      <DialogContent
        className="!bg-pink-50 p-6 md:p-10"
        closeClassName="text-gray-900"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="relative flex max-h-[80vh] w-full flex-1 items-center justify-center">
            <Image
              src={image.url}
              alt={alt}
              width={image.width ?? 1600}
              height={image.height ?? 1200}
              sizes="(max-width: 768px) 90vw, 80vw"
              className="h-auto max-h-[80vh] w-auto max-w-full object-contain"
              priority
            />
          </div>
          {(image.tag || image.caption) && (
            <p className="font-display text-center text-base font-bold tracking-wide text-gray-900 uppercase md:text-lg">
              {image.tag || image.caption}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AfficheCard({
  image,
  alt,
  tilt,
}: {
  image: HistoryImageData;
  alt: string;
  tilt: number;
}) {
  return (
    <div className="relative mt-2 max-w-65">
      <span
        aria-hidden="true"
        className="tape-strip absolute -top-3 left-12 z-30 h-5 w-20 -rotate-6"
      />
      <article
        className="shadow-sticker-lg group-hover:shadow-sticker-xl relative aspect-3/4 overflow-hidden border-2 border-gray-900 transition-transform duration-300 group-hover:-translate-y-1"
        style={{ transform: `rotate(${String(tilt)}deg)` }}
      >
        <Image
          src={image.url}
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
      {image.tag && (
        <div className="absolute -top-3 -right-3 z-20">
          <Sticker color="brand" size="sm" rotate={-6}>
            {image.tag}
          </Sticker>
        </div>
      )}
    </div>
  );
}

function PolaroidCard({
  image,
  alt,
  tilt,
}: {
  image: HistoryImageData;
  alt: string;
  tilt: number;
}) {
  return (
    <div className="relative mt-2 max-w-72">
      <span
        aria-hidden="true"
        className="tape-strip absolute -top-3 left-10 z-30 h-5 w-20 -rotate-12"
      />
      <article
        className={cn(
          "shadow-sticker-lg group-hover:shadow-sticker-xl relative border-2 border-gray-900 bg-white p-3 pb-6 transition-transform duration-300 group-hover:-translate-y-1 md:p-4 md:pb-8",
        )}
        style={{ transform: `rotate(${String(tilt)}deg)` }}
      >
        <div className="relative aspect-square overflow-hidden border-2 border-gray-900">
          <Image
            src={image.url}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 50vw, 280px"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="halftone pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
          />
        </div>
      </article>
      {image.tag && (
        <div className="absolute -top-3 -right-3 z-20">
          <Sticker color="brand" size="sm" rotate={-6}>
            {image.tag}
          </Sticker>
        </div>
      )}
    </div>
  );
}

function NormalCard({
  image,
  alt,
  tilt,
}: {
  image: HistoryImageData;
  alt: string;
  tilt: number;
}) {
  return (
    <div
      className="relative mt-2 max-w-xs"
      style={{ transform: `rotate(${String(tilt)}deg)` }}
    >
      <div className="shadow-sticker-lg group-hover:shadow-sticker-xl relative aspect-3/2 overflow-hidden border-2 border-gray-900 transition-transform duration-300 group-hover:-translate-y-1">
        <Image
          src={image.url}
          alt={alt}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 280px"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="halftone pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
        />
      </div>
      {image.caption && (
        <p className="font-display mt-3 text-center text-sm font-bold tracking-wide text-gray-900 uppercase md:text-base">
          {image.caption}
        </p>
      )}
    </div>
  );
}
