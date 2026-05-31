import { StarIcon } from "@sanity/icons";
import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

const nlValue = (
  arr: { language?: string; value?: string }[] | undefined,
): string | undefined =>
  arr?.find((v) => v.language === "nl")?.value ?? arr?.[0]?.value;

export const activity = defineType({
  name: "activity",
  title: "Line-up activity",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "day",
      title: "Festival day",
      description:
        "Which day's column the card slots into on the line-up grid.",
      type: "string",
      options: {
        list: [
          { title: "Friday", value: "friday" },
          { title: "Saturday", value: "saturday" },
          { title: "Sunday", value: "sunday" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "timeLabel",
      title: "Time label",
      description:
        'Sticker text on the card. Leave empty to show just the day, or add a time / hint like "10:00" or "Hele dag".',
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "doodle",
      title: "Doodle",
      description:
        "Illustration on the card back — activities use a doodle instead of a photo so they read as extras, not acts.",
      type: "string",
      options: {
        list: [
          { title: "Lightning", value: "lightning" },
          { title: "Flame", value: "flame" },
          { title: "Star burst", value: "star-burst" },
          { title: "Sun rays", value: "sun-rays" },
          { title: "Star", value: "star" },
          { title: "Cocktail", value: "cocktail" },
          { title: "Asterisk", value: "asterisk" },
          { title: "Horns", value: "horns" },
        ],
      },
      initialValue: "star-burst",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageTag",
      title: "Photo tag",
      description:
        'Media-library tag to pull the card photo from (e.g. "bike", "run", "petanque", "paella"). The first matching image is used. Leave empty to fall back to the doodle.',
      type: "string",
    }),
    defineField({
      name: "linkTarget",
      title: "Links to",
      description: "Where the card navigates when tapped.",
      type: "string",
      options: {
        list: [
          { title: "Zomaar Bike page", value: "bike" },
          { title: "Zomaar Run page", value: "run" },
          { title: "Info page", value: "info" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    orderRankField({ type: "activity" }),
  ],
  preview: {
    select: { title: "name", day: "day", target: "linkTarget" },
    prepare: (sel: {
      title?: { language?: string; value?: string }[];
      day?: string;
      target?: string;
    }) => ({
      title: nlValue(sel.title) ?? "Activity",
      subtitle: [sel.day, sel.target && `→ ${sel.target}`]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
