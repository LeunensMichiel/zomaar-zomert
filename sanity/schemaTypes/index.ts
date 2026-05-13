import { type SchemaTypeDefinition } from "sanity";

import { artist } from "./artist";
import { menuItem } from "./menuItem";
import { partner } from "./partner";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artist, menuItem, partner],
};
