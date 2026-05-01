import { cn } from '@lib/utils';
import { type ComponentProps, type Ref } from 'react';
import { type FieldError as RHFFieldError } from 'react-hook-form';

import { FieldError } from './field-error';
import { Label } from './label';

type InputProps = ComponentProps<'input'> & {
  ref?: Ref<HTMLInputElement>;
  label: string;
  error?: RHFFieldError;
  withFeedback?: boolean;
};

const getInputMode = (
  type?: ComponentProps<'input'>['type']
): ComponentProps<'input'>['inputMode'] => {
  switch (type) {
    case 'email':
      return 'email';
    case 'number':
      return 'decimal';
    case 'tel':
      return 'tel';
    case 'date':
    case 'datetime-local':
      return 'numeric';
    case 'password':
      return 'text';
    case 'search':
      return 'search';
    case 'url':
      return 'url';
    default:
      return 'text';
  }
};

export function Input({
  ref,
  name,
  label,
  error,
  type = 'text',
  className,
  withFeedback = true,
  ...rest
}: InputProps) {
  return (
    <div className="group">
      <Label htmlFor={name} className="group-focus-within:text-pink-400">
        {label}
      </Label>
      <input
        id={name}
        ref={ref}
        name={name}
        type={type}
        inputMode={getInputMode(type)}
        aria-invalid={!!error}
        className={cn(
          'min-h-9 w-full rounded-none border-0 bg-white px-3 py-4 text-sm text-gray-800 transition-colors outline-none',
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
