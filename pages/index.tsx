import { Countdown, Layout } from '@components/common';
import { Triangle } from '@components/icons';
import { Logo } from '@components/ui';
import cn from 'classnames';
import { NextSeo } from 'next-seo';

import styles from './styles/index.module.scss';

const Home = () => {
  return (
    <>
      <NextSeo
        title={'Home'}
        description="Zomaar Zomert is een festival in het hartje van Itterbeek, aan de Sint-Anna-kerk. Heel het laatste weekend van Juli kan u genieten van frisse drankjes, tal van optredens + randactiviteiten en een buitengewoon zomers weekend. ☀🚀"
        openGraph={{
          title: 'Home',
          description:
            'Zomaar Zomert is een festival in het hartje van Itterbeek, aan de Sint-Anna-kerk. Heel het laatste weekend van Juli kan u genieten van frisse drankjes, tal van optredens + randactiviteiten en een buitengewoon zomers weekend. ☀🚀',
        }}
      />
      <section className={cn(styles.landing)}>
        <video playsInline autoPlay muted poster="/assets/card.jpg" loop>
          <source src="/assets/landing.mp4" type="video/mp4" />
        </video>
        <div className={cn(styles.landing__inner, 'container')}>
          <Logo variant="full" className={styles.logo} />
          <span className={styles.date}>
            <span>29</span>
            <Triangle />
            <span>31 JULY 2022</span>
          </span>
        </div>
      </section>
      <img
        className={styles.tear}
        src="/assets/tear.svg"
        alt="paper tear element"
      />
      <section className={cn(styles.countdown, 'container py-container')}>
        <Countdown />
      </section>
    </>
  );
};

export default Home;

Home.Layout = Layout;
