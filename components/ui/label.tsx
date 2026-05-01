import { cn } from '@lib/utils';
import { type ComponentProps } from 'react';

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      className={cn(
        'font-display mb-4 block text-2xl font-bold tracking-wide text-blue-700 uppercase transition-colors',
        className
      )}
      {...props}
    />
  );
}
