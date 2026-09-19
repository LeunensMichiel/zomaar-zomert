"use client";

import { Button } from "@components/ui/button";
import { cn, hotspotPosition } from "@lib/utils";
import { ExternalLink } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import { type RefObject, useEffect, useRef } from "react";

import { type RecapPhoto } from "@/sanity/lib/queries";

type Props = {
  photos: RecapPhoto[];
  albumUrl: string;
  heading: string;
  edition: string;
  cta: string;
};

const EASE = [0.22, 0.61, 0.36, 1] as const;

// Deterministic per-tile jitter so SSR and client agree on tilt + timing.
const seed = (index: number, salt: number) => {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type TileProps = {
  photo: RecapPhoto;
  index: number;
  albumUrl: string;
  gridRef: RefObject<HTMLDivElement | null>;
  revealed: boolean;
  reducedMotion: boolean | null;
};

function Tile({
  photo,
  index,
  albumUrl,
  gridRef,
  revealed,
  reducedMotion,
}: TileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tilt = (seed(index, 1) - 0.5) * 5;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(tilt);
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (reducedMotion) {
      opacity.set(1);
      return;
    }
    if (!revealed) return;
    const el = ref.current;
    const grid = gridRef.current;
    if (!el || !grid) return;

    // Gather every tile on the point of the grid that's currently in view,
    // then fan them out to their slots.
    const a = el.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    const originX = g.left + g.width / 2;
    const originY = Math.min(Math.max(window.innerHeight / 2, g.top), g.bottom);
    x.set(originX - (a.left + a.width / 2));
    y.set(originY - (a.top + a.height / 2));
    scale.set(0.55 + seed(index, 2) * 0.3);
    rotate.set((seed(index, 3) - 0.5) * 30);
    opacity.set(1);

    const transition = {
      duration: 0.8 + seed(index, 4) * 0.5,
      delay: 0.15 + seed(index, 5) * 0.35,
      ease: EASE,
    };
    const controls = [
      animate(x, 0, transition),
      animate(y, 0, transition),
      animate(scale, 1, transition),
      animate(rotate, tilt, transition),
    ];
    return () => {
      controls.forEach((c) => {
        c.stop();
      });
    };
  }, [
    revealed,
    reducedMotion,
    gridRef,
    index,
    tilt,
    x,
    y,
    scale,
    rotate,
    opacity,
  ]);

  return (
    <motion.div
      ref={ref}
      style={{
        x,
        y,
        scale,
        rotate,
        opacity,
        zIndex: Math.floor(seed(index, 6) * 12) + 1,
      }}
      className={cn("relative", index % 2 === 1 && "md:mt-12")}
    >
      <a
        href={albumUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="group shadow-sticker-sm md:shadow-sticker block border-2 border-gray-900 bg-pink-50 p-2 pb-6 transition-transform hover:-translate-y-1 md:p-3 md:pb-8"
      >
        <div className="relative aspect-4/5 overflow-hidden bg-gray-900">
          <Image
            src={photo.url}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            placeholder={photo.lqip ? "blur" : "empty"}
            blurDataURL={photo.lqip ?? undefined}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: hotspotPosition(photo.hotspot) }}
          />
        </div>
      </a>
    </motion.div>
  );
}

export function RecapGallery({
  photos,
  albumUrl,
  heading,
  edition,
  cta,
}: Props) {
  const reducedMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const revealed = useInView(gridRef, { once: true, amount: 0.2 });

  return (
    <div>
      <motion.div
        initial={reducedMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
        className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between md:gap-10"
      >
        <h2 className="flex flex-col items-start gap-3 md:gap-4">
          <motion.span
            variants={{
              hidden: { y: 24, opacity: 0 },
              show: { y: 0, opacity: 1, transition: { ease: EASE } },
            }}
            className="block text-6xl leading-[0.85] text-gray-900 md:text-8xl xl:text-9xl"
          >
            {heading}
          </motion.span>
          <motion.span
            variants={{
              hidden: { scale: 0.7, rotate: -8, opacity: 0 },
              show: {
                scale: 1,
                rotate: -2,
                opacity: 1,
                transition: { type: "spring", damping: 12, stiffness: 150 },
              },
            }}
            className="font-display shadow-sticker-lg inline-block origin-left bg-gray-900 px-4 py-2 text-3xl leading-[0.9] font-bold text-yellow-400 uppercase md:px-6 md:py-3 md:text-5xl xl:text-6xl"
          >
            {edition}
          </motion.span>
        </h2>
        <motion.div
          variants={{
            hidden: { y: 16, opacity: 0 },
            show: { y: 0, opacity: 1 },
          }}
        >
          <Button
            as="a"
            href={albumUrl}
            target="_blank"
            rel="noreferrer noopener"
            variant="accent"
            size="xl"
            sticker
            iconRight={<ExternalLink />}
          >
            {cta}
          </Button>
        </motion.div>
      </motion.div>

      <div
        ref={gridRef}
        className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
      >
        {photos.map((photo, i) => (
          <Tile
            key={photo.key}
            photo={photo}
            index={i}
            albumUrl={albumUrl}
            gridRef={gridRef}
            revealed={revealed}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
}
