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
  id: number;
  name: TranslationString;
  date: string;
  hour: string;
  isFiller: boolean;
  description: TranslationString;
  imgSrc: string;
};

export type Artist = {
  id: number;
  name: string;
  date: string;
  hour: string;
  isFiller: boolean;
  description: string;
  imgSrc: string;
};
