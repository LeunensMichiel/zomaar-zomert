'use client';

import { Footer, Navbar } from '@components/common';
import { Modal } from '@components/ui';
import { useUI } from '@lib/hooks';
import { usePathname } from '@lib/i18n/navigation';
import cn from 'classnames';
import { FC, ReactNode } from 'react';

import { ImageCardModalView } from '../ImageCard/ImageCardModalView';
import { LanguageSelectionModal } from '../LanguagePicker/LanguageSelectionModal';
import styles from './Layout.module.scss';

type Props = {
  children: ReactNode;
};

const transparentRoutes = ['/'];

const Layout: FC<Props> = ({ children }: Props) => {
  const { displayModal, closeModal, modalTitle, modalView, data } = useUI();

  const pathname = usePathname();

  const isTransparentRoute = transparentRoutes.includes(pathname);

  return (
    <>
      <Navbar isTransparent={isTransparentRoute} />
      <main
        className={cn(styles.mainContainer, {
          [styles['has-transparent-navbar']]: isTransparentRoute,
        })}
      >
        {children}
      </main>
      <Footer />

      <Modal open={displayModal} onClose={closeModal} title={modalTitle}>
        {modalView === 'ARTIST_VIEW' && (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <ImageCardModalView data={data?.data} />
        )}
        {modalView === 'LANGUAGE_VIEW' && <LanguageSelectionModal />}
      </Modal>
    </>
  );
};

export default Layout;
