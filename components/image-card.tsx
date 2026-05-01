"use client";

import { ArtistModalContent } from "@components/artist-modal";
import { TexturedImage } from "@components/textured-image";
import { Dialog, DialogContent } from "@components/ui/dialog";
import { type IImageCard } from "@lib/models";
import { formatArtistName } from "@lib/utils/string";
import { motion } from "motion/react";
import { useState } from "react";

type Props = {
  data: IImageCard;
  playAnimation?: boolean;
  opensModal?: boolean;
};

const containerMotion = {
  initial: { scale: 1, transition: { type: "spring" as const, duration: 0.5 } },
  hover: {
    scale: 1.025,
    transition: { type: "spring" as const, duration: 0.2 },
  },
};

const pathMotion = {
  initial: {
    pathLength: 0,
    transition: { duration: 0.5, type: "spring" as const },
  },
  hover: {
    pathLength: 1,
    transition: { duration: 0.5, type: "spring" as const },
  },
};

function CardBody({
  data,
  hideOutline,
  animate,
}: {
  data: IImageCard;
  hideOutline?: boolean;
  animate?: boolean;
}) {
  const motionProps = animate
    ? { initial: "initial", whileHover: "hover", variants: containerMotion }
    : {};
  return (
    <motion.div
      className="relative isolate flex w-full items-center justify-center bg-blue-500"
      {...motionProps}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute z-[100] h-[90%] w-[90%]"
      >
        <motion.rect
          width="100%"
          height="100%"
          fill="transparent"
          strokeWidth={hideOutline ? "0" : "4"}
          stroke="#ffffff"
          variants={pathMotion}
        />
      </motion.svg>
      <div className="font-display absolute inset-x-0 z-10 flex h-full flex-col justify-center p-8 text-center font-bold">
        <span className="mt-auto pt-4 text-6xl leading-none break-words text-white uppercase xl:text-7xl">
          {formatArtistName(data.title)}
        </span>
        <span className="mt-auto pb-4 text-2xl text-white">
          {data.subtitle}
        </span>
      </div>
      <TexturedImage alt={data.title} src={data.imgSrc} />
    </motion.div>
  );
}

export function ImageCard({ data, opensModal = false, playAnimation }: Props) {
  const [open, setOpen] = useState(false);

  if (!opensModal) {
    return <CardBody data={data} animate={playAnimation} />;
  }

  return (
    <>
      <button
        type="button"
        className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
        onClick={() => {
          setOpen(true);
        }}
      >
        <CardBody data={data} hideOutline animate />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <ArtistModalContent data={data} />
        </DialogContent>
      </Dialog>
    </>
  );
}
