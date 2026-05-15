import {
  ClockIcon,
  CogIcon,
  IceCreamIcon,
  InfoOutlineIcon,
  LemonIcon,
} from "@sanity/icons";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteSettings"];
// Document types that are surfaced via custom list items above and should
// not appear again in the generic auto-generated list.
const HIDDEN_FROM_DEFAULT_LIST = [
  ...SINGLETONS,
  "menuItem",
  "historyEntry",
  "infoBlock",
];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
      S.divider(),
      orderableDocumentListDeskItem({
        type: "menuItem",
        id: "orderable-menuItem-drinks",
        title: "Menu - Drinks",
        icon: LemonIcon,
        filter: `category == "Drinks"`,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "menuItem",
        id: "orderable-menuItem-food",
        title: "Menu - Food",
        icon: IceCreamIcon,
        filter: `category == "Food"`,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "historyEntry",
        id: "orderable-historyEntry",
        title: "History entries",
        icon: ClockIcon,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "infoBlock",
        id: "orderable-infoBlock",
        title: "Info blocks",
        icon: InfoOutlineIcon,
        S,
        context,
      }),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !HIDDEN_FROM_DEFAULT_LIST.includes(item.getId() ?? ""),
      ),
    ]);
