export const ZZ_DATES = ['2023-07-28', '2023-07-29', '2023-07-30'];

export type IImageCard = {
  title: string;
  subtitle: string;
  imgSrc: string;
  description?: string;
  date?: string;
};

export type languages = 'nl' | 'fr' | 'en';

type TranslationString = Record<languages, string>;

export type APIArtist = {
  id: number | string;
  name: TranslationString;
  date: string;
  hour: string;
  isFiller: boolean;
  description: TranslationString;
  imgSrc: string;
  hiddenUntil: string;
  hiddenFrom: string;
};

export type Artist = {
  id: number | string;
  name: string;
  date: string;
  hour: string;
  isFiller: boolean;
  description: string;
  imgSrc: string;
  hiddenUntil: string;
  hiddenFrom: string;
};

export enum MenuType {
  DRINKS = 'Drinks',
  FOOD = 'Food',
}

export type APIMenuItem = {
  name: TranslationString;
  description: TranslationString;
  price: number;
  img: string;
  category: MenuType;
  subCategory: TranslationString;
};

export type MenuItem = {
  name: string;
  description: string;
  price: number;
  img: string;
  category: MenuType;
  subCategory: string;
};
