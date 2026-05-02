import { cn } from "@lib/utils";
import Image from "next/image";
import { type ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Image>, "src" | "alt" | "fill"> & {
  aspectRatio: string;
  src: string;
  wrapperClassName?: string;
  alt: string;
};

export function ImageWithAspectRatio({
  aspectRatio,
  src,
  wrapperClassName,
  alt,
  className,
  ...rest
}: Props) {
  const [w, h] = aspectRatio.split("/").map(Number);
  const ratio = `${100 / (w / h)}%`;

  return (
    <div
      className={cn("relative h-0 w-full overflow-hidden", wrapperClassName)}
      style={{ paddingTop: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        quality={100}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        className={cn("z-0 object-cover object-center", className)}
        {...rest}
      />
    </div>
  );
}
