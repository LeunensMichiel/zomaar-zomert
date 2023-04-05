import '@styles/global/style.scss';

import { Head } from '@components/common';
import { ManagedUIProvider } from '@lib/context/ui';
import { usePersistLocaleCookie } from '@lib/hooks/usePersistLocale';
import { AppProps } from 'next/app';
import { ReactNode, useEffect } from 'react';

import { useSmoothHashScroll } from '../lib/hooks';

type NoopProps = {
  children: ReactNode;
};
const Noop = ({ children }: NoopProps) => <>{children}</>;

function App({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Layout = (Component as any).Layout || Noop;

  //https://github.com/vercel/next.js/issues/5136
  useSmoothHashScroll();

  // Persist user-defined language
  usePersistLocaleCookie();

  // Chrome-transition-bug
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <>
      <Head />
      <ManagedUIProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ManagedUIProvider>
    </>
  );
}

export default App;
