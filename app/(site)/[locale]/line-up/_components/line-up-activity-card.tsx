"use client";

import { Sticker } from "@components/sticker";
import { Link } from "@lib/i18n/navigation";
import { cn } from "@lib/utils";
import Image from "next/image";
import { useLocale } from "next-intl";

import { type Activity } from "@/sanity/lib/queries";

type Tone = "blue" | "brand" | "pink";

type Props = {
  activity: Activity;
  date: string;
  tone: Tone;
  tilt?: number;
  eyebrow: string;
};

const toneClass: Record<Tone, string> = {
  blue: "bg-blue-500 text-white",
  brand: "bg-brand-500 text-white",
  pink: "bg-pink-300 text-gray-900",
};

const linkHref: Record<Activity["linkTarget"], "/bike" | "/run" | "/info"> = {
  bike: "/bike",
  run: "/run",
  info: "/info",
};

const cardFrame =
  "group relative block w-full border-2 border-gray-900 shadow-sticker md:shadow-sticker-lg text-left";

export function LineUpActivityCard({
  activity,
  date,
  tone,
  tilt = 0,
  eyebrow,
}: Props) {
  const lang = useLocale();
  const style = { transform: `rotate(${String(tilt)}deg)` };

  const dayLabel = new Date(date).toLocaleString(lang, { weekday: "long" });
  // Short weekday for mobile so the day sticker stays on one line in
  // the narrow card. Strips the trailing period nl/fr add.
  const shortDayLabel = new Date(date)
    .toLocaleString(lang, { weekday: "short" })
    .replace(/\.$/, "");
  const withTime = (label: string) =>
    activity.timeLabel ? `${label} · ${activity.timeLabel}` : label;

  const photo = activity.image?.url ? activity.image.url : null;

  return (
    <Link
      href={linkHref[activity.linkTarget]}
      className={cn(
        cardFrame,
        toneClass[tone],
        "cursor-pointer transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline-none",
      )}
      style={style}
    >
      <div className="relative aspect-4/5 overflow-hidden border-b-2 border-gray-900">
        {photo ? (
          <Image
            src={photo}
            alt={activity.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform group-hover:scale-105"
            placeholder={activity.image?.lqip ? "blur" : "empty"}
            blurDataURL={activity.image?.lqip ?? undefined}
          />
        ) : (
          <>
            {/* No tagged photo — fall back to a doodle. Plus-mark corners
                echo the festival sticker-pack language. */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={`/assets/doodles/${activity.doodle}.svg`}
                alt=""
                width={400}
                height={400}
                aria-hidden="true"
                className="h-[68%] w-auto -rotate-6 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:rotate-6"
              />
            </div>
            <PlusMark className="absolute top-3 left-3 z-10" />
            <PlusMark className="absolute top-3 right-3 z-10" />
            <PlusMark className="absolute bottom-3 left-3 z-10" />
            <PlusMark className="absolute right-3 bottom-3 z-10" />
          </>
        )}
        <div className="absolute top-2 left-2 z-20 md:top-3 md:left-3">
          <Sticker
            color="ink"
            size="sm"
            rotate={-6}
            className="px-2 py-1 text-xs md:px-3 md:py-1.5 md:text-base"
          >
            <span className="md:hidden">{withTime(shortDayLabel)}</span>
            <span className="hidden md:inline">{withTime(dayLabel)}</span>
          </Sticker>
        </div>
      </div>
      <div className="px-4 py-3 md:px-5 md:py-4">
        <span className="font-display block text-[0.625rem] leading-none font-bold tracking-[0.18em] uppercase opacity-70 md:text-xs">
          {eyebrow}
        </span>
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <span className="font-display block text-xl leading-[0.9] font-bold wrap-break-word uppercase md:text-2xl xl:text-3xl">
            {activity.name}
          </span>
          <span
            aria-hidden="true"
            className="font-display text-2xl leading-none md:text-3xl"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function PlusMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      className={cn("h-5 w-5 text-gray-900 md:h-6 md:w-6", className)}
    >
      <path
        d="M50 8 V92 M8 50 H92"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="square"
      />
    </svg>
  );
}
