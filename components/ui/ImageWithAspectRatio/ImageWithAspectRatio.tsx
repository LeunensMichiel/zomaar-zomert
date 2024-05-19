import cn from 'classnames';
import { CSSProperties, ImgHTMLAttributes } from 'react';

import styles from './ImageWithAspectRatio.module.scss';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  aspectRatio: string;
  wrapperClassName?: string;
  alt: string;
};

const ImageWithAspectRatio = ({
  aspectRatio,
  src,
  wrapperClassName,
  alt,
  ...rest
}: Props) => {
  const [width, height] = aspectRatio.split('/');

  const containerStyle: CSSProperties = {
    paddingTop: `${100 / (Number(width) / Number(height))}%`,
  };

  return (
    <div
      className={cn(styles.imgContainer, wrapperClassName)}
      style={containerStyle}
    >
      <img src={src} alt={alt} {...rest} />
    </div>
  );
};

export default ImageWithAspectRatio;
