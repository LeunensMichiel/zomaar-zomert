import { Layout } from '@components/common';
import { Ticket } from '@components/icons';
import { Button, ImageWithAspectRatio } from '@components/ui';
import { groupBy } from '@lib/utils/groupBy';
import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { NextSeo } from 'next-seo';
import { useMemo, useState } from 'react';

import menu from '../public/menu.json';
import styles from './styles/menu.module.scss';

const itemVariants = {
  hidden: {
    x: 10,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    x: -10,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

enum MenuType {
  DRINKS = 'Drinks',
  FOOD = 'Food',
}

const MenuPage = () => {
  const [menuType, setCurrentMenuType] = useState<MenuType>(MenuType.DRINKS);

  const filteredMenu = useMemo(
    () => menu.filter((menuItem) => menuItem.category === menuType),
    [menuType]
  );

  const menuBySubCategory = useMemo(
    () => groupBy(filteredMenu, (x) => x.subCategory),
    [filteredMenu]
  );

  return (
    <>
      <NextSeo title="Menu" noindex />
      <section className={cn(styles.root, 'container py-container--sm')}>
        <h1 className={'header'}>Menu</h1>
        <div className={styles.tabs}>
          {Object.keys(MenuType).map((type) => (
            <Button
              key={type}
              size="sm"
              variant="minimal"
              onClick={() =>
                setCurrentMenuType(MenuType[type as keyof typeof MenuType])
              }
            >
              {MenuType[type as keyof typeof MenuType]}
              {MenuType[type as keyof typeof MenuType] === menuType ? (
                <motion.div className={styles.underline} layoutId="underline" />
              ) : null}
            </Button>
          ))}
        </div>
        <div className={styles.menu}>
          <AnimatePresence mode="wait">
            {Object.keys(menuBySubCategory).map((subCategory) => (
              <motion.div
                key={subCategory}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={itemVariants}
              >
                <span className={styles.menu__category}>{subCategory}</span>
                <div className={styles.menu__items}>
                  {menuBySubCategory[subCategory].map((item) => (
                    <div key={item.name} className={styles.menu__item__outer}>
                      <div className={styles.menu__item__inner}>
                        <ImageWithAspectRatio
                          aspectRatio="1/1"
                          width={80}
                          height={80}
                          src={item.img}
                          className={styles.menu__item__image}
                          alt={item.name}
                        />
                        <div className={styles.menu__item__body}>
                          <span className={styles.menu__item__title}>
                            {item.name}
                          </span>
                          <p className={styles.menu__item__text}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className={styles.menu__item__vouchers}>
                        <Ticket />
                        <span>{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default MenuPage;

MenuPage.Layout = Layout;
