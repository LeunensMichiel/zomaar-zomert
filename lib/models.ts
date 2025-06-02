export const ZZ_DATES = ['2025-07-25', '2025-07-26', '2025-07-27'];
export const ZZ_DATE_FRIDAY = ZZ_DATES[0];
export const ZZ_DATE_SATURDAY = ZZ_DATES[1];
export const ZZ_DATE_SUNDAY = ZZ_DATES[2];
export const ZZ_YEAR = 2025;
export const PAELLA_LINK = 'https://forms.gle/o4N4bSanA4Z1kGR26';
export const PETANQUE_LINK = 'https://forms.gle/zPFPHgePwNoSbNRQA';
export const ENABLE_LINKS_DATE = '2025-06-23';
export const ZZ_DATE_MONDAY = '2025-07-28';
export const ZZ_DATE_FRIDAY_NEXT_YEAR = '2026-07-24';

export type IImageCard = {
  title: string;
  subtitle: string;
  imgSrc: string;
  description?: string;
  date?: string;
  link?: string;
};

export type languages = 'nl' | 'fr' | 'en';

export const getDateByDayString = (day: 'friday' | 'saturday' | 'sunday') => {
  return day === 'friday'
    ? ZZ_DATE_FRIDAY
    : day === 'saturday'
      ? ZZ_DATE_SATURDAY
      : ZZ_DATE_SUNDAY;
};

type TranslationString = Record<languages, string>;

export type APIArtist = {
  name: string;
  description: TranslationString;
  day: 'friday' | 'saturday' | 'sunday';
  hour: string;
  imgSrc: string;
  showFrom: string;
  link?: string;
};

export type Artist = {
  name: string;
  description: string;
  day: 'friday' | 'saturday' | 'sunday';
  hour: string;
  imgSrc: string;
  showFrom: string;
  link?: string;
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
