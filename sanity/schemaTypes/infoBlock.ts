import { InfoOutlineIcon } from "@sanity/icons";
import { orderRankField } from "@sanity/orderable-document-list";
import { type ReactNode } from "react";
import { defineField, defineType } from "sanity";

const PALETTES = [
  { title: "Royal yellow", value: "royal-yellow" },
  { title: "Blue cola", value: "blue-cola" },
  { title: "Summer red", value: "summer-red" },
  { title: "Bubblegum", value: "bubblegum" },
  { title: "Milkshake", value: "milkshake" },
] as const;

const LAYOUTS = [
  { title: "Body — title + paragraph", value: "body" },
  { title: "Poster — big display text", value: "poster" },
  { title: "Polaroid — photo + caption", value: "polaroid" },
  { title: "Map — Sint-Anna-Pede venue map", value: "map" },
] as const;

const WIDTHS = [
  { title: "Narrow (⅓)", value: "narrow" },
  { title: "Wide (⅔)", value: "wide" },
  { title: "Full row", value: "full" },
] as const;

export const infoBlock = defineType({
  name: "infoBlock",
  title: "Info blocks",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "layout",
      description: "Visual treatment for this block.",
      type: "string",
      options: { list: [...LAYOUTS], layout: "radio" },
      initialValue: "body",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "palette",
      description:
        "Festival color preset — binds background, text and accent colors. Ignored for the map layout.",
      type: "string",
      options: { list: [...PALETTES], layout: "dropdown" },
      initialValue: "royal-yellow",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "width",
      description: "Grid width at desktop. Narrow = ⅓, wide = ⅔, full = row.",
      type: "string",
      options: { list: [...WIDTHS], layout: "radio" },
      initialValue: "narrow",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      description:
        "Body: heading. Poster: optional eyebrow above the display text. Map: sticker label overlaid on the map. Polaroid: ignored.",
      type: "internationalizedArrayString",
      hidden: ({ parent }: { parent?: { layout?: string } }) =>
        parent?.layout === "polaroid",
    }),
    defineField({
      name: "display",
      title: "Display text (poster)",
      description:
        "Huge headline shown in poster layout — e.g. “FREE!” or “FAIR.”. Used only when layout = poster.",
      type: "internationalizedArrayString",
      hidden: ({ parent }: { parent?: { layout?: string } }) =>
        parent?.layout !== "poster",
    }),
    defineField({
      name: "content",
      title: "Body copy",
      description:
        "Rich text — supports bold, emphasis and links. Used by body + poster layouts.",
      type: "internationalizedArraySimpleBlockContent",
      hidden: ({ parent }: { parent?: { layout?: string } }) =>
        parent?.layout === "polaroid" || parent?.layout === "map",
    }),
    defineField({
      name: "photo",
      title: "Polaroid photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
      hidden: ({ parent }: { parent?: { layout?: string } }) =>
        parent?.layout !== "polaroid",
    }),
    defineField({
      name: "photoCaption",
      title: "Polaroid caption",
      description: "Handwritten-style caption below the polaroid photo.",
      type: "internationalizedArrayString",
      hidden: ({ parent }: { parent?: { layout?: string } }) =>
        parent?.layout !== "polaroid",
    }),
    orderRankField({ type: "infoBlock" }),
  ],
  preview: {
    select: {
      layout: "layout",
      title: "title",
      display: "display",
      photoCaption: "photoCaption",
      media: "photo",
    },
    prepare(selection: {
      layout?: string;
      title?: { language?: string; value?: string }[];
      display?: { language?: string; value?: string }[];
      photoCaption?: { language?: string; value?: string }[];
      media?: unknown;
    }) {
      const nl = (
        arr: { language?: string; value?: string }[] | undefined,
      ): string | undefined =>
        arr?.find((v) => v.language === "nl")?.value ?? arr?.[0]?.value;
      const title =
        nl(selection.display) ??
        nl(selection.title) ??
        nl(selection.photoCaption) ??
        "(untitled)";
      return {
        title,
        subtitle: selection.layout,
        media: selection.media as ReactNode,
      };
    },
  },
});
