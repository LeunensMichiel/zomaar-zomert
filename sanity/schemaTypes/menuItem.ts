import { IceCreamIcon } from "@sanity/icons";
import { orderRankField } from "@sanity/orderable-document-list";
import { type ReactNode } from "react";
import { defineField, defineType } from "sanity";

export const SUB_CATEGORIES = [
  { title: "Water", value: "water" },
  { title: "Soft drinks", value: "soft-drinks" },
  { title: "Beers", value: "beers" },
  { title: "Wines", value: "wines" },
  { title: "Cocktails & spirits", value: "cocktails-spirits" },
  { title: "Meals", value: "meals" },
  { title: "Snacks", value: "snacks" },
] as const;

export const menuItem = defineType({
  name: "menuItem",
  title: "Food & Drinks",
  type: "document",
  icon: IceCreamIcon,

  fields: [
    defineField({
      name: "enabled",
      title: "Visible on the site",
      description:
        "Toggle off to hide this item without deleting it. Useful for seasonal swaps.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Drinks", value: "Drinks" },
          { title: "Food", value: "Food" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subCategory",
      title: "Sub-category",
      description:
        "Drives the grouping inside each category tab. Labels are translated in code.",
      type: "string",
      options: {
        list: [...SUB_CATEGORIES],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      type: "number",
      description: "In vouchers (1 voucher ≈ €1,5 on-site).",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayText",
    }),
    orderRankField({ type: "menuItem" }),
  ],
  preview: {
    select: {
      nlName: "name",
      media: "image",
      category: "category",
      subCategory: "subCategory",
      price: "price",
      enabled: "enabled",
    },
    prepare(selection: {
      nlName?: { language?: string; value?: string }[];
      media?: unknown;
      category?: string;
      subCategory?: string;
      price?: number;
      enabled?: boolean;
    }) {
      const nlEntry = selection.nlName?.find(
        (entry) => entry.language === "nl",
      );
      const firstEntry = selection.nlName?.[0];
      const title = nlEntry?.value ?? firstEntry?.value ?? "(no name)";
      const subtitleParts: string[] = [];
      if (selection.subCategory) subtitleParts.push(selection.subCategory);
      else if (selection.category) subtitleParts.push(selection.category);
      if (typeof selection.price === "number") {
        subtitleParts.push(`${String(selection.price)} voucher(s)`);
      }
      if (selection.enabled === false) subtitleParts.push("hidden");
      return {
        title,
        subtitle: subtitleParts.join(" · "),
        media: selection.media as ReactNode,
      };
    },
  },
});
