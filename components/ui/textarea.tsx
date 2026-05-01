import { cn } from '@lib/utils';
import { type ComponentProps, type Ref } from 'react';
import { type FieldError as RHFFieldError } from 'react-hook-form';

import { FieldError } from './field-error';
import { Label } from './label';

type TextareaProps = ComponentProps<'textarea'> & {
  ref?: Ref<HTMLTextAreaElement>;
  label: string;
  error?: RHFFieldError;
  withFeedback?: boolean;
};

export function Textarea({
  ref,
  name,
  label,
  error,
  className,
  withFeedback = true,
  ...rest
}: TextareaProps) {
  return (
    <div className="group">
      <Label htmlFor={name} className="group-focus-within:text-pink-400">
        {label}
      </Label>
      <textarea
        id={name}
        ref={ref}
        name={name}
        aria-invalid={!!error}
        className={cn(
          'min-h-48 w-full resize-y rounded-none border-0 bg-white px-3 py-4 text-sm leading-relaxed text-gray-800 transition-colors outline-none',
          'placeholder:text-blue-300 focus:placeholder:text-pink-400',
          'disabled:bg-gray-100 disabled:text-gray-300',
          className
        )}
        {...rest}
      />
      {withFeedback && <FieldError error={error} />}
    </div>
  );
}
