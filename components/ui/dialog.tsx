"use client";

import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { cn } from "@lib/utils";
import { X } from "lucide-react";
import { type ComponentProps, type ReactNode } from "react";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogPortal = BaseDialog.Portal;

export function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Backdrop>) {
  return (
    <BaseDialog.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-[var(--color-overlay)]",
        "transition-opacity duration-300 ease-out",
        "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

type DialogContentProps = ComponentProps<typeof BaseDialog.Popup> & {
  hideClose?: boolean;
  closeClassName?: string;
};

export function DialogContent({
  className,
  children,
  hideClose,
  closeClassName,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <DialogOverlay />
      <BaseDialog.Popup
        className={cn(
          "fixed inset-x-4 inset-y-12 z-50 mx-auto flex max-w-[1140px] flex-col overflow-y-auto bg-pink-50 shadow-xl outline-none",
          "transition duration-300 ease-out",
          "data-[starting-style]:translate-y-12 data-[starting-style]:opacity-0",
          "data-[ending-style]:translate-y-12 data-[ending-style]:opacity-0",
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose && (
          <BaseDialog.Close
            aria-label="Close"
            className={cn(
              "hover:text-brand-500 absolute top-2 right-2 z-10 inline-flex h-12 w-12 cursor-pointer items-center justify-center text-gray-900 transition-colors",
              closeClassName,
            )}
          >
            <X className="h-7 w-7" />
          </BaseDialog.Close>
        )}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      className={cn("font-display text-2xl uppercase", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  );
}

export function DialogClose({
  className,
  ...props
}: ComponentProps<typeof BaseDialog.Close>) {
  return <BaseDialog.Close className={className} {...props} />;
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return <div className={cn("flex flex-col gap-1", className)}>{children}</div>;
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}
