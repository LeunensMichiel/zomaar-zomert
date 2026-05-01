'use client';

import { Countdown, ImageCard, Marquee } from '@components/common';
import { type CONSENT } from '@components/common/CookieBanner/CookieBanner';
import { getLocalStorage } from '@components/common/CookieBanner/storagehelper';
import { Triangle } from '@components/icons';
import ChevronRight from '@components/icons/Chevron';
import { Button, Logo } from '@components/ui';
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
import cn from 'classnames';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import ReactPlayer from 'react-player';

import styles from './HomeClient.module.scss';

type Slide = { alt: string; url: string };

const baseSlides: Slide[] = Array.from({ length: 30 }, (_, i) => ({
  alt: `carousel image ${i + 1}`,
  url: `/assets/slides/slide${i + 1}.webp`,
}));

const HomeClient = () => {
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
      <section className={cn(styles.landing)}>
        <video
          playsInline
          autoPlay
          muted
          poster="/assets/landing.webp"
          loop
          preload="auto"
        >
          <source src="/assets/landing.mp4" type="video/mp4" />
        </video>
        <div className={cn(styles.landing__inner, 'container')}>
          <Logo variant="full" className={styles.logo} />
          <span className={styles.date}>
            <span>{ZZ_DATE_FRIDAY.slice(-2)}</span>
            <Triangle />
            <span>{ZZ_DATE_SATURDAY.slice(-2)}</span>
            <Triangle />
            <span>
              {ZZ_DATE_SUNDAY.slice(-2)} {t('month')} {ZZ_YEAR}
            </span>
          </span>
        </div>
        <img
          className={cn('tear', 'tear--bottom')}
          src="/assets/tear-1.svg"
          alt="paper tear element"
          style={{ bottom: -32 }}
        />
      </section>
      <section className={cn(styles.countdown, 'container')}>
        <Countdown />
      </section>
      <section className={cn(styles.below__countdown)}>
        <div className="container py-container--sm">
          <div className={styles.artists}>
            {days.map((day) => (
              <Link
                key={day.date}
                href={{ pathname: '/line-up', query: { date: day.date } }}
                className={styles.artists__card}
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
          <div className={styles.buttons}>
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
              iconRight={<ChevronRight />}
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
              iconRight={<ChevronRight />}
            >
              {t('paella')}
            </Button>
          </div>
        </div>
        <img
          className={cn('tear', 'tear--bottom')}
          src="/assets/tear-2.svg"
          alt="paper tear element"
        />
      </section>
      <section className={cn('py-container--sm', styles.aftermovie__root)}>
        <div className={cn('container')}>
          <div className={cn(styles.aftermovie__container)}>
            <div className={styles.aftermovie}>
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
      <section className={cn(styles['photo-row'])}>
        <img
          className={cn('tear', 'tear--top')}
          src="/assets/tear-3.svg"
          alt="paper tear element"
        />
        <Marquee speed={20} direction="left" slides={slidesTop} />
        <Marquee speed={10} direction="right" slides={slidesBottom} />
        <img
          className={cn('tear', 'tear--bottom')}
          src="/assets/tear-4.svg"
          alt="paper tear element"
        />
      </section>
    </>
  );
};

export default HomeClient;
