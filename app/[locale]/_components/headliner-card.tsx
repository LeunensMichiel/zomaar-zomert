import { Sticker } from "@components/sticker";
import { Link } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import { cn } from "@lib/utils";
import Image from "next/image";

import { TBACard } from "./tba-card";

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
  /** Label for the wax-seal sticker on TBA placeholder cards. */
  tbaLabel: string;
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
  tbaLabel,
}: Props) {
  const isTBA = name === "TBA";
  const style = { transform: `rotate(${String(tilt)}deg)` };

  if (isTBA) {
    return <TBACard tone={tone} tilt={tilt} tbaLabel={tbaLabel} size="lg" />;
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
        <span className="font-display block text-3xl leading-[0.9] font-bold wrap-break-word uppercase md:text-5xl xl:text-6xl">
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
