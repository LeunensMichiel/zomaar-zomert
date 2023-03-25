import { FC } from 'react';
import Marquee from 'react-fast-marquee';

import styles from './Carousel.module.scss';

type CarouselProps = {
  slides: Array<{ url: string; alt?: string }>;
  speed: number;
  direction: 'left' | 'right';
};

export const Carousel: FC<CarouselProps> = ({
  slides,
  speed = 25000,
  direction,
}) => {
  return (
    <div className={styles.root}>
      <Marquee direction={direction} speed={speed} gradient={false}>
        {slides?.map((slide) => (
          <img
            src={slide.url}
            key={slide.url}
            className={styles.slide}
            alt={slide.alt}
          />
        ))}
      </Marquee>
    </div>
  );
};
