import NextHead from 'next/head';
import { DefaultSeo } from 'next-seo';
import { VFC } from 'react';

const Head: VFC = () => {
  const url = process.env.SITE_URL;

  return (
    <>
      <DefaultSeo
        title="Zomaar Zomert 2022"
        titleTemplate="%s | Zomaar Zomert"
        defaultTitle="Zomaar Zomert 2022"
        description="Zomaar Zomert is a free festival in the heart of Itterbeek, at the Sint-Anna church. The whole last weekend of July you can enjoy fresh drinks, numerous performances & activities. You're sure to have an extraordinary summer weekend. ☀🚀"
        openGraph={{
          title: 'Zomaar Zomert 2022',
          description:
            "Zomaar Zomert is a free festival in the heart of Itterbeek, at the Sint-Anna church. The whole last weekend of July you can enjoy fresh drinks, numerous performances & activities. You're sure to have an extraordinary summer weekend. ☀🚀",
          type: 'website',
          url,
          locale: 'en',
          site_name: 'Zomaar Zomert',
          images: [
            {
              url: '/assets/card.jpg',
              width: 1200,
              height: 630,
              alt: 'Zomaar Zomert',
            },
          ],
        }}
      />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="manifest"
          href="/meta/site.webmanifest"
          key="site-manifest"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/meta/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/meta/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/meta/favicon-16x16.png"
        />
        <link rel="manifest" href="/meta/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/meta/safari-pinned-tab.svg"
          color="#a989f7"
        />
        <link rel="shortcut icon" href="/meta/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Next.js Template" />
        <meta name="application-name" content="Next.js Template" />
        <meta name="msapplication-TileColor" content="#603cba" />
        <meta name="msapplication-config" content="/meta/browserconfig.xml" />
        <meta name="theme-color" content="#1a1a1a" />
        {/* ENABLE THIS IF SELF-HOSTING FONTS
      <link
        rel="preload"
        href="/fonts/myFont.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      /> */}
      </NextHead>
    </>
  );
};

export default Head;
