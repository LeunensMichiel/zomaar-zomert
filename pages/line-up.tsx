import { Artist, Layout } from '@components/common';
import { Button, Spinner } from '@components/ui';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useCallback, useEffect, useMemo, useState } from 'react';

import avalonn from '../public/assets/artists/avalonn.jpg';
import bike from '../public/assets/artists/bike.jpg';
import creator from '../public/assets/artists/creator.jpg';
import dimitriWouters from '../public/assets/artists/dimitri_wouters.jpg';
import forTheRecord from '../public/assets/artists/for_the_record.jpg';
import kaaprisun from '../public/assets/artists/kaaprisun.jpg';
import kinderanimatie from '../public/assets/artists/kinderanimatie.jpg';
import mrCreezy from '../public/assets/artists/mr_creezy.jpg';
import paella from '../public/assets/artists/paella.jpg';
import petanque from '../public/assets/artists/petanque.jpg';
import quiz from '../public/assets/artists/quiz.jpg';
import romeos from '../public/assets/artists/romeos.jpg';
import run from '../public/assets/artists/run.jpg';
import terras from '../public/assets/artists/terras.jpg';
import twallie from '../public/assets/artists/twallie.jpg';
import unclePhil from '../public/assets/artists/uncle_phil.jpg';
import wimSoutaer from '../public/assets/artists/wim_soutaer.jpg';
import tear from '../public/assets/tear-4.svg';
import styles from './styles/line-up.module.scss';

const data = {
  friday: {
    date: '29 July 2022',
    artists: [
      {
        src: forTheRecord,
        title: 'For The Record',
        day: '21:30-22:30',
      },
      {
        src: kaaprisun,
        title: 'Kaaprisun',
        day: '22:30-00:00',
      },
      {
        src: avalonn,
        title: 'Avalonn',
        day: '00:00-04:00',
      },
      {
        src: tear,
        title: 'Activities',
        day: '🌞🌞🌞',
      },
      {
        src: bike,
        title: 'Zomaar Bike',
        day: '16:00-22:00',
      },
      {
        src: terras,
        title: 'Zomaar Café',
        day: 'All Day',
      },
    ],
  },
  saturday: {
    date: '30 July 2022',
    artists: [
      {
        src: romeos,
        title: "De Romeo's",
        day: '20:00:21:00',
      },
      {
        src: wimSoutaer,
        title: 'Wim Soutaer',
        day: '21:00-22:00',
      },
      {
        src: unclePhil,
        title: 'Uncle Phil',
        day: '22:00-23:30',
      },
      {
        src: dimitriWouters,
        title: 'Dimitri Wouters',
        day: '23:30-01:00',
      },
      {
        src: creator,
        title: 'DJ Creator',
        day: '01:00-02:30',
      },
      {
        src: twallie,
        title: 'Twallie',
        day: '02:30-04:00',
      },
      {
        src: tear,
        title: 'Activities',
        day: '🌞🌞🌞',
      },
      {
        src: petanque,
        title: 'Petanque',
        day: '12:30-17:00',
      },
      {
        src: terras,
        title: 'Zomaar Café',
        day: 'All Day',
      },
    ],
  },
  sunday: {
    date: '31 July 2022',
    artists: [
      {
        src: mrCreezy,
        title: 'Mr. Creezy',
        day: '13:00-16:00',
      },
      {
        src: run,
        title: 'Zomaar Run',
        day: '10:00-11:00',
      },
      {
        src: paella,
        title: 'Paella',
        day: '12:00-15:00',
      },
      {
        src: quiz,
        title: 'Zomaar Quiz',
        day: '19:30-22:00',
      },
      {
        src: kinderanimatie,
        title: 'Kids Park',
        day: 'All Day',
      },
      {
        src: terras,
        title: 'Zomaar Café',
        day: 'All Day',
      },
    ],
  },
};

const containerVariants = {
  hidden: {
    y: 10,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    y: -10,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  exit: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
  },
};

const LineUpPage = () => {
  const { query, replace, pathname, isReady } = useRouter();
  const [currentDay, setCurrentDay] = useState('');

  const currentData = useMemo(
    () => data[currentDay as keyof typeof data],
    [currentDay]
  );

  useEffect(() => {
    if (!isReady) return;
    setCurrentDay((query?.day as string) ?? 'friday');
  }, [isReady, query?.day]);

  const handleDaySelect = useCallback(
    (newDay: string) => {
      replace(
        {
          pathname,

          query: {
            ...query,
            day: newDay,
          },
        },
        undefined,
        { scroll: false }
      );
      setCurrentDay(newDay);
    },
    [pathname, replace, query]
  );

  return (
    <>
      <NextSeo
        title="Line-Up"
        description="Zomaar Zomert takes place during the last weekend of July. From Friday to Sunday, we provide numerous artists and fringe activities to make it a memorable summer day. This year, Dimitri Wouters, De Romeo's, Avalonn, Creator and Uncle Phil, among others, will be present."
        openGraph={{
          title: 'Line-Up',
          description:
            "Zomaar Zomert takes place during the last weekend of July. From Friday to Sunday, we provide numerous artists and fringe activities to make it a memorable summer day. This year, Dimitri Wouters, De Romeo's, Avalonn, Creator and Uncle Phil, among others, will be present.",
        }}
      />
      <section className={cn(styles.root, 'container py-container--sm')}>
        {!currentDay ? (
          <Spinner size="xl" />
        ) : (
          <>
            <header>
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  key={currentDay ?? 'empty'}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className={styles.title}>{currentDay}</h1>
                  <span className={styles.date}>{currentData?.date}</span>
                </motion.div>
              </AnimatePresence>
            </header>
            <div className={styles.tabs}>
              {Object.keys(data).map((day) => (
                <Button
                  key={day}
                  size="sm"
                  variant="minimal"
                  onClick={() => handleDaySelect(day)}
                >
                  {day}
                  {day === currentDay ? (
                    <motion.div
                      className={styles.underline}
                      layoutId="underline"
                    />
                  ) : null}
                </Button>
              ))}
            </div>
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={currentDay ?? 'empty'}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className={styles.artists}
              >
                {currentData?.artists.map(({ title, src, day }) => (
                  <motion.div variants={itemVariants} key={title}>
                    <Artist
                      alt={title}
                      src={src}
                      subtitle={day}
                      title={title}
                      opensModal
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </section>
    </>
  );
};

export default LineUpPage;

LineUpPage.Layout = Layout;
