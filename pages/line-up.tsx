import { Artist, Layout } from '@components/common';
import { Button, Spinner } from '@components/ui';
import { ZZ_DATES } from '@lib/models';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useCallback, useEffect, useState } from 'react';

import data from '../public/data.json';
import styles from './styles/line-up.module.scss';

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
  const [currentDate, setCurrentDate] = useState('');

  const filteredArtists = data?.filter(
    (artist) => artist?.date === currentDate
  );
  const formattedDate = new Date(currentDate);

  useEffect(() => {
    if (!isReady) return;
    setCurrentDate((query?.date as string) ?? '2022-07-29');
  }, [isReady, query?.date]);

  const handleDaySelect = useCallback(
    (newDate: string) => {
      replace(
        {
          pathname,
          query: {
            ...query,
            date: newDate,
          },
        },
        undefined,
        { scroll: false }
      );
      setCurrentDate(newDate);
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
        {!currentDate ? (
          <Spinner size="xl" />
        ) : (
          <>
            <header>
              <AnimatePresence exitBeforeEnter>
                <motion.div
                  key={currentDate ?? 'empty'}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className={styles.title}>
                    {formattedDate.toLocaleString('default', {
                      weekday: 'long',
                    })}
                  </h1>
                  <span className={styles.date}>
                    {formattedDate.toLocaleString('default', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </motion.div>
              </AnimatePresence>
            </header>
            <div className={styles.tabs}>
              {ZZ_DATES.map((day) => (
                <Button
                  key={day}
                  size="sm"
                  variant="minimal"
                  onClick={() => handleDaySelect(day)}
                >
                  {new Date(day).toLocaleString('default', {
                    weekday: 'long',
                  })}
                  {day === currentDate ? (
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
                key={currentDate ?? 'empty'}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className={styles.artists}
              >
                {filteredArtists.map((artist) => (
                  <motion.div variants={itemVariants} key={artist.id}>
                    <Artist artist={artist} opensModal />
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
