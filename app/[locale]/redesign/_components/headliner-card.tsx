import { Link } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import { cn } from "@lib/utils";
import Image from "next/image";

import { Doodle } from "@/app/[locale]/redesign/_components/doodle";
import { Sticker } from "@/app/[locale]/redesign/_components/sticker";

type Props = {
  name: string;
  hour: string;
  day: "friday" | "saturday" | "sunday";
  imgSrc: string;
  date: string;
  locale: Locale;
  /** Decorative tilt in degrees. */
  tilt?: number;
  /** Background color of the card frame. */
  tone?: "blue" | "yellow" | "pink" | "brand";
};

const toneClass: Record<NonNullable<Props["tone"]>, string> = {
  blue: "bg-blue-500 text-white",
  yellow: "bg-yellow-400 text-gray-900",
  pink: "bg-pink-300 text-gray-900",
  brand: "bg-brand-500 text-white",
};

const cardFrame =
  "group relative block border-2 border-gray-900 shadow-sticker md:shadow-sticker-lg";

export function HeadlinerCard({
  name,
  hour,
  day,
  imgSrc,
  date,
  locale,
  tilt = 0,
  tone = "blue",
}: Props) {
  const isTBA = name === "TBA";
  const style = { transform: `rotate(${String(tilt)}deg)` };

  if (isTBA) {
    return (
      <div className={cn(cardFrame, toneClass[tone])} style={style}>
        <CardBack />
        <div className="flex items-baseline justify-between gap-2 px-4 py-4 md:px-5">
          <span className="font-display block text-3xl leading-[0.9] font-bold uppercase md:text-5xl xl:text-6xl">
            TBA
          </span>
          <span
            aria-hidden="true"
            className="font-display text-3xl leading-none md:text-4xl"
          >
            ✦
          </span>
        </div>
      </div>
    );
  }

  const dayLabel = new Date(date).toLocaleString(locale, { weekday: "long" });
  return (
    <Link
      href={{ pathname: "/line-up", query: { date } }}
      className={cn(
        cardFrame,
        "transition-transform hover:-translate-y-1",
        toneClass[tone],
      )}
      style={style}
    >
      <div className='before:halftone relative aspect-4/5 overflow-hidden border-b-2 border-gray-900 before:absolute before:inset-0 before:z-10 before:opacity-70 before:mix-blend-multiply before:content-[""]'>
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 90vw, 33vw"
          className="object-cover object-center transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 z-20">
          <Sticker color="ink" size="sm" rotate={-6}>
            {dayLabel} · {hour}
          </Sticker>
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-2 px-4 py-4 md:px-5">
        <span className="font-display block text-3xl leading-[0.9] font-bold break-words uppercase md:text-5xl xl:text-6xl">
          {name}
        </span>
        <span
          aria-hidden="true"
          className="font-display text-3xl leading-none md:text-4xl"
        >
          →
        </span>
      </div>
      <span className="sr-only">{day}</span>
    </Link>
  );
}

/**
 * Playing-card-back style fill for TBA placeholders: tone-colored background
 * with a halftone wash, an oversized "medallion" doodle centered, four small
 * plus-sign accents at the corners (the symmetric repeating motif), and a
 * tilted "Soon" sticker as the wax seal.
 */
function CardBack() {
  return (
    <div className='before:halftone relative aspect-4/5 overflow-hidden border-b-2 border-gray-900 before:absolute before:inset-0 before:z-10 before:opacity-50 before:mix-blend-multiply before:content-[""]'>
      <div className="absolute inset-0 flex items-center justify-center">
        <Doodle
          shape="halftone-blob"
          color="ink"
          accent="paper"
          rotate={-12}
          grain
          className="h-[85%] w-[85%]"
        />
      </div>
      <Doodle
        shape="plus"
        color="ink"
        className="absolute top-3 left-3 h-5 w-5 md:h-6 md:w-6"
      />
      <Doodle
        shape="plus"
        color="ink"
        className="absolute top-3 right-3 h-5 w-5 md:h-6 md:w-6"
      />
      <Doodle
        shape="plus"
        color="ink"
        className="absolute bottom-3 left-3 h-5 w-5 md:h-6 md:w-6"
      />
      <Doodle
        shape="plus"
        color="ink"
        className="absolute right-3 bottom-3 h-5 w-5 md:h-6 md:w-6"
      />
      <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <Sticker color="brand" size="md" rotate={-8}>
          Soon
        </Sticker>
      </div>
    </div>
  );
}
