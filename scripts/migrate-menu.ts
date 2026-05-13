/**
 * One-shot migration: lib/data/menu.json → Sanity `menuItem` documents.
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-menu.ts
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local.
 *
 * Re-runs are idempotent: documents use deterministic IDs derived from the
 * Dutch name slug + category. If a menu item already has an image asset
 * attached, the photo is not re-uploaded.
 */

import { randomBytes } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
if (!dataset) throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");
if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-13",
  token,
  useCdn: false,
});

const REPO_ROOT = resolve(import.meta.dirname, "..");
const MENU_JSON = resolve(REPO_ROOT, "lib/data/menu.json");
const PUBLIC_DIR = resolve(REPO_ROOT, "public");
const MAX_ATTEMPTS = 4;
const LOCALES = ["nl", "fr", "en"] as const;

type Locale = (typeof LOCALES)[number];
type LocalizedString = Record<Locale, string>;

type SourceMenuItem = {
  name: LocalizedString;
  description: LocalizedString;
  subCategory: LocalizedString;
  price: number;
  img?: string;
  category: "Drinks" | "Food";
};

type ExistingMenuItem = { _id: string; image?: { asset?: { _ref?: string } } };

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const menuIdFor = (nlName: string, category: string) =>
  `menuItem.${slugify(category)}.${slugify(nlName)}`;

const isTransient = (err: unknown) => {
  const e = err as { statusCode?: number; code?: string };
  if (e.statusCode && e.statusCode >= 500) return true;
  if (e.code === "ECONNRESET" || e.code === "ETIMEDOUT") return true;
  if (e.code === "EAI_AGAIN" || e.code === "ENOTFOUND") return true;
  return false;
};

async function withRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === MAX_ATTEMPTS || !isTransient(err)) throw err;
      const delay = 500 * 2 ** (attempt - 1);
      console.warn(
        `  ↻ ${label} failed (attempt ${String(attempt)}/${String(MAX_ATTEMPTS)}), retrying in ${String(delay)}ms…`,
      );
      await sleep(delay);
    }
  }
  throw new Error("unreachable");
}

async function uploadImage(imgPath: string) {
  const absPath = resolve(PUBLIC_DIR, imgPath.replace(/^\//, ""));
  if (!existsSync(absPath)) {
    console.warn(`  ⚠ image missing on disk: ${imgPath}`);
    return null;
  }
  const filename = absPath.split("/").pop() ?? "photo.jpg";
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const contentType = ext === "png" ? "image/png" : "image/jpeg";
  const asset = await withRetry(`upload ${filename}`, () =>
    client.assets.upload("image", createReadStream(absPath), {
      filename,
      contentType,
    }),
  );
  return asset._id;
}

const i18nString = (values: LocalizedString) =>
  LOCALES.map((locale) => ({
    _key: randomBytes(6).toString("hex"),
    _type: "internationalizedArrayStringValue",
    language: locale,
    value: values[locale],
  }));

const i18nText = (values: LocalizedString) =>
  LOCALES.map((locale) => ({
    _key: randomBytes(6).toString("hex"),
    _type: "internationalizedArrayTextValue",
    language: locale,
    value: values[locale],
  }));

async function migrate() {
  const raw = await readFile(MENU_JSON, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  const items = parsed as SourceMenuItem[];

  const ids = items.map((it) => menuIdFor(it.name.nl, it.category));
  const existing = await client.fetch<ExistingMenuItem[]>(
    `*[_id in $ids]{ _id, image { asset } }`,
    { ids },
  );
  const existingById = new Map(existing.map((d) => [d._id, d]));

  console.log(`Migrating ${String(items.length)} menu items…`);
  const failures: { name: string; error: string }[] = [];

  for (const [index, it] of items.entries()) {
    const _id = menuIdFor(it.name.nl, it.category);
    console.log(`• ${it.name.nl} (${_id})`);

    try {
      let imageAssetId: string | null = null;
      const existingRef = existingById.get(_id)?.image?.asset?._ref;

      if (existingRef) {
        imageAssetId = existingRef;
        console.log(`  ↺ reusing existing image`);
      } else if (it.img) {
        imageAssetId = await uploadImage(it.img);
      }

      const doc = {
        _id,
        _type: "menuItem",
        category: it.category,
        price: it.price,
        order: index + 1,
        name: i18nString(it.name),
        description: i18nText(it.description),
        subCategory: i18nString(it.subCategory),
        ...(imageAssetId && {
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: imageAssetId },
            alt: it.name.nl,
          },
        }),
      };

      await withRetry(`createOrReplace ${_id}`, () =>
        client.createOrReplace(doc),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ failed: ${message}`);
      failures.push({ name: it.name.nl, error: message });
    }

    await sleep(75);
  }

  const done = items.length - failures.length;
  console.log(
    `\n✓ ${String(done)}/${String(items.length)} menu items migrated.`,
  );
  if (failures.length) {
    console.log(`\nFailures (${String(failures.length)}):`);
    for (const f of failures) console.log(`  • ${f.name}: ${f.error}`);
    console.log(`\nRun the script again to retry the failed ones.`);
    process.exit(1);
  }
}

migrate().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
