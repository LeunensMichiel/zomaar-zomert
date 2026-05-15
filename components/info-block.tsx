import { Sticker } from "@components/sticker";
import { Map } from "@components/ui/map";
import { cn } from "@lib/utils";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";

import type {
  InfoBlock as InfoBlockData,
  InfoBlockPalette,
  InfoBlockWidth,
} from "@/sanity/lib/queries";

const PALETTE_BG: Record<InfoBlockPalette, string> = {
  "royal-yellow": "bg-yellow-400",
  "blue-cola": "bg-blue-500",
  "summer-red": "bg-brand-500",
  bubblegum: "bg-pink-300",
  milkshake: "bg-pink-50",
};

const PALETTE_TEXT: Record<InfoBlockPalette, string> = {
  "royal-yellow": "text-gray-900",
  "blue-cola": "text-white",
  "summer-red": "text-white",
  bubblegum: "text-gray-900",
  milkshake: "text-gray-900",
};

const PALETTE_STRONG: Record<InfoBlockPalette, string> = {
  "royal-yellow": "text-gray-900",
  "blue-cola": "text-yellow-300",
  "summer-red": "text-yellow-300",
  bubblegum: "text-gray-900",
  milkshake: "text-brand-500",
};

const WIDTH_SPAN: Record<InfoBlockWidth, string> = {
  narrow: "lg:col-span-4",
  wide: "lg:col-span-8",
  full: "md:col-span-2 lg:col-span-12",
};

const STICKER_PALETTE: Record<InfoBlockPalette, "brand" | "ink"> = {
  "royal-yellow": "ink",
  "blue-cola": "brand",
  "summer-red": "ink",
  bubblegum: "ink",
  milkshake: "brand",
};

function tiltFor(layout: InfoBlockData["layout"], index: number): number {
  switch (layout) {
    case "map":
      return 0;
    case "poster":
    case "polaroid":
      return index % 2 === 0 ? -2 : 2;
    case "body":
    default:
      return index % 2 === 0 ? -1 : 1;
  }
}

function ptComponents(strongClass: string): PortableTextComponents {
  return {
    marks: {
      strong: ({ children }) => (
        <strong className={cn("font-bold", strongClass)}>{children}</strong>
      ),
      em: ({ children }) => <em>{children}</em>,
      link: ({ value, children }) => (
        <a
          href={(value as { href?: string } | undefined)?.href}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-2 underline-offset-2 hover:decoration-4"
        >
          {children}
        </a>
      ),
    },
  };
}

export function InfoBlock({
  block,
  index,
}: {
  block: InfoBlockData;
  index: number;
}) {
  const tilt = tiltFor(block.layout, index);
  const widthClass = WIDTH_SPAN[block.width];
  const strongAccent = PALETTE_STRONG[block.palette];
  const tiltStyle = tilt ? { transform: `rotate(${String(tilt)}deg)` } : {};

  if (block.layout === "map") {
    return (
      <div className={cn("relative", widthClass)}>
        <div className="shadow-sticker-lg h-72 overflow-hidden border-2 border-gray-900 md:h-80 lg:h-full lg:min-h-96">
          <Map height="100%" />
        </div>
        {block.title && (
          <div className="absolute -top-4 -right-4 z-10">
            <Sticker
              color={STICKER_PALETTE[block.palette]}
              size="md"
              rotate={-6}
            >
              {block.title}
            </Sticker>
          </div>
        )}
      </div>
    );
  }

  if (block.layout === "polaroid") {
    return (
      <div className={cn("relative", widthClass)}>
        <span
          aria-hidden="true"
          className="tape-strip absolute -top-3 left-10 z-30 h-5 w-24 -rotate-12 md:left-14"
        />
        <article
          className={cn(
            "shadow-sticker-lg relative border-2 border-gray-900 bg-white p-3 pb-10 md:p-4 md:pb-14",
          )}
          style={tiltStyle}
        >
          <div className="relative h-64 overflow-hidden border-2 border-gray-900 md:h-72 lg:h-80">
            {block.photoUrl && (
              <Image
                src={block.photoUrl}
                alt={block.photoAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                className="object-cover object-center"
              />
            )}
            <div
              aria-hidden="true"
              className="halftone pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply"
            />
          </div>
          {block.photoCaption && (
            <p className="font-display mt-4 text-center text-base font-bold tracking-wide text-gray-900 uppercase md:mt-6 md:text-lg">
              {block.photoCaption}
            </p>
          )}
        </article>
      </div>
    );
  }

  if (block.layout === "poster") {
    return (
      <article
        className={cn(
          "shadow-sticker-lg relative flex flex-col justify-center border-2 border-gray-900 p-6 md:p-8",
          PALETTE_BG[block.palette],
          PALETTE_TEXT[block.palette],
          widthClass,
        )}
        style={tiltStyle}
      >
        {block.title && (
          <span className="font-display text-xs font-bold tracking-[0.2em] uppercase opacity-80 md:text-sm">
            {block.title}
          </span>
        )}
        {block.display && (
          <span className="font-display mt-2 text-6xl leading-[0.85] font-bold uppercase md:text-7xl xl:text-8xl">
            {block.display}
          </span>
        )}
        {block.content.length > 0 && (
          <div className="mt-3 text-sm leading-relaxed md:text-base">
            <PortableText
              value={block.content}
              components={ptComponents(strongAccent)}
            />
          </div>
        )}
      </article>
    );
  }

  // layout: body
  return (
    <article
      className={cn(
        "shadow-sticker-lg relative border-2 border-gray-900 p-6 md:p-8",
        PALETTE_BG[block.palette],
        PALETTE_TEXT[block.palette],
        widthClass,
      )}
      style={tiltStyle}
    >
      {block.title && (
        <h3
          className={cn(
            "font-display text-2xl leading-[0.95] font-bold uppercase md:text-3xl",
            PALETTE_TEXT[block.palette],
          )}
        >
          {block.title}
        </h3>
      )}
      {block.content.length > 0 && (
        <div className="mt-4 text-base leading-relaxed md:text-lg">
          <PortableText
            value={block.content}
            components={ptComponents(strongAccent)}
          />
        </div>
      )}
    </article>
  );
}
