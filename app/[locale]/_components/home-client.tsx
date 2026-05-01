'use client';

import { type CONSENT } from '@components/cookie-banner';
import { Countdown } from '@components/countdown';
import { Triangle } from '@components/icons/triangle';
import { ImageCard } from '@components/image-card';
import { Marquee } from '@components/marquee';
import { Button } from '@components/ui/button';
import { Logo } from '@components/ui/logo';
import { Link } from '@lib/i18n/navigation';
import {
  ENABLE_LINKS_DATE,
  PAELLA_LINK,
  PETANQUE_LINK,
  ZZ_DATE_FRIDAY,
  ZZ_DATE_SATURDAY,
  ZZ_DATE_SUNDAY,
  ZZ_YEAR,
} from '@lib/models';
import { getLocalStorage } from '@lib/utils/storage';
import { ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';

type Slide = { alt: string; url: string };

const baseSlides: Slide[] = Array.from({ length: 30 }, (_, i) => ({
  alt: `carousel image ${i + 1}`,
  url: `/assets/slides/slide${i + 1}.webp`,
}));

const tearBottom = 'absolute left-0 -bottom-1 z-10 w-full object-cover';
const tearTop = 'absolute left-0 -top-1 z-10 w-full object-cover';

export default function HomeClient() {
  const t = useTranslations('home');
  const lang = useLocale();
  const [shuffledSlides, setShuffledSlides] = useState<Slide[]>(baseSlides);
  const [consent, setConsent] = useState<CONSENT | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShuffledSlides(
      [...baseSlides]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    );
    setConsent(getLocalStorage<CONSENT>('cookie_consent', 'pending'));
  }, []);

  const today = new Date();
  const signupDisabled =
    today < new Date(ENABLE_LINKS_DATE) || today > new Date(ZZ_DATE_SUNDAY);

  const days: Array<{ date: string; image: string }> = [
    { date: ZZ_DATE_FRIDAY, image: '/assets/days/friday.webp' },
    { date: ZZ_DATE_SATURDAY, image: '/assets/days/saturday.webp' },
    { date: ZZ_DATE_SUNDAY, image: '/assets/days/sunday.jpg' },
  ];

  const slidesTop = useMemo(() => shuffledSlides.slice(0, 6), [shuffledSlides]);
  const slidesBottom = useMemo(
    () => shuffledSlides.slice(-6),
    [shuffledSlides]
  );

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
              {ZZ_DATE_SUNDAY.slice(-2)} {t('month')} {ZZ_YEAR}
            </span>
          </span>
        </div>
        <img
          className={tearBottom}
          src="/assets/tear-1.svg"
          alt="paper tear element"
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
                href={{ pathname: '/line-up', query: { date: day.date } }}
                className="block"
              >
                <ImageCard
                  playAnimation
                  data={{
                    title: new Date(day.date).toLocaleString(lang, {
                      weekday: 'long',
                    }),
                    subtitle: new Date(day.date).toLocaleString(lang, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
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
                target: '_blank',
                rel: 'noreferrer noopener',
              })}
              size="xl"
              disabled={signupDisabled}
              variant="primary"
              iconRight={<ChevronRight className="h-6 w-6" />}
            >
              {t('petanque')}
            </Button>
            <Button
              as="a"
              {...(!signupDisabled && {
                href: PAELLA_LINK,
                target: '_blank',
                rel: 'noreferrer noopener',
              })}
              disabled={signupDisabled}
              size="xl"
              variant="primary"
              iconRight={<ChevronRight className="h-6 w-6" />}
            >
              {t('paella')}
            </Button>
          </div>
        </div>
        <img
          className={tearBottom}
          src="/assets/tear-2.svg"
          alt="paper tear element"
        />
      </section>

      <section className="section-y-sm bg-brand-500 w-full pt-10!">
        <div className="container-wide">
          <div className="relative h-0 overflow-hidden pb-[56.25%]">
            <div className="absolute inset-0 z-[1] h-full w-full">
              {mounted && consent !== 'denied' && (
                <ReactPlayer
                  width="100%"
                  height="100%"
                  controls
                  src="https://www.youtube.com/embed/G2s9r_BohUE"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mb-8">
        <img
          className={tearTop}
          src="/assets/tear-3.svg"
          alt="paper tear element"
        />
        <Marquee speed={20} direction="left" slides={slidesTop} />
        <Marquee speed={10} direction="right" slides={slidesBottom} />
        <img
          className={tearBottom}
          src="/assets/tear-4.svg"
          alt="paper tear element"
        />
      </section>
    </>
  );
}
