import { ImageWithAspectRatio } from '@components/ui';
import { VFC } from 'react';

import styles from './TexturedImage.module.scss';
type Props = {
  alt: string;
  src: string;
};

export const TexturedImage: VFC<Props> = ({ alt, src }) => {
  return (
    <ImageWithAspectRatio
      wrapperClassName={styles.root}
      aspectRatio="1/1"
      width={1080}
      height={1080}
      alt={alt}
      src={src}
      quality={10}
    />
  );
};
