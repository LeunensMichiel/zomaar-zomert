import { useUI } from '@lib/hooks';
import { Artist as ArtistType } from '@lib/models';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

import { TexturedImage } from '..';
import styles from './Artist.module.scss';

type Props = {
  artist: ArtistType;
  isDateCard?: boolean;
  opensModal?: boolean;
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
  ({ artist, opensModal = false, isDateCard = false, ...props }, ref) => {
    const { openModal, setModalView } = useUI();

    const handleArtistModalClick = () => {
      setModalView('ARTIST_VIEW', undefined, {
        artist,
      });
      openModal();
    };

    return (
      <motion.a
        className={cn(styles.artist, {
          [styles.static]: artist.isFiller,
        })}
        ref={ref}
        tabIndex={0}
        {...(!artist.isFiller && {
          initial: 'initial',
          whileHover: 'hover',
          whileFocus: 'tap',
          whileTap: 'tap',
          variants: containerMotion,
        })}
        {...(opensModal &&
          !artist.isFiller && {
            onClick: handleArtistModalClick,
          })}
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
            strokeWidth={artist.isFiller ? '0' : '4'}
            stroke="var(--color-white)"
            variants={pathMotion}
          />
        </motion.svg>
        <div className={styles.artist__inner}>
          <span className={styles.artist__inner__title}>
            {isDateCard
              ? new Date(artist.date).toLocaleString('default', {
                  weekday: 'long',
                })
              : artist.name}
          </span>
          <span className={styles.artist__inner__subtitle}>
            {isDateCard
              ? new Date(artist.date).toLocaleString('default', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : artist.hour}
          </span>
        </div>
        <TexturedImage alt={artist.name} src={artist.imgSrc} />
      </motion.a>
    );
  }
);

Artist.displayName = 'Artist';
