import { useUI } from '@lib/hooks';
import { IImageCard } from '@lib/models';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

import { TexturedImage } from '..';
import styles from './ImageCard.module.scss';

type Props = {
  data: IImageCard;
  playAnimation?: boolean;
  opensModal?: boolean;
};

const containerMotion = {
  initial: {
    scale: 1,
    transition: {
      type: 'spring',
      duration: 0.5,
    },
  },
  tap: {
    scale: 0.975,
    transition: {
      type: 'spring',
      duration: 0.2,
      bounce: 1,
    },
  },
  hover: {
    scale: 1.025,
    transition: {
      type: 'spring',
      duration: 0.2,
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
      duration: 0.5,
      type: 'spring',
    },
  },
};

export const ImageCard = forwardRef<HTMLAnchorElement, Props>(
  ({ data, opensModal = false, playAnimation, ...props }, ref) => {
    const { openModal, setModalView } = useUI();

    const handleArtistModalClick = () => {
      setModalView('ARTIST_VIEW', undefined, {
        data,
      });
      openModal();
    };

    return (
      <motion.a
        className={cn(styles.image__card)}
        ref={ref}
        tabIndex={0}
        {...((opensModal || playAnimation) && {
          initial: 'initial',
          whileHover: 'hover',
          whileFocus: 'tap',
          whileTap: 'tap',
          variants: containerMotion,
        })}
        {...(opensModal && {
          onClick: handleArtistModalClick,
        })}
        {...props}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.image__card__line}
        >
          <motion.rect
            width="100%"
            height="100%"
            fill="transparent"
            strokeWidth={opensModal ? '0' : '4'}
            stroke="var(--color-white)"
            variants={pathMotion}
          />
        </motion.svg>
        <div className={styles.image__card__inner}>
          <span className={styles.image__card__inner__title}>{data.title}</span>
          <span className={styles.image__card__inner__subtitle}>
            {data.subtitle}
          </span>
        </div>
        <TexturedImage alt={data.title} src={data.imgSrc} />
      </motion.a>
    );
  }
);

ImageCard.displayName = 'Artist';
