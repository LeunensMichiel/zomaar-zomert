import { cn } from '@lib/utils';
import { CircleAlert } from 'lucide-react';
import { type FieldError as RHFFieldError } from 'react-hook-form';

type FieldErrorProps = {
  error?: RHFFieldError;
  className?: string;
};

export function FieldError({ error, className }: FieldErrorProps) {
  return (
    <div
      role="alert"
      className={cn('mt-2 flex min-h-3 items-center text-pink-700', className)}
    >
      {error && (
        <>
          <CircleAlert className="mr-1 h-3 w-3" />
          <small className="text-xs leading-none">{error.message}</small>
        </>
      )}
    </div>
  );
}
