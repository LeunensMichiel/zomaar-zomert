import { cn } from "@lib/utils";
import { type ComponentProps } from "react";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "font-display mb-2 block text-sm font-bold tracking-wide text-gray-900 uppercase transition-colors md:text-base",
        className,
      )}
      {...props}
    />
  );
}
