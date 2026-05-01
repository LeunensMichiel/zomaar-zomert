'use client';

import { Ticket } from '@components/icons';
import { Button, ImageWithAspectRatio } from '@components/ui';
import { MenuItem, MenuType } from '@lib/models';
import { groupBy } from '@lib/utils/groupBy';
import cn from 'classnames';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import styles from './MenuClient.module.scss';

const itemVariants = {
  hidden: {
    x: 10,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  exit: {
    x: -10,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2 },
  },
};

type Props = { menu: MenuItem[] };

const MenuClient = ({ menu }: Props) => {
  const t = useTranslations('menu');
  const [menuType, setCurrentMenuType] = useState<MenuType>(MenuType.DRINKS);

  const filteredMenu = useMemo(
    () => menu.filter((menuItem) => menuItem.category === menuType),
    [menu, menuType]
  );

  const menuBySubCategory = useMemo(
    () => groupBy(filteredMenu, (x) => x.subCategory),
    [filteredMenu]
  );

  return (
    <section className={cn(styles.root, 'container py-container--sm')}>
      <h1 className="header">{t('title')}</h1>
      <div className={styles.tabs}>
        {Object.keys(MenuType).map((type) => (
          <Button
            key={type}
            size="md"
            variant="minimal"
            onClick={() =>
              setCurrentMenuType(MenuType[type as keyof typeof MenuType])
            }
          >
            {t(MenuType[type as keyof typeof MenuType])}
            {MenuType[type as keyof typeof MenuType] === menuType && (
              <motion.div className={styles.underline} layoutId="underline" />
            )}
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
                  <div key={item.name} className={styles.menu__item}>
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
  );
};

export default MenuClient;
