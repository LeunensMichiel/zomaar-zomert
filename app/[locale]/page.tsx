import { Countdown } from "@components/countdown";
import { ImageCard } from "@components/image-card";
import { Button } from "@components/ui/button";
import { Logo } from "@components/ui/logo";
import { Link } from "@lib/i18n/navigation";
import { type Locale } from "@lib/i18n/routing";
import {
  isSignupOpen,
  PAELLA_LINK,
  PETANQUE_LINK,
  ZZ_DATE_FRIDAY,
  ZZ_DATE_SATURDAY,
  ZZ_DATE_SUNDAY,
  ZZ_YEAR,
} from "@lib/models";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Triangle } from "@/components/icons/Triangle";

import { ConsentVideo } from "./_components/consent-video";
import { HomeMarquees } from "./_components/home-marquees";

type Props = { params: Promise<{ locale: Locale }> };

const days: Array<{ date: string; image: string }> = [
  { date: ZZ_DATE_FRIDAY, image: "/assets/days/friday.webp" },
  { date: ZZ_DATE_SATURDAY, image: "/assets/days/saturday.webp" },
  { date: ZZ_DATE_SUNDAY, image: "/assets/days/sunday.jpg" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: { absolute: t("SEO.title") },
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });

  const signupDisabled = !isSignupOpen();

  return (
    <>
      <section className='relative z-[1] flex h-[80vh] w-full flex-col overflow-hidden after:absolute after:inset-0 after:z-[-1] after:h-full after:w-full after:bg-[rgba(24,7,2,0.15)] after:bg-[image:radial-gradient(rgba(255,255,255,0.2)_1px,rgba(0,0,0,0.15)_1px),radial-gradient(rgba(255,255,255,0.1)_1px,rgba(0,0,0,0.1)_1px)] after:[background-size:4px_4px] after:[background-position:0_0,2px_2px] after:content-[""] lg:h-[85vh]'>
        <video
          playsInline
          autoPlay
          muted
          poster="/assets/landing.webp"
          loop
          preload="auto"
          className="absolute inset-0 z-[-2] h-full w-full object-cover"
        >
          <source src="/assets/landing.mp4" type="video/mp4" />
        </video>
        <div className="container-wide xs:mb-[4vh] flex h-full flex-col items-center justify-center text-white lg:mb-[7vh]">
          <Logo variant="full" className="w-full max-w-[600px] text-white" />
          <span className="font-display xs:text-4xl mt-8 inline-flex items-center gap-2 text-2xl font-bold md:mt-12 md:text-5xl">
            <span>{ZZ_DATE_FRIDAY.slice(-2)}</span>
            <Triangle className="hidden h-6 w-6 md:inline md:h-8" />
            <span className="hidden md:inline">
              {ZZ_DATE_SATURDAY.slice(-2)}
            </span>
            <Triangle className="h-6 w-6 md:h-8" />
            <span>
              {ZZ_DATE_SUNDAY.slice(-2)} {t("month")} {ZZ_YEAR}
            </span>
          </span>
        </div>
        <img
          className="absolute -bottom-1 left-0 z-10 w-full object-cover"
          src="/assets/tear-1.svg"
          alt=""
          aria-hidden="true"
          style={{ bottom: -32 }}
        />
      </section>

      <section className="container-wide relative z-10 mt-4 xl:mt-0">
        <Countdown />
      </section>

      <section className="relative pb-12 md:mt-4 md:pb-40 xl:pb-44">
        <div className="container-wide section-y-sm">
          <div className="grid gap-6 lg:grid-cols-3">
            {days.map((day) => (
              <Link
                key={day.date}
                href={{ pathname: "/line-up", query: { date: day.date } }}
                className="block"
              >
                <ImageCard
                  playAnimation
                  data={{
                    title: new Date(day.date).toLocaleString(locale, {
                      weekday: "long",
                    }),
                    subtitle: new Date(day.date).toLocaleString(locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                    imgSrc: day.image,
                  }}
                />
              </Link>
            ))}
          </div>
          <div className="mt-12 grid gap-4 md:mt-36 lg:grid-cols-2">
            <Button
              as="a"
              {...(!signupDisabled && {
                href: PETANQUE_LINK,
                target: "_blank",
                rel: "noreferrer noopener",
              })}
              size="xl"
              disabled={signupDisabled}
              variant="primary"
              iconRight={<ChevronRight className="h-6 w-6" />}
            >
              {t("petanque")}
            </Button>
            <Button
              as="a"
              {...(!signupDisabled && {
                href: PAELLA_LINK,
                target: "_blank",
                rel: "noreferrer noopener",
              })}
              disabled={signupDisabled}
              size="xl"
              variant="primary"
              iconRight={<ChevronRight className="h-6 w-6" />}
            >
              {t("paella")}
            </Button>
          </div>
        </div>
        <img
          className="absolute -bottom-1 left-0 z-10 w-full object-cover"
          src="/assets/tear-2.svg"
          alt=""
          aria-hidden="true"
        />
      </section>

      <ConsentVideo />
      <HomeMarquees />
    </>
  );
}
