import { IImageCard } from '@lib/models';
import { formatArtistName } from '@lib/utils/string';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

import styles from './ImageCardModalView.module.scss';

type Props = {
  data: IImageCard;
};

export const ImageCardModalView: FC<Props> = ({ data }) => {
  const { lang, t } = useTranslation();
  return (
    <div className={styles.root}>
      <div className={styles.image__container}>
        <img className={styles.image} src={data.imgSrc} alt={data.title} />
        <picture>
          <source
            srcSet="/assets/tear-7-vertical.svg"
            media="(min-width: 1024px)"
          />
          <img src="/assets/tear-7.svg" alt="" className={styles.tear} />
        </picture>
      </div>
      <div className={styles.body}>
        <span className={styles.day}>
          {data.date &&
            new Date(data.date).toLocaleString(lang, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
        </span>
        <h1 className={styles.title}>{formatArtistName(data.title)}</h1>
        <span className={styles.subtitle}>{data.subtitle}</span>
        <p className={styles.text}>{data.description}</p>
        {data.link && (
          <a
            className={styles.link}
            href={data.link}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t('register')}
          </a>
        )}
      </div>
    </div>
  );
};
