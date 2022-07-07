import { Layout } from '@components/common';
import cn from 'classnames';
import { NextSeo } from 'next-seo';

import styles from './styles/index.module.scss';

const Home = () => {
  return (
    <>
      <NextSeo
        title={'Home'}
        description="Zomaar Zomert is een festival in het hartje van Itterbeek, aan de Sint-Anna-kerk. Heel het laatste weekend van Juli kan u genieten van frisse drankjes, tal van optredens + randactiviteiten en een buitengewoon zomers weekend. ☀🚀"
        openGraph={{
          title: 'Home',
          description:
            'Zomaar Zomert is een festival in het hartje van Itterbeek, aan de Sint-Anna-kerk. Heel het laatste weekend van Juli kan u genieten van frisse drankjes, tal van optredens + randactiviteiten en een buitengewoon zomers weekend. ☀🚀',
        }}
      />
      <div className={cn(styles.intro, 'container')}></div>
    </>
  );
};

export default Home;

Home.Layout = Layout;
