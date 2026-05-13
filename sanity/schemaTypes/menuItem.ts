import { type ReactNode } from "react";
import { defineField, defineType } from "sanity";

export const menuItem = defineType({
  name: "menuItem",
  title: "Menu item",
  type: "document",
  fields: [
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
      description: "Drives the grouping inside each category tab.",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "price",
      type: "number",
      description: "In tokens (1 token ≈ €1 on-site).",
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
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first within a sub-category.",
      validation: (rule) => rule.integer(),
    }),
  ],
  preview: {
    select: {
      nlName: "name",
      media: "image",
      category: "category",
      price: "price",
    },
    prepare(selection: {
      nlName?: { language?: string; value?: string }[];
      media?: unknown;
      category?: string;
      price?: number;
    }) {
      const nlEntry = selection.nlName?.find(
        (entry) => entry.language === "nl",
      );
      const firstEntry = selection.nlName?.[0];
      const title = nlEntry?.value ?? firstEntry?.value ?? "(no name)";
      const subtitleParts: string[] = [];
      if (selection.category) subtitleParts.push(selection.category);
      if (typeof selection.price === "number") {
        subtitleParts.push(`${String(selection.price)} tok`);
      }
      return {
        title,
        subtitle: subtitleParts.join(" · "),
        media: selection.media as ReactNode,
      };
    },
  },
  orderings: [
    {
      title: "Category, then sort order",
      name: "categoryOrder",
      by: [
        { field: "category", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
