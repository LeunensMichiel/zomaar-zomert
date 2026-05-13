import { type SchemaTypeDefinition } from "sanity";

import { artist } from "./artist";
import { partner } from "./partner";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [artist, partner],
};
