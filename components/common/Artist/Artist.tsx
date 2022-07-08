import { ImageWithAspectRatio } from '@components/ui';
import { motion } from 'framer-motion';
import { StaticImageData } from 'next/future/image';
import { forwardRef } from 'react';

import styles from './Artist.module.scss';

type Props = {
  src: StaticImageData;
  title: string;
  subtitle: string;
  alt: string;
};

const containerMotion = {
  initial: {
    scale: 1,
    transition: {
      duration: 0.4,
      type: 'spring',
    },
  },
  tap: {
    scale: 0.975,
    transition: {
      duration: 1,
      type: 'spring',
    },
  },
  hover: {
    scale: 1.025,
    transition: {
      duration: 1,
      type: 'spring',
    },
  },
};

const pathMotion = {
  initial: {
    pathLength: 0,
    transition: {
      duration: 0.5,
      type: 'spring',
    },
  },
  tap: {
    pathLength: 1,
    transition: {
      duration: 1,
      type: 'spring',
    },
  },
  hover: {
    pathLength: 1,
    transition: {
      duration: 1,
      type: 'spring',
    },
  },
};

export const Artist = forwardRef<HTMLAnchorElement, Props>(
  ({ alt, src, subtitle, title, ...props }, ref) => {
    return (
      <motion.a
        className={styles.artist}
        ref={ref}
        initial="initial"
        whileHover="hover"
        whileFocus="tap"
        whileTap="tap"
        tabIndex={0}
        variants={containerMotion}
        {...props}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.artist__line}
        >
          <motion.rect
            width="100%"
            height="100%"
            fill="transparent"
            strokeWidth="4"
            stroke="var(--color-white)"
            variants={pathMotion}
          />
        </motion.svg>
        <div className={styles.artist__inner}>
          <span className={styles.artist__inner__title}>{title}</span>
          <span className={styles.artist__inner__subtitle}>{subtitle}</span>
        </div>

        <ImageWithAspectRatio
          wrapperClassName={styles.artist__image}
          aspectRatio="1/1"
          alt={alt}
          src={src}
        />
      </motion.a>
    );
  }
);

Artist.displayName = 'Artist';
