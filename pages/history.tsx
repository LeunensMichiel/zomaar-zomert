import { Layout } from '@components/common';
import cn from 'classnames';
import { NextSeo } from 'next-seo';

import styles from './styles/about.module.scss';
const HistoryPage = () => {
  return (
    <>
      <NextSeo
        title="History"
        description="Find out how Zomaar Zomert came to be! Only for the realy interested."
        openGraph={{
          title: 'History',
          description:
            'Find out how Zomaar Zomert came to be! Only for the realy interested.',
        }}
      />
      <section className={cn('container-page py-container--sm', styles.root)}>
        <h1 className={'header'}>How ZZ came to be</h1>
        <p>
          On the occasion of the annual fair in Sint-Anna-Pede, 24 years ago,
          the idea was born to organise an event within the timeframe of the
          fair from the Zomaar youth club. In July 1998 Zomaar Zomert was born.
        </p>
        <p>
          The first edition of the party weekend was an unexpected success.
          Since then, the event has grown steadily. Names like Kate Ryan,
          2Fabiola, Sam Gooris, Get Ready and Avalonn all liked to perform at
          our festival. The success led to the establishment of a non-profit
          organisation around our project in 2012. This way, the existence and
          sustainability of the project was assured.
        </p>
        <img
          src="/assets/slides/slide-9.jpg"
          alt="The Zomaar Zomert Crew"
          className={styles.image}
        />
        <p>
          Every year, we do our best to make Zomaar Zomert a successful festival
          weekend for everyone to enjoy. This would not have been possible
          without the current and past crewmembers, all of the volunteers, our
          partners and the support of municipality Dilbeek.
        </p>
      </section>
    </>
  );
};

export default HistoryPage;

HistoryPage.Layout = Layout;
