import React, { PropsWithChildren, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import styles from './Toast.module.scss';

type ToastProps = { isShown: boolean; duration: number } & PropsWithChildren;

export function Toast({ children, duration, isShown }: ToastProps) {
  // First, set the internal `visible` state to negate
  // the provided `show` prop
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isShown) {
      timer = setTimeout(() => {
        setVisible((x) => !x);
      }, duration);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isShown]);

  return (
    <AnimatePresence>
      {isShown && visible && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className={styles.root}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
