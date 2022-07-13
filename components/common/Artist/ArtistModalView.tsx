import { Artist } from '@lib/models';
import Image from 'next/future/image';
import { VFC } from 'react';

import styles from './ArtistModalView.module.scss';

type Props = {
  artist: Artist;
};

export const ArtistModalView: VFC<Props> = ({ artist }) => {
  return (
    <div className={styles.root}>
      <div className={styles.image__container}>
        <Image
          width={1080}
          height={1080}
          quality={20}
          className={styles.image}
          src={artist.imgSrc}
          alt={artist.name}
        />
        <picture>
          <source
            srcSet="/assets/tear-5-vertical.svg"
            media="(min-width: 1024px)"
          />
          <img src="/assets/tear-5.svg" alt="" className={styles.tear} />
        </picture>
      </div>
      <div className={styles.body}>
        <span className={styles.day}>
          {new Date(artist.date).toLocaleString('default', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
        <h1 className={styles.title}>{artist.name}</h1>
        <span className={styles.subtitle}>{artist.hour}</span>
        <p className={styles.text}>{artist.description}</p>
      </div>
    </div>
  );
};
