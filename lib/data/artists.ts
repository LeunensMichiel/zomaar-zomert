import artistsData from "@lib/data/artists.json";
import { type Locale } from "@lib/i18n/routing";
import { type APIArtist, type Artist, isArtistVisible } from "@lib/models";

export const loadArtists = (locale: Locale): Artist[] =>
  (artistsData as APIArtist[]).map(({ description, ...artist }) => ({
    ...artist,
    description: description[locale],
  }));

export const loadVisibleArtists = (
  locale: Locale,
  now: number = Date.now(),
): Artist[] => loadArtists(locale).filter((a) => isArtistVisible(a, now));
