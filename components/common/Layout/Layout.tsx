import { Footer, Navbar } from '@components/common';
import { Modal } from '@components/ui';
import { useUI } from '@lib/hooks';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

import { ArtistModalView } from '../Artist/ArtistModalView';
import styles from './Layout.module.scss';

type Props = {
  children: ReactNode;
};

const transparentRoutes = ['/'];

const Layout: FC<Props> = ({ children }: Props) => {
  const { displayModal, closeModal, modalTitle, modalView, data } = useUI();
  const router = useRouter();

  const isTransparentRoute = transparentRoutes.includes(router?.pathname);

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
          <ArtistModalView src={data?.src} title={data?.title} />
        )}
      </Modal>
    </>
  );
};

export default Layout;
