"use client";

import { Button } from "@components/ui/button";
import { ImageWithAspectRatio } from "@components/ui/image-with-aspect-ratio";
import { type MenuItem, MenuType } from "@lib/models";
import { groupBy } from "@lib/utils/group-by";
import { Ticket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const itemVariants = {
  hidden: { x: 10, opacity: 0, transition: { duration: 0.2 } },
  exit: { x: -10, opacity: 0, transition: { duration: 0.2 } },
  show: { x: 0, opacity: 1, transition: { duration: 0.2 } },
};

type Props = { menu: MenuItem[] };

export function MenuClient({ menu }: Props) {
  const t = useTranslations("menu");
  const [menuType, setCurrentMenuType] = useState<MenuType>(MenuType.DRINKS);

  const filteredMenu = useMemo(
    () => menu.filter((menuItem) => menuItem.category === menuType),
    [menu, menuType],
  );

  const menuBySubCategory = useMemo(
    () => groupBy(filteredMenu, (x) => x.subCategory),
    [filteredMenu],
  );

  return (
    <section className="container-wide section-y-sm grid">
      <h1 className="mb-12 text-center font-bold uppercase">{t("title")}</h1>
      <div className="mx-auto mb-14 grid grid-cols-2 text-center md:mb-20">
        {Object.keys(MenuType).map((type) => (
          <Button
            key={type}
            size="md"
            variant="minimal"
            className="hover:text-pink-400 focus:text-pink-400"
            onClick={() => {
              setCurrentMenuType(MenuType[type as keyof typeof MenuType]);
            }}
          >
            {t(MenuType[type as keyof typeof MenuType])}
            {MenuType[type as keyof typeof MenuType] === menuType && (
              <motion.div
                className="bg-brand-500 absolute right-0 -bottom-0.5 left-0 z-[3] h-1 w-full"
                layoutId="underline"
              />
            )}
          </Button>
        ))}
      </div>

      <div className="grid gap-20">
        <AnimatePresence mode="wait">
          {Object.keys(menuBySubCategory).map((subCategory) => (
            <motion.div
              key={subCategory}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={itemVariants}
            >
              <span className="font-display mb-6 inline-block text-2xl leading-tight font-bold text-pink-700 uppercase">
                {subCategory}
              </span>
              <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                {menuBySubCategory[subCategory].map((item) => (
                  <div key={item.name} className="flex flex-col bg-white">
                    <div className="grid grid-cols-[minmax(0,80px)_1fr] items-center gap-4 px-4 py-3 md:grid-cols-[minmax(0,120px)_1fr] xl:grid-cols-[minmax(0,140px)_1fr] xl:items-start">
                      <ImageWithAspectRatio
                        aspectRatio="1/1"
                        width={80}
                        height={80}
                        src={item.img}
                        className="object-contain!"
                        alt={item.name}
                      />
                      <div className="grid content-start items-start justify-start gap-2 xl:pt-2">
                        <span className="font-display text-2xl leading-tight font-bold text-blue-900 uppercase">
                          {item.name}
                        </span>
                        <p className="mb-3 text-sm text-blue-700">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="font-display mt-auto grid grid-cols-[repeat(2,auto)] items-center justify-start gap-3 bg-gray-900 px-4 py-1.5 font-bold">
                      <Ticket className="h-5 w-5 text-pink-400" />
                      <span className="-mb-px text-pink-400">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
