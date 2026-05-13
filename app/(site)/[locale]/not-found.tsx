import { Doodle } from "@components/doodle";
import { PaperTear } from "@components/paper-tear";
import { Button } from "@components/ui/button";
import { getPathname } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import { ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { NotFoundClient } from "./_components/not-found-client";

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("common");
  const homeHref = getPathname({ locale, href: "/" });

  return (
    <section className="relative bg-blue-900 text-pink-50">
      <Doodle
        shape="radial"
        color="linear-sunset"
        rotate={-14}
        className="pointer-events-none absolute -top-10 -left-12 hidden h-56 md:-top-16 md:-left-20 md:block md:h-80 lg:h-112"
      />
      <Doodle
        shape="asterisk"
        color="royal-yellow"
        rotate={20}
        className="pointer-events-none absolute top-28 right-6 h-10 md:top-36 md:right-12 md:h-14"
      />
      <Doodle
        shape="plus"
        color="pink"
        rotate={-12}
        className="pointer-events-none absolute bottom-28 left-8 hidden h-10 md:block md:h-12"
      />

      <div className="container-wide relative z-20 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-display shadow-sticker-lg inline-block rotate-1 bg-blue-500 px-6 py-3 text-7xl leading-[0.85] font-bold text-yellow-400 uppercase md:px-10 md:py-5 md:text-9xl xl:text-[12rem]">
            {t("notFound.code")}
          </h1>
          <p className="font-display shadow-sticker-sm mt-6 inline-block -rotate-2 border-2 border-gray-900 bg-pink-300 px-4 py-2 text-base font-bold text-gray-900 uppercase md:mt-8 md:text-xl">
            {t("notFound.title")}
          </p>

          <div className="mt-10 w-full md:mt-14">
            <NotFoundClient
              centerDoodle={
                <Doodle
                  shape="eye"
                  color="royal-yellow"
                  className="h-24 md:h-32"
                />
              }
              orbitDoodles={[
                <Doodle
                  key="plus"
                  shape="plus"
                  color="pink"
                  className="h-10 md:h-14"
                />,
                <Doodle
                  key="asterisk"
                  shape="asterisk"
                  color="royal-yellow"
                  className="h-12 md:h-16"
                />,
                <Doodle
                  key="cross"
                  shape="cross"
                  color="dimmed-led"
                  accent="summer-red"
                  className="h-12 md:h-16"
                />,
                <Doodle
                  key="star"
                  shape="star"
                  color="royal-yellow"
                  className="h-10 md:h-14"
                />,
                <Doodle key="flame" shape="flame" className="h-12 md:h-16" />,
                <Doodle key="zzz" shape="zzz" className="h-10 md:h-14" />,
              ]}
            />
          </div>

          <p className="mx-auto mt-8 max-w-xl text-base text-pink-50/85 md:mt-12 md:text-lg">
            {t("notFound.message")}
          </p>

          <div className="mt-8 md:mt-10">
            <Button
              as="a"
              href={homeHref}
              variant="accent"
              size="lg"
              sticker
              iconRight={<ChevronRight />}
            >
              {t("notFound.button")}
            </Button>
          </div>
        </div>
      </div>

      <PaperTear edge="bottom" tear={6} color="pink-50" />
    </section>
  );
}
