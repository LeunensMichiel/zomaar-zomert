import { Link } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import { cn } from "@lib/utils";
import Image from "next/image";

type Props = {
  date: string;
  image: string;
  index: number;
  locale: Locale;
};

const tones = [
  { bg: "bg-yellow-400 text-gray-900", tilt: -1.5 },
  { bg: "bg-pink-50 text-gray-900", tilt: 1.2 },
  { bg: "bg-pink-300 text-gray-900", tilt: -0.8 },
];

export function DayMiniCard({ date, image, index, locale }: Props) {
  const tone = tones[index % tones.length];
  const d = new Date(date);
  const weekday = d.toLocaleString(locale, { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleString(locale, { month: "short" });

  return (
    <Link
      href={{ pathname: "/line-up", query: { date } }}
      className={cn(
        "group relative flex items-stretch border-2 border-gray-900",
        "shadow-sticker transition-transform hover:-translate-y-1",
        tone.bg,
      )}
      style={{ transform: `rotate(${String(tone.tilt)}deg)` }}
    >
      <div className="relative aspect-square w-20 shrink-0 overflow-hidden border-r-2 border-gray-900 md:w-24">
        <Image
          src={image}
          alt={weekday}
          fill
          sizes="96px"
          className="object-cover object-center transition-transform group-hover:scale-[1.06]"
        />
        <div className='halftone absolute inset-0 opacity-25 mix-blend-multiply content-[""]' />
        <span className="font-display absolute right-1 bottom-1 z-10 inline-flex bg-gray-900 px-1.5 py-0.5 text-[10px] leading-none font-bold tracking-[0.15em] text-yellow-400 uppercase md:text-[11px]">
          0{index + 1}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 px-3 py-3 md:px-4">
        <div className="flex flex-col">
          <span className="font-display text-xl leading-[0.95] font-bold uppercase md:text-2xl">
            {weekday}
          </span>
          <span className="font-display mt-1 text-xs leading-none font-bold tracking-[0.18em] uppercase opacity-75 md:text-sm">
            {day} {month}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="font-display text-2xl leading-none transition-transform group-hover:translate-x-1 md:text-3xl"
        >
          →
        </span>
      </div>
    </Link>
  );
}
