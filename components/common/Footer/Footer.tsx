import { Facebook, Instagram, Youtube } from '@components/icons';
import cn from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { VFC } from 'react';

import styles from './Footer.module.scss';

const variants = {
  initial: {
    scale: 1,
    transition: {
      duration: 0.3,
      type: 'spring',
    },
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.3,
      type: 'spring',
    },
  },
  hover: {
    scale: 1.1,
    color: 'var(--color-pink-2)',
    transition: {
      duration: 0.3,
      type: 'spring',
    },
  },
};

const Footer: VFC = () => {
  return (
    <>
      <div className={styles.socials}>
        <div className={styles.social__items}>
          <motion.a
            href="https://facebook.com/zomaarzomert"
            target="_blank"
            rel="noreferrer noopener"
            className={styles.social__item}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={variants}
          >
            <Facebook />
          </motion.a>
          <motion.a
            href="https://www.instagram.com/zomaarzomert/"
            target="_blank"
            rel="noreferrer noopener"
            className={styles.social__item}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={variants}
          >
            <Instagram />
          </motion.a>
          <motion.a
            href="https://www.youtube.com/watch?v=G2s9r_BohUE"
            target="_blank"
            rel="noreferrer noopener"
            className={styles.social__item}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={variants}
          >
            <Youtube />
          </motion.a>
        </div>
        <img
          src="/assets/tear-2.svg"
          alt="paper tear"
          className={cn(styles.tear, styles['tear--2'])}
        />
        <img
          src="/assets/tear-3.svg"
          alt="paper tear"
          className={cn(styles.tear, styles['tear--3'])}
        />
      </div>
      <footer className={cn(styles.footer, 'py-container--sm')}>
        <div className={cn(styles.footer__nav, 'container')}>
          <div className={styles.footer__block}>
            <span className={styles.footer__block__title}>Line-Up</span>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: '2022-07-29',
                },
              }}
              passHref
            >
              <a className={styles.footer__block__link}>Friday</a>
            </Link>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: '2022-07-30',
                },
              }}
              passHref
            >
              <a className={styles.footer__block__link}>Saturday</a>
            </Link>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: '2022-07-31',
                },
              }}
              passHref
            >
              <a className={styles.footer__block__link}>Sunday</a>
            </Link>
          </div>
          <div className={styles.footer__block}>
            <span className={styles.footer__block__title}>
              Want to know more?
            </span>
            <Link href="/history" passHref>
              <a className={styles.footer__block__link}>History</a>
            </Link>
            {/* <Link href="/partners" passHref>
              <a className={styles.footer__block__link}>Our partners</a>
            </Link> */}
            <Link href="/menu" passHref>
              <a className={styles.footer__block__link}>Menu</a>
            </Link>
            <Link href="/terms-and-conditions" passHref>
              <a className={styles.footer__block__link}>Terms and conditions</a>
            </Link>
          </div>
          <div className={styles.footer__block}>
            <span className={styles.footer__block__title}>Contact</span>
            <Link href="/info" passHref>
              <a className={styles.footer__block__link}>
                Sign up for activities
              </a>
            </Link>
            <Link href="/contact" passHref>
              <a className={styles.footer__block__link}>Contact us</a>
            </Link>
          </div>
        </div>
        <div className={cn(styles.partners, 'container')}>
          <img src="/assets/sponsors/pepsi-max-white.svg" alt="pepsi-max" />
          <img
            src="/assets/sponsors/nationale-loterij-white.svg"
            alt="nationale-loterij"
          />
          <img src="/assets/sponsors/crokaert-white.svg" alt="crokaert" />
          <img src="/assets/sponsors/megavolt-white.svg" alt="megavolt" />
          <img src="/assets/sponsors/eagleair-white.svg" alt="eagle eair" />
          <img src="/assets/sponsors/callebaut-white.svg" alt="callebaut" />
          <img src="/assets/sponsors/belfius-white.svg" alt="belfius" />
          <img src="/assets/sponsors/bamboe-white.svg" alt="bamboe-frit" />
          <img
            className={styles.scale_down}
            src="/assets/sponsors/dilbeek-white.svg"
            alt="dilbeek"
          />
          <img src="/assets/sponsors/edr-white.svg" alt="edr" />
          <img
            className={styles.scale_up}
            src="/assets/sponsors/moens-white.svg"
            alt="moens"
          />
          <img
            src="/assets/sponsors/timmermans-text-white.svg"
            alt="timmermans"
          />
          <img src="/assets/sponsors/elpers-white.svg" alt="elpers" />
          <img src="/assets/sponsors/wynant-white.svg" alt="wynant" />
          <img src="/assets/sponsors/lammens-white.svg" alt="lammens" />
          <img
            src="/assets/sponsors/itterplastiek-white.svg"
            alt="itterplastiek"
          />
          <img src="/assets/sponsors/cameleon-white.svg" alt="cameleon" />
          <img src="/assets/sponsors/optiek-trap-white.svg" alt="optiek-trap" />
          <img
            src="/assets/sponsors/explosion-white.svg"
            alt="discobar explosion"
          />
          <img src="/assets/sponsors/spanuit-white.svg" alt="spanuit" />
          <img src="/assets/sponsors/erkermann-white.svg" alt="ekkermann" />
          <img src="/assets/sponsors/thesora-white.svg" alt="thesora" />
          <img src="/assets/sponsors/limbourg-white.svg" alt="limbourg" />
          <img
            className={styles.scale_down}
            src="/assets/sponsors/carrosserie-jans-white.svg"
            alt="carrosserie-jans"
          />
          <img
            src="/assets/sponsors/vlaams-brabant-white.svg"
            alt="vlaams-brabant"
          />
        </div>
        <div className={cn('container')}>
          <span className={cn(styles.copy)}>
            ©{new Date().getFullYear()} Zomaar Zomert - Design by Floris -
            Development by Michiel Leunens
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
