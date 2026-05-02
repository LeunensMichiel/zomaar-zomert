"use client";

import { FitText } from "@components/fit-text";
import partners from "@lib/data/partners.json";
import { motion, type Variants } from "motion/react";
import Image from "next/image";

const cardVariants: Variants = {
  offscreen: { y: 30 },
  onscreen: {
    y: 0,
    transition: { type: "spring", bounce: 0.4, duration: 0.8 },
  },
};

export function PartnersGrid() {
  return (
    <motion.div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {partners
        .sort((a, b) => a.formula - b.formula || a.name.localeCompare(b.name))
        .filter((p) => !p.disabled)
        .map((p) => (
          <motion.a
            key={p.name}
            className="bg-brand-500 flex aspect-square items-center justify-center overflow-hidden p-16 text-center text-white"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0 }}
            variants={cardVariants}
            {...(p.site && {
              href: p.site,
              target: "_blank",
              rel: "noreferrer noopener",
            })}
          >
            {p.logoWhite ? (
              <Image
                src={p.logoWhite}
                alt={p.name}
                width={400}
                height={400}
                quality={100}
                className="h-full w-full object-contain opacity-90"
              />
            ) : (
              <FitText
                text={p.name}
                className="font-display text-5xl leading-none text-white opacity-75"
              />
            )}
          </motion.a>
        ))}
    </motion.div>
  );
}
