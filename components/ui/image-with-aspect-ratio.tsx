import { cn } from '@lib/utils';
import { type ComponentProps } from 'react';

type Props = ComponentProps<'img'> & {
  aspectRatio: string;
  wrapperClassName?: string;
  alt: string;
};

export function ImageWithAspectRatio({
  aspectRatio,
  src,
  wrapperClassName,
  alt,
  className,
  ...rest
}: Props) {
  const [w, h] = aspectRatio.split('/').map(Number);
  const ratio = `${100 / (w / h)}%`;

  return (
    <div
      className={cn('relative h-0 w-full overflow-hidden', wrapperClassName)}
      style={{ paddingTop: ratio }}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'absolute inset-0 z-0 h-full w-full object-cover object-center',
          className
        )}
        {...rest}
      />
    </div>
  );
}
