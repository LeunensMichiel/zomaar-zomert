import { cn } from "@lib/utils";
import { type ComponentProps, type ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  /** Tailwind text color class controlling the burst fill. Default: text-yellow-400. */
  fill?: string;
} & ComponentProps<"div">;

/**
 * Spiked star/burst stamp. Used for "FREE!" / "NEW!" loud callouts.
 * The 16-point starburst is generated with a CSS clip-path so we don't
 * need another SVG asset.
 */
export function StarBurst({
  children,
  className,
  fill = "text-yellow-400",
  style,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "relative inline-flex aspect-square items-center justify-center",
        "drop-shadow-[4px_4px_0_var(--color-gray-900)]",
        className,
      )}
      style={style}
      {...rest}
    >
      <span
        className={cn("absolute inset-0 bg-current", fill)}
        style={{
          clipPath:
            "polygon(50% 0%, 57% 16%, 75% 8%, 73% 28%, 92% 25%, 82% 42%, 100% 50%, 82% 58%, 92% 75%, 73% 72%, 75% 92%, 57% 84%, 50% 100%, 43% 84%, 25% 92%, 27% 72%, 8% 75%, 18% 58%, 0% 50%, 18% 42%, 8% 25%, 27% 28%, 25% 8%, 43% 16%)",
        }}
      />
      <span className="relative text-center">{children}</span>
    </div>
  );
}
