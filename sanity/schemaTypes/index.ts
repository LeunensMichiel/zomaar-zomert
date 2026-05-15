import { type SchemaTypeDefinition } from "sanity";

import { artist } from "./artist";
import { historyEntry } from "./historyEntry";
import { menuItem } from "./menuItem";
import { partner } from "./partner";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artist, historyEntry, menuItem, partner, siteSettings],
};
