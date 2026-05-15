import { ClockIcon } from "@sanity/icons";
import { orderRankField } from "@sanity/orderable-document-list";
import { type ReactNode } from "react";
import { defineField, defineType } from "sanity";

export const historyEntry = defineType({
  name: "historyEntry",
  title: "History entries",
  type: "document",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "year",
      title: "Year label",
      description: 'Display string, e.g. "1998" or "2026".',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Sticker label",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "body",
      type: "internationalizedArrayText",
    }),
    defineField({
      name: "images",
      title: "Images",
      description:
        "Optional photos to render alongside this entry. Drag to reorder. Each image can be styled as a polaroid (with an optional corner tag) or a plain image (with an optional caption underneath).",
      type: "array",
      of: [
        {
          type: "object",
          name: "historyImage",
          fields: [
            defineField({
              name: "photo",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alternative text",
                  type: "string",
                }),
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "kind",
              title: "Display style",
              type: "string",
              options: {
                list: [
                  { title: "Polaroid", value: "polaroid" },
                  { title: "Affiche (portrait poster)", value: "affiche" },
                  { title: "Normal image", value: "normal" },
                ],
                layout: "radio",
              },
              initialValue: "polaroid",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tag",
              title: "Corner tag",
              description:
                "Short sticker label for polaroid + affiche styles (e.g. “Eerste editie '98”). Ignored for normal images.",
              type: "internationalizedArrayString",
              hidden: ({ parent }: { parent?: { kind?: string } }) =>
                parent?.kind !== "polaroid" && parent?.kind !== "affiche",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              description:
                "Rendered under the image for the Normal style. Ignored for polaroids + affiches.",
              type: "internationalizedArrayString",
              hidden: ({ parent }: { parent?: { kind?: string } }) =>
                parent?.kind !== "normal",
            }),
          ],
          preview: {
            select: {
              kind: "kind",
              tag: "tag",
              caption: "caption",
              media: "photo",
            },
            prepare(selection: {
              kind?: string;
              tag?: { language?: string; value?: string }[];
              caption?: { language?: string; value?: string }[];
              media?: unknown;
            }) {
              const nl = (
                arr: { language?: string; value?: string }[] | undefined,
              ): string | undefined =>
                arr?.find((v) => v.language === "nl")?.value ?? arr?.[0]?.value;
              const kindLabel =
                selection.kind === "normal"
                  ? "Normal"
                  : selection.kind === "affiche"
                    ? "Affiche"
                    : "Polaroid";
              const overlay =
                selection.kind === "normal"
                  ? nl(selection.caption)
                  : nl(selection.tag);
              return {
                title: overlay ?? kindLabel,
                subtitle: kindLabel,
                media: selection.media as ReactNode,
              };
            },
          },
        },
      ],
    }),
    orderRankField({ type: "historyEntry" }),
  ],
  preview: {
    select: { title: "year", subtitle: "label", media: "images.0.photo" },
    prepare: (sel: {
      title?: string;
      subtitle?: { language?: string; value?: string }[];
      media?: unknown;
    }) => {
      const nl = sel.subtitle?.find((v) => v.language === "nl")?.value;
      const fallback = sel.subtitle?.[0]?.value;
      return {
        title: sel.title,
        subtitle: nl ?? fallback,
        media: sel.media as ReactNode,
      };
    },
  },
});
