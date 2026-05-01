import { cn } from "@lib/utils";
import { type ReactNode } from "react";
import { type FieldError as RHFFieldError } from "react-hook-form";

import { FieldError } from "./field-error";

type FieldsetProps = {
  label: string;
  error?: RHFFieldError;
  withFeedback?: boolean;
  className?: string;
  children?: ReactNode;
};

export function Fieldset({
  label,
  children,
  error,
  withFeedback = true,
  className,
}: FieldsetProps) {
  return (
    <fieldset className={cn("grid", className)}>
      <legend className="font-display mb-6 block text-base font-bold tracking-wide text-gray-900 uppercase">
        {label}
      </legend>
      <div className="grid grid-cols-1 justify-items-start gap-2">
        {children}
      </div>
      {withFeedback && <FieldError error={error} />}
    </fieldset>
  );
}
