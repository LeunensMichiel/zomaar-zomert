"use client";

import partners from "@public/partners.json";
import { motion, type Variants } from "motion/react";

const cardVariants: Variants = {
  offscreen: { y: 30 },
  onscreen: {
    y: 0,
    transition: { type: "spring", bounce: 0.4, duration: 0.8 },
  },
};

export default function PartnersGrid() {
  return (
    <motion.div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {partners
        .sort((a, b) => a.formula - b.formula || a.name.localeCompare(b.name))
        .filter((p) => !p.disabled)
        .map((p) => (
          <motion.a
            key={p.name}
            className="bg-brand-500 flex aspect-square items-center justify-center overflow-hidden p-16 text-center break-words text-white"
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
              <img
                src={p.logoWhite}
                alt={p.name}
                className="h-full w-full opacity-90"
              />
            ) : (
              <span className="font-display inline-block w-full text-5xl leading-none text-white opacity-75">
                {p.name}
              </span>
            )}
          </motion.a>
        ))}
    </motion.div>
  );
}
