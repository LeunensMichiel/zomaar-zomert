import { ImageCard, Layout, Marquee } from '@components/common';
import { CONSENT } from '@components/common/CookieBanner/CookieBanner';
import { getLocalStorage } from '@components/common/CookieBanner/storagehelper';
import { Triangle } from '@components/icons';
import ChevronRight from '@components/icons/Chevron';
import { Button, Logo } from '@components/ui';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';

import {
  ENABLE_LINKS_DATE,
  PAELLA_LINK,
  PETANQUE_LINK,
  ZZ_DATE_FRIDAY,
  ZZ_DATE_SATURDAY,
  ZZ_DATE_SUNDAY,
  ZZ_YEAR,
} from '../lib/models';
import styles from './styles/index.module.scss';

const Countdown = dynamic(
  () =>
    import('../components/common/Countdown/Countdown').then(
      (mod) => mod.Countdown
    ),
  {
    ssr: false,
  }
);
const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });

const Home = () => {
  const { t, lang } = useTranslation('home');
  const slides = Array.from({ length: 30 }, (_, i) => ({
    alt: `carousel image ${i + 1}`,
    url: `/assets/slides/slide${i + 1}.webp`,
  }));
  const shuffledSlides = slides
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  const storedCookieConsent = getLocalStorage<CONSENT>(
    'cookie_consent',
    'pending'
  );

  const today = new Date();
  const signupDisabled =
    today < new Date(ENABLE_LINKS_DATE) || today > new Date(ZZ_DATE_SUNDAY);

  return (
    <>
      <NextSeo
        title={`Zomaar Zomert • ${today.getFullYear()}`}
        titleTemplate="%s"
      />
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
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: ZZ_DATE_FRIDAY,
                },
              }}
              passHref
              legacyBehavior
            >
              <ImageCard
                playAnimation
                data={{
                  subtitle: new Date(ZZ_DATE_FRIDAY).toLocaleString(lang, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                  title: new Date(ZZ_DATE_FRIDAY).toLocaleString(lang, {
                    weekday: 'long',
                  }),
                  imgSrc: '/assets/days/friday.webp',
                }}
              />
            </Link>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: ZZ_DATE_SATURDAY,
                },
              }}
              passHref
              legacyBehavior
            >
              <ImageCard
                playAnimation
                data={{
                  title: new Date(ZZ_DATE_SATURDAY).toLocaleString(lang, {
                    weekday: 'long',
                  }),
                  subtitle: new Date(ZZ_DATE_SATURDAY).toLocaleString(lang, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                  imgSrc: '/assets/days/saturday.webp',
                }}
              />
            </Link>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: ZZ_DATE_SUNDAY,
                },
              }}
              passHref
              legacyBehavior
            >
              <ImageCard
                playAnimation
                data={{
                  title: new Date(ZZ_DATE_SUNDAY).toLocaleString(lang, {
                    weekday: 'long',
                  }),
                  subtitle: new Date(ZZ_DATE_SUNDAY).toLocaleString(lang, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }),
                  imgSrc: '/assets/days/sunday.jpg',
                }}
              />
            </Link>
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
              <ReactPlayer
                stopOnUnmount
                width={'100%'}
                controls
                height={'100%'}
                url={
                  storedCookieConsent !== 'denied'
                    ? 'https://www.youtube.com/embed/G2s9r_BohUE'
                    : undefined
                }
              />
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
        <Marquee
          speed={20}
          direction="left"
          slides={shuffledSlides.splice(0, 6)}
        />
        <Marquee
          speed={10}
          direction="right"
          slides={shuffledSlides.splice(-6)}
        />
        <img
          className={cn('tear', 'tear--bottom')}
          src="/assets/tear-4.svg"
          alt="paper tear element"
        />
      </section>
    </>
  );
};

export default Home;

Home.Layout = Layout;
