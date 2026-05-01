'use client';

import { ZZ_DATE_FRIDAY, ZZ_DATE_MONDAY } from '@lib/models';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const countDownDate = new Date(`${ZZ_DATE_FRIDAY} 16:00:00`).getTime();

const getReturnValues = (countDown: number) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  return [days, hours, minutes, seconds];
};

const useCountdown = (targetDate: number) => {
  const [countDown, setCountDown] = useState<number | null>(null);

  useEffect(() => {
    setCountDown(targetDate - new Date().getTime());
    const interval = setInterval(() => {
      setCountDown(targetDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return countDown === null ? null : getReturnValues(countDown);
};

function TimerCell({
  value,
  unit,
  highlight,
}: {
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <span className="font-display flex flex-col items-center text-center font-bold uppercase md:flex-row md:items-end md:gap-2">
      <span
        className={`xs:text-5xl inline-block min-w-[2ch] text-2xl md:text-6xl xl:text-7xl ${
          highlight ? 'text-brand-500' : ''
        }`}
      >
        {value}
      </span>
      <span className="text-2xl">{unit}</span>
    </span>
  );
}

export function Countdown() {
  const t = useTranslations('home');
  const values = useCountdown(countDownDate);

  if (!values) {
    return (
      <div className="relative flex flex-wrap items-center justify-center gap-4 md:gap-8">
        <TimerCell value="00" unit={t('days')} />
        <TimerCell value="00" unit={t('hours')} />
        <TimerCell value="00" unit={t('minutes')} />
        <TimerCell value="00" unit={t('seconds')} highlight />
      </div>
    );
  }

  const [days, hours, minutes, seconds] = values;
  const today = new Date();
  const lastDay = new Date(ZZ_DATE_MONDAY);

  if (days + hours + minutes + seconds <= 0) {
    return (
      <div className="relative flex flex-wrap items-center justify-center gap-4 md:gap-8">
        <TimerCell value="00" unit={t('days')} />
        <TimerCell value="00" unit={t('hours')} />
        <TimerCell value="00" unit={t('minutes')} />
        <TimerCell value="00" unit={t('seconds')} highlight />
        <span className="font-display absolute -rotate-[10deg] bg-gray-900 px-3 py-1.5 text-center text-3xl tracking-widest text-pink-400 uppercase md:text-5xl xl:text-6xl">
          {today.getTime() >= lastDay.getTime()
            ? 'See you next year!'
            : t('festivalHasStarted')}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-wrap items-center justify-center gap-4 md:gap-8">
      <TimerCell value={String(days).padStart(2, '0')} unit={t('days')} />
      <TimerCell value={String(hours).padStart(2, '0')} unit={t('hours')} />
      <TimerCell value={String(minutes).padStart(2, '0')} unit={t('minutes')} />
      <TimerCell
        value={String(seconds).padStart(2, '0')}
        unit={t('seconds')}
        highlight
      />
    </div>
  );
}
