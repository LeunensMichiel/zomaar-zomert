import Image, { StaticImageData } from 'next/future/image';
import { VFC } from 'react';
import { HorizontalTicker } from 'react-infinite-ticker';
import { TickerProps } from 'react-infinite-ticker/dist/TickerProps';

import styles from './Carousel.module.scss';

type CarouselProps = {
  slides: Array<{ url: string | StaticImageData; alt?: string }>;
} & TickerProps;

export const Carousel: VFC<CarouselProps> = ({
  slides,
  duration = 25000,
  ...props
}) => {
  return (
    <div className={styles.root}>
      <HorizontalTicker duration={duration} {...props}>
        {slides?.map((slide) => (
          <Image
            src={slide.url}
            key={slide.alt}
            className={styles.slide}
            alt={slide.alt}
            quality={80}
            placeholder="blur"
          />
        ))}
      </HorizontalTicker>
    </div>
  );
};
