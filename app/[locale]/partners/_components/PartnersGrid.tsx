'use client';

import partners from '@public/partners.json';
import { motion, Variants } from 'motion/react';

import styles from './PartnersGrid.module.scss';

const cardVariants: Variants = {
  offscreen: { y: 30 },
  onscreen: {
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const PartnersGrid = () => {
  return (
    <motion.div className={styles.partners__grid}>
      {partners
        .sort((a, b) => a.formula - b.formula || a.name.localeCompare(b.name))
        .filter((p) => !p.disabled)
        .map((p) => (
          <motion.a
            className={styles['partners__grid-item']}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0 }}
            variants={cardVariants}
            key={p.name}
            {...(p.site && {
              href: p.site,
              target: '_blank',
              rel: 'noreferrer noopener',
            })}
          >
            {p.logoWhite ? (
              <img src={p.logoWhite} alt={p.name} />
            ) : (
              <span>{p.name}</span>
            )}
          </motion.a>
        ))}
    </motion.div>
  );
};

export default PartnersGrid;
