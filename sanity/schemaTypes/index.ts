import { type SchemaTypeDefinition } from "sanity";

import { artist } from "./artist";
import { artistBlockContent } from "./artistBlockContent";
import { historyEntry } from "./historyEntry";
import { infoBlock } from "./infoBlock";
import { menuItem } from "./menuItem";
import { partner } from "./partner";
import { simpleBlockContent } from "./simpleBlockContent";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    artist,
    artistBlockContent,
    historyEntry,
    infoBlock,
    menuItem,
    partner,
    siteSettings,
    simpleBlockContent,
  ],
};
