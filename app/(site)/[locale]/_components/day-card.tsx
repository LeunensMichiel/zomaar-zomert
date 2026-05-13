import { Sticker } from "@components/sticker";
import { Link } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import { cn } from "@lib/utils";
import Image from "next/image";

type Props = {
  date: string;
  image: string;
  index: number;
  locale: Locale;
  ctaLabel: string;
};

const tones = [
  {
    bg: "bg-yellow-400 text-gray-900",
    sticker: "brand" as const,
    tilt: -1.5,
  },
  {
    bg: "bg-blue-500 text-white",
    sticker: "yellow" as const,
    tilt: 1.2,
  },
  {
    bg: "bg-pink-300 text-gray-900",
    sticker: "ink" as const,
    tilt: -0.8,
  },
];

export function DayCard({ date, image, index, locale, ctaLabel }: Props) {
  const tone = tones[index % tones.length];
  const d = new Date(date);
  const weekday = d.toLocaleString(locale, { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleString(locale, { month: "short" });

  return (
    <Link
      href={{ pathname: "/line-up", query: { date } }}
      className={cn(
        "group relative block border-2 border-gray-900",
        "shadow-sticker md:shadow-sticker-lg transition-transform hover:-translate-y-1",
        tone.bg,
      )}
      style={{ transform: `rotate(${String(tone.tilt)}deg)` }}
    >
      <div className="relative aspect-[5/6] overflow-hidden border-b-2 border-gray-900">
        <Image
          src={image}
          alt={weekday}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center transition-transform group-hover:scale-[1.04]"
        />
        <div className="absolute top-4 left-4 z-20">
          <Sticker color={tone.sticker} size="lg" rotate={-8}>
            {String(index + 1).padStart(2, "0")}
          </Sticker>
        </div>
        <div className="absolute right-4 bottom-4 z-20 flex flex-col items-end gap-2">
          <span className="font-display shadow-sticker-sm bg-pink-50 px-3 py-1 text-xl leading-none font-bold text-gray-900 uppercase md:text-2xl">
            {day} {month}
          </span>
        </div>
      </div>
      <div className="flex items-end justify-between gap-3 px-5 py-5">
        <span className="font-display text-4xl leading-[0.9] font-bold uppercase lg:text-5xl xl:text-6xl">
          {weekday}
        </span>
        {/* Hidden at md (the iPad 3-col size where each card is too
            narrow to fit the weekday + CTA on one line). Mobile and
            lg+ both have room for it. */}
        <span className="font-display inline-flex items-center gap-1 pb-1 text-sm font-bold uppercase md:hidden lg:inline-flex lg:text-base">
          {ctaLabel} <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
