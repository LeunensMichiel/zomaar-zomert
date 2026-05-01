"use client";

import { cn } from "@lib/utils";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { Spinner } from "./spinner";

export const buttonVariants = tv({
  base: [
    "relative inline-flex cursor-pointer items-center justify-center gap-2",
    "font-display font-bold uppercase leading-none",
    "border-2 border-transparent",
    "transition-[background,border,color] duration-200",
    "focus-visible:outline-none",
    "aria-disabled:cursor-default aria-disabled:opacity-60",
  ],
  variants: {
    variant: {
      default:
        "bg-gray-200 border-gray-200 text-gray-900 hover:bg-gray-300 hover:border-gray-300 active:bg-gray-400 active:border-gray-400",
      primary:
        "bg-gray-900 text-white border-gray-900 hover:bg-blue-500 hover:border-blue-500 hover:text-pink-200 focus:bg-blue-500 focus:border-blue-500 focus:text-pink-200 active:bg-blue-900 active:border-blue-900 active:text-pink-400",
      transparent:
        "bg-white/15 border-white/15 text-white hover:bg-white/30 hover:border-white/30 active:bg-white/70 active:border-white/70",
      minimal:
        "bg-transparent border-transparent text-gray-900 hover:text-white hover:border-black/15 focus:text-white focus:border-black/15 active:text-gray-600 active:border-black/50",
      "minimal-bright":
        "bg-transparent border-transparent text-white hover:text-gray-300 hover:border-white/15 focus:text-gray-300 focus:border-white/15 active:text-gray-100 active:border-white/50",
      "minimal-dark":
        "bg-transparent border-transparent text-gray-900 hover:text-gray-600 focus:text-gray-500 focus:border-black/15 active:text-gray-600 active:border-black/50",
    },
    outlined: {
      true: "bg-transparent",
    },
    size: {
      xs: "text-xs px-4 py-2",
      sm: "text-sm px-4 py-2",
      md: "text-base px-4 py-3 md:text-2xl lg:text-3xl xxl:text-4xl border-0",
      lg: "text-lg px-5 py-3 [&_svg]:h-6 [&_svg]:w-6",
      xl: "text-lg px-5 py-3 md:text-3xl lg:text-2xl xxl:text-4xl [&_svg]:h-6 [&_svg]:w-6",
    },
    shape: {
      default: "rounded-none text-left",
      circular: "rounded-full justify-center p-3",
      squared: "rounded-none justify-center p-3",
      rounded: "rounded-sm justify-center",
    },
    stretched: {
      true: "w-full",
    },
    loading: {
      true: "pointer-events-none select-none",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      outlined: true,
      class:
        "bg-transparent text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white",
    },
    {
      variant: "default",
      outlined: true,
      class: "bg-transparent text-gray-600 border-gray-600",
    },
    {
      variant: "transparent",
      outlined: true,
      class: "bg-transparent text-white border-white/15",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    shape: "default",
  },
});

type ButtonOwnProps = {
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  circular?: boolean;
  squared?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
} & VariantProps<typeof buttonVariants>;

export type ButtonProps<C extends ElementType = "button"> = {
  as?: C;
} & ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<C>, keyof ButtonOwnProps | "as">;

export function Button<C extends ElementType = "button">({
  as,
  variant,
  size,
  outlined,
  stretched,
  shape,
  circular,
  squared,
  loading,
  iconLeft,
  iconRight,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps<C>) {
  const Component: ElementType = as ?? "button";
  const resolvedShape =
    shape ??
    (circular && children
      ? "rounded"
      : circular
        ? "circular"
        : squared
          ? "squared"
          : "default");

  return (
    <Component
      className={cn(
        buttonVariants({
          variant,
          size,
          outlined,
          stretched,
          shape: resolvedShape,
          loading,
        }),
        className,
      )}
      aria-disabled={disabled}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...rest}
    >
      {(loading || iconLeft) && (
        <span className="inline-flex items-center justify-center">
          {loading ? <Spinner size="sm" /> : iconLeft}
        </span>
      )}
      {children}
      {iconRight && (
        <span className="inline-flex items-center justify-center">
          {iconRight}
        </span>
      )}
    </Component>
  );
}
