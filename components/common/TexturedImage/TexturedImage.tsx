import { ImageWithAspectRatio } from '@components/ui';
import { FC } from 'react';

import styles from './TexturedImage.module.scss';
type Props = {
  alt: string;
  src: string;
};

export const TexturedImage: FC<Props> = ({ alt, src }) => {
  return (
    <ImageWithAspectRatio
      wrapperClassName={styles.root}
      aspectRatio="1/1"
      alt={alt}
      src={src}
    />
  );
};
