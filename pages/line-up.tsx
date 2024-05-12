import { ImageCard, Layout } from '@components/common';
import { Button, Spinner } from '@components/ui';
import {
  APIArtist,
  Artist,
  languages,
  ZZ_DATE_FRIDAY,
  ZZ_DATES,
} from '@lib/models';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import fsPromises from 'fs/promises';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import path from 'path';
import { useCallback, useEffect, useState } from 'react';

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

const LineUpPage = ({
  artists,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t, lang } = useTranslation('line-up');
  const { query, replace, pathname, isReady } = useRouter();
  const [currentDate, setCurrentDate] = useState('');

  const filteredArtists = artists?.filter(
    (artist) =>
      artist?.date === currentDate &&
      new Date() >= new Date(artist.hiddenUntil) &&
      new Date() <= new Date(artist.hiddenFrom)
  );
  if (!filteredArtists.length) {
    filteredArtists.push({
      id: 0,
      name: 'TBA',
      date: ZZ_DATE_FRIDAY,
      hour: 'to be announced',
      hiddenUntil: '',
      hiddenFrom: '',
      isFiller: true,
      description:
        'This artist will be announced soon! Stay in touch with our social channels or revisit zomaarzomert.be in the near future.',
      imgSrc: '/assets/artists/tba.jpg',
    });
  }
  const formattedDate = new Date(currentDate);

  useEffect(() => {
    if (!isReady) return;
    setCurrentDate((query?.date as string) ?? ZZ_DATE_FRIDAY);
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
        title={t('SEO.title')}
        description={t('SEO.description')}
        openGraph={{
          title: t('SEO.openGraph.title'),
          description: t('SEO.openGraph.description'),
        }}
      />
      <section className={cn(styles.root, 'container py-container--sm')}>
        {!currentDate ? (
          <Spinner size="xl" />
        ) : (
          <>
            <header>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDate ?? 'empty'}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className={cn(styles.title, 'header')}>
                    {formattedDate.toLocaleString(lang, {
                      weekday: 'long',
                    })}
                  </h1>
                  <span className={styles.date}>
                    {formattedDate.toLocaleString(lang, {
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
                  size="md"
                  variant="minimal"
                  onClick={() => handleDaySelect(day)}
                >
                  {new Date(day).toLocaleString(lang, {
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
            <AnimatePresence mode="wait">
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
                    <ImageCard
                      data={{
                        imgSrc: artist.imgSrc,
                        title: artist.name,
                        subtitle: artist.hour,
                        date: artist.date,
                        description: artist.description,
                      }}
                      opensModal={!artist.isFiller}
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

export const getStaticProps: GetStaticProps<{ artists: Artist[] }> = async ({
  locale,
}) => {
  const filePath = path.join(process.cwd(), 'public/data.json');
  const jsonData = await fsPromises.readFile(filePath, 'utf-8');
  const apiArtists: APIArtist[] = JSON.parse(jsonData);

  const artists: Artist[] = apiArtists.map(
    ({ name, description, ...artist }) => ({
      ...artist,
      name: name[locale as languages],
      description: description[locale as languages],
    })
  );

  return {
    props: { artists },
  };
};
