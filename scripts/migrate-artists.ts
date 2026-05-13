/**
 * One-shot migration: lib/data/artists.json → Sanity `artist` documents.
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-artists.ts
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (Editor-level token from
 * https://www.sanity.io/manage → Project → API → Tokens).
 *
 * Re-runs are idempotent: documents use deterministic IDs derived from the
 * artist name slug + showFrom date. If a doc already has an image asset
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
const ARTISTS_JSON = resolve(REPO_ROOT, "lib/data/artists.json");
const PUBLIC_DIR = resolve(REPO_ROOT, "public");
const MAX_ATTEMPTS = 4;

type SourceArtist = {
  name: string;
  day: "friday" | "saturday" | "sunday";
  hour: string;
  showFrom: string;
  description: { nl: string; fr: string; en: string };
  imgSrc?: string;
  link?: string;
};

type ExistingArtist = { _id: string; image?: { asset?: { _ref?: string } } };

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const artistIdFor = (name: string, showFrom: string) =>
  `artist.${slugify(name)}.${showFrom.slice(0, 10)}`;

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
  const filename = absPath.split("/").pop() ?? "photo.webp";
  const asset = await withRetry(`upload ${filename}`, () =>
    client.assets.upload("image", createReadStream(absPath), {
      filename,
      contentType: "image/webp",
    }),
  );
  return asset._id;
}

async function migrate() {
  const raw = await readFile(ARTISTS_JSON, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  const artists = parsed as SourceArtist[];

  const ids = artists.map((a) => artistIdFor(a.name, a.showFrom));
  const existing = await client.fetch<ExistingArtist[]>(
    `*[_id in $ids]{ _id, image { asset } }`,
    { ids },
  );
  const existingById = new Map(existing.map((d) => [d._id, d]));

  console.log(`Migrating ${String(artists.length)} artists…`);
  const failures: { name: string; error: string }[] = [];

  for (const a of artists) {
    const _id = artistIdFor(a.name, a.showFrom);
    console.log(`• ${a.name} (${_id})`);

    try {
      let imageAssetId: string | null = null;
      const existingRef = existingById.get(_id)?.image?.asset?._ref;

      if (existingRef) {
        imageAssetId = existingRef;
        console.log(`  ↺ reusing existing image`);
      } else if (a.imgSrc) {
        imageAssetId = await uploadImage(a.imgSrc);
      }

      const doc = {
        _id,
        _type: "artist",
        name: a.name,
        day: a.day,
        hour: a.hour,
        showFrom: a.showFrom,
        link: a.link ?? null,
        description: (["nl", "fr", "en"] as const).map((locale) => ({
          _key: randomBytes(6).toString("hex"),
          _type: "internationalizedArrayTextValue",
          language: locale,
          value: a.description[locale],
        })),
        ...(imageAssetId && {
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: imageAssetId },
            alt: a.name,
          },
        }),
      };

      await withRetry(`createOrReplace ${_id}`, () =>
        client.createOrReplace(doc),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ failed: ${message}`);
      failures.push({ name: a.name, error: message });
    }

    await sleep(75);
  }

  const done = artists.length - failures.length;
  console.log(
    `\n✓ ${String(done)}/${String(artists.length)} artists migrated.`,
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
