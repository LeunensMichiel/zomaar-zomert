import { cn } from "@lib/utils";
import { type ComponentProps, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const stickerVariants = tv({
  base: [
    "font-display inline-flex items-center justify-center",
    "border-2 border-gray-900 leading-none font-bold uppercase",
    "shadow-sticker-sm md:shadow-sticker",
  ],
  variants: {
    color: {
      yellow: "bg-yellow-400 text-gray-900",
      brand: "bg-brand-500 text-white",
      blue: "bg-blue-500 text-white",
      pink: "bg-pink-300 text-gray-900",
      ink: "bg-gray-900 text-yellow-300",
      paper: "bg-pink-50 text-gray-900",
    },
    size: {
      xs: "px-2 py-1 text-xs md:text-sm",
      sm: "px-3 py-1.5 text-sm md:text-base",
      md: "px-4 py-2 text-base md:text-lg",
      lg: "px-5 py-2.5 text-lg md:text-2xl",
      xl: "px-6 py-3 text-2xl md:text-4xl",
    },
    shape: {
      rect: "rounded-none",
      pill: "rounded-full",
      tag: "rounded-none [clip-path:polygon(8px_0%,100%_0%,100%_100%,8px_100%,0%_50%)] pl-6",
    },
  },
  defaultVariants: {
    color: "yellow",
    size: "md",
    shape: "rect",
  },
});

type StickerProps = {
  children: ReactNode;
  rotate?: number;
  className?: string;
} & VariantProps<typeof stickerVariants> &
  Omit<ComponentProps<"span">, "color">;

export function Sticker({
  children,
  color,
  size,
  shape,
  rotate = 0,
  className,
  style,
  ...rest
}: StickerProps) {
  return (
    <span
      className={cn(stickerVariants({ color, size, shape }), className)}
      style={{
        ...style,
        transform: `rotate(${String(rotate)}deg)`,
        transformOrigin: "center",
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
