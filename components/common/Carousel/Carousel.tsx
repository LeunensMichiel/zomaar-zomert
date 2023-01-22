// import dynamic from 'next/dynamic';
import { FC } from 'react';
import Marquee from 'react-fast-marquee';

// import { TickerProps } from 'react-infinite-ticker/dist/TickerProps';
import styles from './Carousel.module.scss';

// const HorizontalTicker = dynamic(
//   () => import('react-infinite-ticker').then((mod) => mod.HorizontalTicker),
//   {
//     ssr: false,
//   }
// );

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
      <Marquee direction={direction} speed={speed}>
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
