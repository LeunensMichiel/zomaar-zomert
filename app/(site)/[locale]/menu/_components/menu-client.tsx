"use client";

import { ScrollBg } from "@components/scroll-bg";
import { Sticker } from "@components/sticker";
import { type MenuItem, MenuType } from "@lib/models";
import { cn } from "@lib/utils";
import { groupBy } from "@lib/utils/group-by";
import { Ticket } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type ReactNode, useMemo, useState } from "react";

// Per-filter background palettes — five close stops form a gentle
// wave. Both bookend at pink-50 so the hero's transition reads
// consistently regardless of which filter is active. The middle peak
// carries the filter's flavour: warm yellow for drinks, soft pink
// for food.
const COLORS_DRINKS = [
  "#fff1f7", // pink-50
  "#fff8e0", // yellow-50
  "#fee198", // yellow-100 (dimmed-led — warm peak for drinks)
  "#fff8e0", // yellow-50
  "#fff1f7", // pink-50
];
const COLORS_FOOD = [
  "#fff1f7", // pink-50
  "#ffd6e3", // pink-100
  "#ffb0c3", // pink-200  (warm pink peak for food)
  "#ffd6e3", // pink-100
  "#fff1f7", // pink-50
];

// Subtle card tones — the page bg animates through warm stops, so
// cards stay quiet so the wave can shine through.
const TONE_CYCLE = ["bg-white", "bg-yellow-50", "bg-pink-50"] as const;

const TILT_CYCLE = [-1, 0.8, -0.6, 1, -0.8, 0.6] as const;

const STICKER_CYCLE = [
  "yellow",
  "brand",
  "blue",
  "pink",
  "ink",
  "paper",
] as const;
const STICKER_TILT = [-3, 2, -2, 3, -1, 4] as const;

type Props = {
  menu: MenuItem[];
  topTear?: ReactNode;
  bottomTear?: ReactNode;
};

export function MenuClient({ menu, topTear, bottomTear }: Props) {
  const t = useTranslations("menu");
  const [menuType, setMenuType] = useState<MenuType>(MenuType.DRINKS);
  const reducedMotion = useReducedMotion();
  const colors = menuType === MenuType.DRINKS ? COLORS_DRINKS : COLORS_FOOD;

  const groups = useMemo(
    () =>
      Object.entries(
        groupBy(
          menu.filter((m) => m.category === menuType),
          (x) => x.subCategory,
        ),
      ),
    [menu, menuType],
  );

  const filters: { value: MenuType; label: string }[] = [
    { value: MenuType.DRINKS, label: t("Drinks") },
    { value: MenuType.FOOD, label: t("Food") },
  ];

  return (
    <ScrollBg colors={colors}>
      {topTear}
      <div className="container-wide relative z-20 pt-8 pb-16 md:pt-10 md:pb-20">
        <h1 className="font-display shadow-sticker-lg inline-block rotate-2 bg-gray-950 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-400 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
          {t("hero.title")}
        </h1>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 md:mt-12 md:gap-3">
          {filters.map(({ value, label }) => {
            const isActive = menuType === value;
            return (
              <button
                key={value}
                onClick={() => {
                  setMenuType(value);
                }}
                className={cn(
                  "font-display relative px-4 py-2 text-base font-bold tracking-wide uppercase transition-colors md:px-5 md:py-2.5 md:text-lg",
                  isActive
                    ? "text-gray-900"
                    : "hover:text-brand-500 text-gray-700",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="menu-filter-pill"
                    className="shadow-sticker absolute inset-0 -z-10 border-2 border-gray-900 bg-yellow-400"
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: "spring", duration: 0.4, bounce: 0.2 }
                    }
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        <div
          key={menuType}
          className="mt-10 grid gap-y-10 md:mt-14 md:gap-y-14"
        >
          {groups.map(([subCategory, items], gi) => (
            <SubCategoryGroup
              key={subCategory}
              subCategory={subCategory}
              items={items}
              stickerColor={STICKER_CYCLE[gi % STICKER_CYCLE.length]}
              stickerTilt={STICKER_TILT[gi % STICKER_TILT.length]}
              reducedMotion={reducedMotion ?? false}
            />
          ))}
        </div>
      </div>
      {bottomTear}
    </ScrollBg>
  );
}

type SubCategoryGroupProps = {
  subCategory: string;
  items: MenuItem[];
  stickerColor: (typeof STICKER_CYCLE)[number];
  stickerTilt: number;
  reducedMotion: boolean;
};

function SubCategoryGroup({
  subCategory,
  items,
  stickerColor,
  stickerTilt,
  reducedMotion,
}: SubCategoryGroupProps) {
  return (
    <div>
      <Sticker color={stickerColor} size="md" rotate={stickerTilt}>
        {subCategory}
      </Sticker>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-6 md:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, i) => (
          <MenuItemCard
            key={item.name}
            item={item}
            tone={TONE_CYCLE[i % TONE_CYCLE.length]}
            tilt={TILT_CYCLE[i % TILT_CYCLE.length]}
            index={i}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

type MenuItemCardProps = {
  item: MenuItem;
  tone: (typeof TONE_CYCLE)[number];
  tilt: number;
  index: number;
  reducedMotion: boolean;
};

function MenuItemCard({
  item,
  tone,
  tilt,
  index,
  reducedMotion,
}: MenuItemCardProps) {
  // Motion drives both the entry slide-in and the resting tilt — a
  // static class-based rotation would be overwritten by motion's
  // transform animation.
  const initial = reducedMotion
    ? false
    : { opacity: 0, y: 16, rotate: 0, scale: 0.98 };
  const inView = reducedMotion
    ? { opacity: 1, rotate: tilt }
    : {
        opacity: 1,
        y: 0,
        rotate: tilt,
        scale: 1,
        transition: {
          duration: 0.35,
          ease: [0.22, 0.61, 0.36, 1] as const,
          delay: index * 0.03,
        },
      };

  return (
    <motion.article
      initial={initial}
      whileInView={inView}
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        "shadow-sticker relative grid grid-cols-[64px_1fr] items-center gap-3 border-2 border-gray-900 px-3 py-2.5 md:grid-cols-[72px_1fr] md:gap-4",
        tone,
      )}
    >
      {/* Image tile — square, halftoned, bordered. Compact size
          (~64-72px) so the card reads as a quick-scan menu line, not
          a product card. */}
      <div className="relative aspect-square overflow-hidden border-2 border-gray-900 bg-pink-50">
        <Image
          src={item.img}
          alt={item.name}
          fill
          sizes="80px"
          className="object-contain"
        />
        <div
          aria-hidden="true"
          className="halftone pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
        />
      </div>

      {/* Text + voucher price. Tag-shape sticker has the angled left
          cut that mimics a real voucher stub — keeps the Ticket icon
          + price reading as a single physical object. */}
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-display truncate text-base leading-none font-bold text-gray-900 uppercase md:text-lg">
            {item.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-gray-700 md:text-sm">
            {item.description}
          </p>
        </div>
        <span className="font-display shadow-sticker-sm shrink-0 -rotate-3 self-start border-2 border-gray-900 bg-gray-900 py-1 pr-2.5 pl-5 text-sm leading-none font-bold whitespace-nowrap text-yellow-300 uppercase [clip-path:polygon(8px_0%,100%_0%,100%_100%,8px_100%,0%_50%)] md:text-base">
          <Ticket className="-mt-0.5 mr-1 inline-block h-4 w-4" />
          {item.price}
        </span>
      </div>
    </motion.article>
  );
}
