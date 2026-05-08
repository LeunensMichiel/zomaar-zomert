import { cn } from "@lib/utils";
import { type ComponentProps, type Ref } from "react";
import { type FieldError as RHFFieldError } from "react-hook-form";

import { FieldError } from "./field-error";
import { Label } from "./label";

type TextareaProps = ComponentProps<"textarea"> & {
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
      <Label htmlFor={name} className="group-focus-within:text-brand-500">
        {label}
      </Label>
      <textarea
        id={name}
        ref={ref}
        name={name}
        aria-invalid={!!error}
        className={cn(
          "min-h-40 w-full resize-y rounded-none border-2 border-gray-900 bg-white px-4 py-3 text-base leading-relaxed text-gray-900 transition-colors outline-none",
          "placeholder:text-gray-400 focus:bg-pink-50",
          "aria-invalid:border-brand-500",
          "disabled:bg-gray-100 disabled:text-gray-400",
          className,
        )}
        {...rest}
      />
      {withFeedback && <FieldError error={error} />}
    </div>
  );
}
