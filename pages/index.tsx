import { Artist, Carousel, Countdown, Layout } from '@components/common';
import { Triangle } from '@components/icons';
import ChevronRight from '@components/icons/Chevron';
import { Button, Logo } from '@components/ui';
import cn from 'classnames';
import Link from 'next/link';
import ReactPlayer from 'react-player';

import slide1 from '../public/assets/slides/slide-1.jpg';
import slide2 from '../public/assets/slides/slide-2.jpg';
import slide3 from '../public/assets/slides/slide-3.jpg';
import slide4 from '../public/assets/slides/slide-4.jpg';
import slide5 from '../public/assets/slides/slide-5.jpg';
import slide6 from '../public/assets/slides/slide-6.jpg';
import slide7 from '../public/assets/slides/slide-7.jpg';
import slide8 from '../public/assets/slides/slide-8.jpg';
import slide9 from '../public/assets/slides/slide-9.jpg';
import slide10 from '../public/assets/slides/slide-10.jpg';
import slide11 from '../public/assets/slides/slide-11.jpg';
import slide12 from '../public/assets/slides/slide-12.jpg';
import slide13 from '../public/assets/slides/slide-13.jpg';
import slide14 from '../public/assets/slides/slide-14.jpg';
import styles from './styles/index.module.scss';

const slides = [
  {
    alt: 'Our zz banner in the field',
    url: slide1,
  },
  {
    alt: 'a beer',
    url: slide2,
  },
  {
    alt: 'a game of petanque',
    url: slide3,
  },
  {
    alt: 'A crowd going crazy',
    url: slide4,
  },
  {
    alt: 'zomaar zomert by night',
    url: slide5,
  },
  {
    alt: 'A crowd going crazy 2',
    url: slide6,
  },
  {
    alt: 'our logo cut out in cardboard',
    url: slide7,
  },
  {
    alt: 'the organizers',
    url: slide8,
  },
  {
    alt: 'hot dogs on the field',
    url: slide9,
  },
  {
    alt: 'a wide shot of our tent',
    url: slide10,
  },
  {
    alt: 'A summers day view',
    url: slide11,
  },
  {
    alt: 'An artist performing at ZZ',
    url: slide12,
  },
  {
    alt: 'A summers day view',
    url: slide13,
  },
  {
    alt: 'Bikers on our zomaarbike event',
    url: slide14,
  },
];

const Home = () => {
  return (
    <>
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
            <span>25</span>
            <Triangle />
            <span>27 JULY 2022</span>
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
                date: '2022-07-29',
              },
            }}
            passHref
          >
            <Artist
              isDateCard
              artist={{
                id: 3,
                name: 'Avalonn',
                date: '2022-07-29',
                isFiller: false,
                hour: '00:00 - 04:00',
                description: '',
                imgSrc: '/assets/artists/avalonn.jpg',
              }}
            />
          </Link>
          <Link
            href={{
              pathname: '/line-up',
              query: {
                date: '2022-07-30',
              },
            }}
            passHref
          >
            <Artist
              isDateCard
              artist={{
                id: 9,
                name: 'Uncle Phil',
                date: '2022-07-30',
                isFiller: false,
                hour: '22:00 - 23:30',
                description: '',
                imgSrc: '/assets/artists/uncle_phil.jpg',
              }}
            />
          </Link>
          <Link
            href={{
              pathname: '/line-up',
              query: {
                date: '2022-07-31',
              },
            }}
            passHref
          >
            <Artist
              isDateCard
              artist={{
                id: 19,
                name: 'Zomaar Quiz',
                date: '2022-07-31',
                isFiller: false,
                hour: '19:30 - 22:00',
                description: '',
                imgSrc: '/assets/artists/quiz.jpg',
              }}
            />
          </Link>
        </div>
        <div className={styles.buttons}>
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
        </div>
      </section>
      <section className={cn(styles.aftermovie__root)}>
        <div className={cn('container py-container')}>
          <div className={cn(styles.aftermovie__container)}>
            <div className={styles.aftermovie}>
              <ReactPlayer
                stopOnUnmount
                width={'100%'}
                height={'100%'}
                url="https://www.youtube.com/embed/G2s9r_BohUE"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-container">
        <Carousel duration={100000} slides={slides.splice(0, 6)} />
        <Carousel duration={150000} reverse slides={slides.splice(-6)} />
      </section>
    </>
  );
};

export default Home;

Home.Layout = Layout;
