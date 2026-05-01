import { cn } from "@lib/utils";
import { type ComponentProps, type Ref } from "react";

type RadioProps = Omit<ComponentProps<"input">, "type"> & {
  ref?: Ref<HTMLInputElement>;
  label: string;
};

export function Radio({
  ref,
  name,
  label,
  className,
  disabled,
  ...rest
}: RadioProps) {
  return (
    <label
      htmlFor={label}
      className={cn(
        "grid grid-cols-[min-content_auto] items-center gap-3 text-gray-900",
        disabled && "cursor-not-allowed text-gray-300",
        className,
      )}
    >
      <span className="relative grid h-6 w-6 place-items-center">
        <input
          id={label}
          type="radio"
          name={name}
          ref={ref}
          disabled={disabled}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...rest}
        />
        <span
          className={cn(
            "inline-grid h-6 w-6 place-items-center rounded-full border-2 border-yellow-900 transition-colors",
            "peer-checked:border-brand-500",
            "peer-disabled:border-gray-200",
          )}
        >
          <span
            className={cn(
              "h-3 w-3 scale-0 rounded-full bg-current transition-transform",
              "peer-checked:scale-100 peer-checked:[--checked:1]",
              "peer-checked:bg-brand-500",
            )}
          />
        </span>
      </span>
      <span className="text-sm leading-none break-words select-none">
        {label}
      </span>
    </label>
  );
}
