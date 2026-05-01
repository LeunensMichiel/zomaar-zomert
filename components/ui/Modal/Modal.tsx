'use client';

import { CloseButton } from '@components/common';
import { useClickOutside } from '@lib/hooks';
import { Root as PortalRoot } from '@radix-ui/react-portal';
import cn from 'classnames';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { RemoveScroll } from 'react-remove-scroll';

import styles from './Modal.module.scss';

type ModalProps = {
  className?: string;
  open?: boolean;
  title?: string;
  container?: 'container' | 'page';
  onClose: () => void;
  children?: ReactNode;
};

const Modal: FC<ModalProps> = ({
  children,
  className,
  container = 'page',
  onClose,
  open,
  title,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const closedY = shouldReduceMotion ? 0 : 200;
  const duration = 0.3;
  useClickOutside(ref, () => onClose());

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, handleKey]);

  if (!mounted) return null;

  return (
    <PortalRoot>
      <AnimatePresence>
        {open && (
          <RemoveScroll>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration }}
              className={cn(styles.overlay)}
            >
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: closedY },
                }}
                transition={{
                  duration,
                  type: 'spring',
                }}
                aria-modal
                aria-labelledby={title}
                tabIndex={-1}
                ref={ref}
                role="dialog"
                className={cn(
                  styles.modal,
                  {
                    container: container === 'container',
                    'container-page': container === 'page',
                  },
                  className
                )}
              >
                <CloseButton
                  className={cn(styles.modalCloseButton)}
                  onClick={() => onClose()}
                  size="lg"
                />
                <FocusLock className={cn(styles.modalBody)}>
                  {children}
                </FocusLock>
              </motion.div>
            </motion.div>
          </RemoveScroll>
        )}
      </AnimatePresence>
    </PortalRoot>
  );
};

export default Modal;
