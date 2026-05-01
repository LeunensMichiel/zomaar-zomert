import fsPromises from 'node:fs/promises';
import path from 'node:path';

import { type Locale } from '@lib/i18n/routing';
import { type APIMenuItem, type MenuItem } from '@lib/models';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import MenuClient from './_components/menu-client';

type Props = { params: Promise<{ locale: Locale }> };

export const metadata: Metadata = {
  title: 'Menu',
  robots: { index: false, follow: false },
};

const loadMenu = async (locale: Locale): Promise<MenuItem[]> => {
  const filePath = path.join(process.cwd(), 'public/menu.json');
  const jsonData = await fsPromises.readFile(filePath, 'utf-8');
  const apiMenu = JSON.parse(jsonData) as APIMenuItem[];
  return apiMenu.map(({ name, description, subCategory, ...menuitem }) => ({
    ...menuitem,
    name: name[locale],
    description: description[locale],
    subCategory: subCategory[locale],
  }));
};

export default async function MenuPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const menu = await loadMenu(locale);
  return <MenuClient menu={menu} />;
}
