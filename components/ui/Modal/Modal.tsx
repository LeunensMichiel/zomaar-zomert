import { CloseButton } from '@components/common';
import { useClickOutside } from '@lib/hooks';
import cn from 'classnames';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  FC,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import FocusLock from 'react-focus-lock';
import { clearBodyLocks, lock, unlock } from 'tua-body-scroll-lock';

import styles from './Modal.module.scss';

const PortalRoot = dynamic(
  () => import('@radix-ui/react-portal').then((mod) => mod.Root),
  {
    ssr: false,
  }
);

type ModalProps = {
  className?: string;
  open?: boolean;
  title?: string;
  container?: 'container' | 'page';
  onClose(): void;
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
  const ref = useRef() as MutableRefObject<HTMLDivElement>;
  const shouldReduceMotion = useReducedMotion();
  const closedY = shouldReduceMotion ? 0 : 200;
  const duration = 0.3;
  useClickOutside(ref, () => onClose());

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const clearBodyScroll = useCallback(() => {
    lock(ref.current);
    clearBodyLocks();
  }, []);

  useEffect(() => {
    if (ref.current) {
      if (open) {
        unlock(ref.current);
        window.addEventListener('keydown', handleKey);
      }
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, handleKey]);

  return (
    <PortalRoot>
      <AnimatePresence onExitComplete={clearBodyScroll}>
        {open && (
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
              <FocusLock className={cn(styles.modalBody)}>{children}</FocusLock>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PortalRoot>
  );
};

export default Modal;
