import { Artist, Countdown, Layout } from '@components/common';
import { Triangle } from '@components/icons';
import { Logo } from '@components/ui';
import cn from 'classnames';
import Link from 'next/link';

import photo3 from '../public/assets/artists/quiz.jpg';
import photo1 from '../public/assets/artists/twallie.jpg';
import photo2 from '../public/assets/artists/uncle_phil.jpg';
import styles from './styles/index.module.scss';

const Home = () => {
  return (
    <>
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
      <section className={cn('container py-container', styles.countdown)}>
        <div>
          <Countdown />
        </div>
        <div className={styles.artists}>
          <Link href="/line-up?day=friday" passHref>
            <Artist
              alt="Photograph of DJ Twallie"
              src={photo1}
              subtitle="29 July 2022"
              title="Friday"
            />
          </Link>
          <Link href="/line-up?day=saturday" passHref>
            <Artist
              alt="Photograph of the cover band Uncle Phil"
              src={photo2}
              subtitle="30 July 2022"
              title="Saturday"
            />
          </Link>
          <Link href="/line-up?day=sunday" passHref>
            <Artist
              alt="Photograph of the Zomaar Zomert terrain at night"
              src={photo3}
              subtitle="31 July 2022"
              title="Sunday"
            />
          </Link>
        </div>
      </section>
      <section></section>
    </>
  );
};

export default Home;

Home.Layout = Layout;
