'use client';

import { ImageCard } from '@components/common';
import { Button, Spinner } from '@components/ui';
import { usePathname, useRouter } from '@lib/i18n/navigation';
import {
  Artist,
  getDateByDayString,
  ZZ_DATE_FRIDAY,
  ZZ_DATES,
  ZZ_YEAR,
} from '@lib/models';
import cn from 'classnames';
import { AnimatePresence, motion } from 'motion/react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './LineUpClient.module.scss';

const containerVariants = {
  hidden: {
    y: 10,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  exit: {
    y: -10,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  show: {
    y: 0,
    opacity: 1,
    transition: { staggerChildren: 0.05, duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  exit: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

type Props = { artists: Artist[] };

const LineUpClient = ({ artists }: Props) => {
  const t = useTranslations('line-up');
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(searchParams.get('date') ?? ZZ_DATE_FRIDAY);
  }, [searchParams]);

  const filteredArtists = useMemo(() => {
    const today = new Date();
    const endDate = new Date(
      new Date(ZZ_DATES[2]).setMonth(new Date(ZZ_DATES[2]).getMonth() + 8)
    );

    const result = artists
      .filter(
        (artist) =>
          new Date(artist.showFrom).getTime() <= today.getTime() &&
          today.getTime() <= endDate.getTime() &&
          getDateByDayString(artist.day) === currentDate &&
          new Date(artist.showFrom).getFullYear() >= ZZ_YEAR
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    if (result.length < 3) {
      const TBAs: Artist[] = Array.from(
        { length: 3 - result.filter((x) => x.name !== 'TBA').length },
        (_, i) => ({
          name: 'TBA',
          day: 'friday',
          hour: 'to be announced',
          description:
            'This artist will be announced soon! Stay in touch with our social channels or revisit zomaarzomert.be in the near future.',
          imgSrc: '/assets/artists/tba.webp',
          showFrom: i.toString(),
        })
      );
      result.push(...TBAs);
    }
    return result;
  }, [artists, currentDate]);

  const formattedDate = new Date(currentDate);

  const handleDaySelect = useCallback(
    (newDate: string) => {
      router.replace({ pathname, query: { date: newDate } }, { scroll: false });
      setCurrentDate(newDate);
    },
    [pathname, router]
  );

  return (
    <section className={cn(styles.root, 'container py-container--sm')}>
      {!currentDate ? (
        <Spinner size="xl" />
      ) : (
        <>
          <header>
            <AnimatePresence mode="wait">
              <motion.div
                className={styles.headerroot}
                key={currentDate ?? 'empty'}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className={cn(styles.title, 'header')}>
                  {formattedDate.toLocaleString(lang, { weekday: 'long' })}
                </h1>
                <span className={styles.date}>
                  {formattedDate.toLocaleString(lang, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <img
                  style={{
                    transform: `rotate(${(ZZ_DATES.indexOf(currentDate) + 1) * 45}deg)`,
                    maxHeight: '15rem',
                  }}
                  className={styles.star}
                  src="/assets/star.svg"
                  alt=""
                />
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
                {new Date(day).toLocaleString(lang, { weekday: 'long' })}
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
                <motion.div
                  variants={itemVariants}
                  key={`${artist.name} - ${artist.day} - ${artist.showFrom}`}
                >
                  <ImageCard
                    data={{
                      imgSrc: artist.imgSrc,
                      title: artist.name,
                      subtitle: artist.hour,
                      date: getDateByDayString(artist.day),
                      description: artist.description,
                      link: artist.link,
                    }}
                    opensModal={artist.name !== 'TBA'}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </>
      )}
      <span className="sr-only">{t('SEO.title')}</span>
    </section>
  );
};

export default LineUpClient;
