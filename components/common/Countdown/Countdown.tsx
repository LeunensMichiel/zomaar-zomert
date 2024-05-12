import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';

import { ZZ_DATE_FRIDAY } from '../../../lib/models';
import styles from './Countdown.module.scss';

const countDownDate = new Date(`${ZZ_DATE_FRIDAY} 16:00:00`).getTime();

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

const useCountdown = (targetDate: number) => {
  const [countDown, setCountDown] = useState(targetDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(targetDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return getReturnValues(countDown);
};

export const Countdown = () => {
  const { t } = useTranslation('home');
  const [days, hours, minutes, seconds] = useCountdown(countDownDate);

  if (days + hours + minutes + seconds <= 0) {
    return (
      <div className={styles.timer}>
        <span className={styles.timer__item}>
          <span className={styles.timer__item__number}>00</span>
          <span className={styles.timer__item__unit}>{t('days')}</span>
        </span>
        <span className={styles.timer__item}>
          <span className={styles.timer__item__number}>00</span>
          <span className={styles.timer__item__unit}>{t('hours')}</span>
        </span>
        <span className={styles.timer__item}>
          <span className={styles.timer__item__number}>00</span>
          <span className={styles.timer__item__unit}>{t('minutes')}</span>
        </span>
        <span className={styles.timer__item}>
          <span className={styles.timer__item__number}>00</span>
          <span className={styles.timer__item__unit}>{t('seconds')}</span>
        </span>
        <span className={styles['expired-notice']}>
          {t('festivalHasStarted')}
        </span>
      </div>
    );
  } else {
    return (
      <div className={styles.timer}>
        <span className={styles.timer__item}>
          <span className={styles.timer__item__number}>
            {String(days).padStart(2, '0')}
          </span>
          <span className={styles.timer__item__unit}>{t('days')}</span>
        </span>
        <span className={styles.timer__item}>
          <span className={styles.timer__item__number}>
            {String(hours).padStart(2, '0')}
          </span>
          <span className={styles.timer__item__unit}>{t('hours')}</span>
        </span>
        <span className={styles.timer__item}>
          <span className={styles.timer__item__number}>
            {String(minutes).padStart(2, '0')}
          </span>
          <span className={styles.timer__item__unit}>{t('minutes')}</span>
        </span>
        <span className={styles.timer__item}>
          <span className={styles.timer__item__number}>
            {String(seconds).padStart(2, '0')}
          </span>
          <span className={styles.timer__item__unit}>{t('seconds')}</span>
        </span>
      </div>
    );
  }
};
