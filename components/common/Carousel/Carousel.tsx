import dynamic from 'next/dynamic';
import { FC } from 'react';
import { TickerProps } from 'react-infinite-ticker/dist/TickerProps';

import styles from './Carousel.module.scss';

const HorizontalTicker = dynamic(
  () => import('react-infinite-ticker').then((mod) => mod.HorizontalTicker),
  {
    ssr: false,
  }
);

type CarouselProps = {
  slides: Array<{ url: string; alt?: string }>;
} & TickerProps;

export const Carousel: FC<CarouselProps> = ({
  slides,
  duration = 25000,
  ...props
}) => {
  return (
    <div className={styles.root}>
      <HorizontalTicker duration={duration} {...props}>
        {slides?.map((slide) => (
          <img
            src={slide.url}
            key={slide.url}
            className={styles.slide}
            alt={slide.alt}
          />
        ))}
      </HorizontalTicker>
    </div>
  );
};
