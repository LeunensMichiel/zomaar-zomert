import { Layout, TexturedImage } from '@components/common';
import ChevronRight from '@components/icons/Chevron';
import { Button, Card } from '@components/ui';
import Map from '@components/ui/Map';
import { NextSeo } from 'next-seo';
import React from 'react';
import Masonry from 'react-masonry-css';

import styles from './styles/info.module.scss';

const breakpointColumns = {
  default: 3,
  '1023': 2,
  '639': 1,
};

const InfoPage = () => {
  return (
    <>
      <NextSeo
        title="Info"
        description="Practical info like FAQ, accessability, parking, parners, and routing. If you have a question, chances are you'll find your answer here."
        openGraph={{
          title: 'Info',
          description:
            "Practical info like FAQ, accessability, parking, parners, and routing. If you have a question, chances are you'll find your answer here.",
        }}
      />
      <section className="container py-container--sm">
        <h1 className={'header'}>Festival Info</h1>
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          <Card title="How, when & where">
            <p>
              Zomaar zomert is located in the heart of Sint-Anna-Pede in
              Itterbeek.
              <br />
              <br />
              Our tent is located east of the well-known Sint-Anna church which
              can be found in Pieter Bruegel&apos;s paintings and opposite of
              the restaurant De Noa.
            </p>
          </Card>
          <div className={styles.map__container}>
            <div className={styles.map__container__inner}>
              <Map height="100%" />
            </div>
          </div>
          <Card title="Where to park">
            <p>
              The entire centre of Sint-Anna-Pede will be closed off. The
              easiest way to park is at either end of the Rollestraat or
              Herdebeekstraat and walk around 5 to 10 minutes to the festival.
              Other valid options are the Lossebaan, Plankenstraat and the Oude
              Geraardsbergsebaan.
              <br />
              <br />
              There&apos;s no paid parking so you&apos;ll have to park in the
              street.
            </p>
          </Card>
          <Card title="Public transportation">
            <p>
              The easiest way to get to the festival is by bus{' '}
              <strong>118</strong>. It&apos;s a small walking distance to the
              Rollestraat from there.
              <br />
              <br />
              Other options are bus <strong>141/142</strong> if you come from
              the south (Vlezenbeek, Herdebeekstraat), and{' '}
              <strong>117/810/127/128</strong> if you come from the north
              (Ninoofsesteenweg).
              <br />
              <br />
              If you come by train, the easiest way to get here is by taking bus
              117 or 810, but 127/128 are valid options as well.
              <br />
              <br />
              <strong>Watch out, there are no night busses.</strong>
            </p>
          </Card>
          <Card title="Ecology">
            <p>
              Like every festival, we try to improve our carbon footprint every
              year for a greener planet.
              <br />
              <br />
              Drinks are only served in reusable cups or corresponding beer
              glasses. We also try to minimize our water usage and want to
              encourage everyone to come by bike, public transport, on foot or
              by carpooling. At the end of the festival, all waste is recycled
              and the meadow is cleaned accordingly so no plastic is left
              behind.
            </p>
          </Card>
          <TexturedImage src="/assets/slides/slide-2.jpg" alt="Beer in hand" />
          <Card title="Tickets">
            <p>
              The festival is free! The only thing we ask in return is for you
              to have a good time 🚀
            </p>
          </Card>
          <Card title="Fair">
            <p>
              The festival takes place together with the anual fair. Two birds
              with one stone!
            </p>
          </Card>
          <Card title="Food & drink vouchers">
            <p>
              You can buy vouchers on-site at our voucher stand. We accept all
              kinds of payment; <strong>Payconic</strong>,{' '}
              <strong>Bancontact</strong> and cash.
              <br />
              <br />
              For security reasons, we strongly recommend to only use Payconic
              or Bancontact and leave your cash at home. If you have to, the
              nearest ATM is in Itterbeek centre.
            </p>
          </Card>
          <TexturedImage src="/assets/slides/slide-1.jpg" alt="" />
          <Card title="Activities">
            <p>
              Each year, we organize tons of activities, like ZomaarBike,
              ZomaarRun, kids animation, a quiz and petanque game. On Sunday you
              will also find a paella stand.
              <br />
              <br />
              All of our activities are free except for the paella, ZomaarBike
              (€4/€6) and ZomaarRun (€4).
              <br />
              <br />
              <strong>Registration</strong> for the petanque game or the paella
              stand is <strong>required.</strong> You can sign up here:
              <br />
              <div className={styles.buttons}>
                <Button
                  as="a"
                  href="https://forms.gle/pPBDp316unZQNzHv6"
                  target="_blank"
                  size="xs"
                  rel="noreferrer noopener"
                  variant="primary"
                  outlined
                  iconRight={<ChevronRight />}
                >
                  Sign up — Petanque
                </Button>
                <Button
                  as="a"
                  href="https://forms.gle/gsZmucuve7tHacQd8"
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="primary"
                  outlined
                  size="xs"
                  iconRight={<ChevronRight />}
                >
                  Sign up — Paella
                </Button>
              </div>
            </p>
          </Card>
          <TexturedImage src="/assets/slides/slide-10.jpg" alt="A sausage" />
        </Masonry>
      </section>
    </>
  );
};

export default InfoPage;

InfoPage.Layout = Layout;
