import { Carousel, ImageCard, Layout } from '@components/common';
import { Triangle } from '@components/icons';
import { Logo } from '@components/ui';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { NextSeo } from 'next-seo';

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

const slides = [
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-1.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-2.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-3.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-4.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-5.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-6.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-7.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-8.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-9.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-10.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-11.jpg',
  },
  {
    alt: 'Our zz banner in the field',
    url: '/assets/slides/slide-12.jpg',
  },
];

const Home = () => {
  return (
    <>
      <NextSeo
        title={`Zomaar Zomert • ${new Date().getFullYear()}`}
        titleTemplate="%s"
      />
      <section className={cn(styles.landing)}>
        <video
          playsInline
          autoPlay
          muted
          poster="/assets/card.jpg"
          loop
          preload="auto"
        >
          <source src="/assets/landing.mp4" type="video/mp4" />
        </video>
        <div className={cn(styles.landing__inner, 'container')}>
          <Logo variant="full" className={styles.logo} />
          <span className={styles.date}>
            <span>28</span>
            <Triangle />
            <span>29</span>
            <Triangle />
            <span>30 JULY 2023</span>
          </span>
        </div>
        <img
          className={styles.tear}
          src="/assets/tear.svg"
          alt="paper tear element"
        />
      </section>
      <section className={cn('container py-container', styles.countdown)}>
        <div>
          <Countdown />
        </div>
        <div className={styles.artists}>
          <Link
            href={{
              pathname: '/line-up',
              query: {
                date: '2023-07-28',
              },
            }}
            passHref
            legacyBehavior
          >
            <ImageCard
              playAnimation
              data={{
                subtitle: new Date('2023-07-28').toLocaleString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
                title: new Date('2023-07-28').toLocaleString('en-GB', {
                  weekday: 'long',
                }),
                imgSrc: '/assets/days/friday.jpg',
              }}
            />
          </Link>
          <Link
            href={{
              pathname: '/line-up',
              query: {
                date: '2023-07-29',
              },
            }}
            passHref
            legacyBehavior
          >
            <ImageCard
              playAnimation
              data={{
                title: new Date('2023-07-29').toLocaleString('en-GB', {
                  weekday: 'long',
                }),
                subtitle: new Date('2023-07-29').toLocaleString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
                imgSrc: '/assets/days/saturday.jpg',
              }}
            />
          </Link>
          <Link
            href={{
              pathname: '/line-up',
              query: {
                date: '2023-07-30',
              },
            }}
            passHref
            legacyBehavior
          >
            <ImageCard
              playAnimation
              data={{
                title: new Date('2023-07-30').toLocaleString('en-GB', {
                  weekday: 'long',
                }),
                subtitle: new Date('2023-07-30').toLocaleString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
                imgSrc: '/assets/days/sunday.jpg',
              }}
            />
          </Link>
        </div>
        {/* <div className={styles.buttons}>
          <Button
            as="a"
            href="https://forms.gle/pPBDp316unZQNzHv6"
            target="_blank"
            rel="noreferrer noopener"
            size="xl"
            variant="primary"
            iconRight={<ChevronRight />}
          >
            Sign up — Petanque
          </Button>
          <Button
            as="a"
            href="https://forms.gle/gsZmucuve7tHacQd8"
            target="_blank"
            rel="noreferrer noopener"
            size="xl"
            variant="primary"
            iconRight={<ChevronRight />}
          >
            Sign up — Paella
          </Button>
        </div> */}
      </section>
      <section className={cn(styles.aftermovie__root)}>
        <div className={cn('container py-container')}>
          <div className={cn(styles.aftermovie__container)}>
            <div className={styles.aftermovie}>
              <ReactPlayer
                stopOnUnmount
                width={'100%'}
                controls
                height={'100%'}
                url="https://www.youtube.com/embed/G2s9r_BohUE"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-container">
        <Carousel speed={20} direction="left" slides={slides.splice(0, 6)} />
        <Carousel speed={10} direction="right" slides={slides.splice(-6)} />
      </section>
    </>
  );
};

export default Home;

Home.Layout = Layout;
