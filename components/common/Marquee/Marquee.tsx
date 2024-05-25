import { useScreen } from '@lib/hooks';
import { FC } from 'react';
import FastMarquee from 'react-fast-marquee';

import styles from './Marquee.module.scss';

type MarqueeProps = {
  slides: Array<{ url: string; alt?: string }>;
  speed: number;
  direction: 'left' | 'right';
};

export const Marquee: FC<MarqueeProps> = ({
  slides,
  speed = 20,
  direction,
}) => {
  const screen = useScreen();
  const isMobile = (screen?.width ?? 0) < 768;

  return (
    <div className={styles.root}>
      <FastMarquee
        direction={direction}
        speed={isMobile ? speed / 5 : speed}
        gradient={false}
        className={styles.slide__container}
      >
        {slides?.map((slide) => (
          <img
            src={slide.url}
            key={slide.url}
            className={styles.slide}
            alt={slide.alt}
            loading="lazy"
          />
        ))}
      </FastMarquee>
    </div>
  );
};
