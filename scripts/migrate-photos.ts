/**
 * One-shot migration: /public/assets/{slides,random} → Sanity assets
 * tagged via sanity-plugin-media (`media.tag` documents + asset
 * `opt.media.tags[]` weak references).
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-photos.ts
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local.
 *
 * Re-runs are idempotent: tag docs use deterministic IDs and existing
 * tag references on assets are detected before appending (so a re-run
 * doesn't duplicate tags). Sanity asset uploads are content-deduped by
 * the server, so uploading the same file twice returns the same asset.
 */

import { randomBytes } from "node:crypto";
import { createReadStream, existsSync, readdirSync } from "node:fs";
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
const SLIDES_DIR = resolve(REPO_ROOT, "public/assets/slides");
const RANDOM_DIR = resolve(REPO_ROOT, "public/assets/random");
const DAYS_DIR = resolve(REPO_ROOT, "public/assets/days");
const AFFICHES_DIR = resolve(REPO_ROOT, "public/assets/affiches");
const MAX_ATTEMPTS = 4;

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

async function ensureTag(tagName: string): Promise<string> {
  const _id = `media.tag.${tagName}`;
  await withRetry(`ensure tag ${tagName}`, () =>
    client.createIfNotExists({
      _id,
      _type: "media.tag",
      name: { _type: "slug", current: tagName },
    }),
  );
  return _id;
}

const contentTypeFor = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  switch (ext) {
    case "webp":
      return "image/webp";
    case "png":
      return "image/png";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/jpeg";
  }
};

async function uploadFileAndTag({
  absPath,
  filename,
  tagId,
}: {
  absPath: string;
  filename: string;
  tagId: string;
}) {
  if (!existsSync(absPath)) {
    console.warn(`  ⚠ missing on disk: ${filename}`);
    return;
  }

  const asset = await withRetry(`upload ${filename}`, () =>
    client.assets.upload("image", createReadStream(absPath), {
      filename,
      contentType: contentTypeFor(filename),
    }),
  );

  // Skip tagging if this asset already has this tag
  const existingTagRefs =
    (
      asset as unknown as {
        opt?: { media?: { tags?: { _ref?: string }[] } };
      }
    ).opt?.media?.tags ?? [];
  if (existingTagRefs.some((t) => t._ref === tagId)) {
    console.log(`  ↺ ${filename} already tagged`);
    return;
  }

  await withRetry(`tag ${filename}`, () =>
    client
      .patch(asset._id)
      .setIfMissing({ opt: {} })
      .setIfMissing({ "opt.media": {} })
      .setIfMissing({ "opt.media.tags": [] })
      .append("opt.media.tags", [
        {
          _key: randomBytes(6).toString("hex"),
          _ref: tagId,
          _type: "reference",
          _weak: true,
        },
      ])
      .commit(),
  );
  console.log(`  + ${filename} → ${tagId.replace("media.tag.", "")}`);
}

async function migrate() {
  // 1. Create all tag docs first
  console.log("Creating tag docs…");
  const slideshowTagId = await ensureTag("slideshow");
  const tagByFilename: Record<string, string> = {
    "food.jpg": await ensureTag("food"),
    "petanque.jpg": await ensureTag("petanque"),
    "crew26.webp": await ensureTag("crew"),
    "terras.jpg": await ensureTag("terras"),
  };
  const dayTagByFilename: Record<string, string> = {
    "friday.webp": await ensureTag("friday"),
    "saturday.webp": await ensureTag("saturday"),
    "sunday.jpg": await ensureTag("sunday"),
  };
  const afficheTagByFilename: Record<string, string> = {
    "first_edition.webp": await ensureTag("first-edition"),
  };

  // 2. Upload slides (every file in slides/ gets the "slideshow" tag)
  const slideFiles = readdirSync(SLIDES_DIR).filter((f) =>
    /\.(webp|jpg|jpeg|png)$/i.test(f),
  );
  console.log(`\nMigrating ${String(slideFiles.length)} slides…`);
  for (const filename of slideFiles) {
    console.log(`• ${filename}`);
    await uploadFileAndTag({
      absPath: resolve(SLIDES_DIR, filename),
      filename,
      tagId: slideshowTagId,
    });
    await sleep(75);
  }

  // 3. Upload random photos (each gets its own tag based on filename)
  const randomFiles = readdirSync(RANDOM_DIR).filter((f) =>
    /\.(webp|jpg|jpeg|png)$/i.test(f),
  );
  console.log(`\nMigrating ${String(randomFiles.length)} contextual photos…`);
  for (const filename of randomFiles) {
    const tagId = tagByFilename[filename];
    if (!tagId) {
      console.warn(`  ⚠ no tag mapping for ${filename}, skipping`);
      continue;
    }
    console.log(`• ${filename}`);
    await uploadFileAndTag({
      absPath: resolve(RANDOM_DIR, filename),
      filename,
      tagId,
    });
    await sleep(75);
  }

  // 4. Upload day photos (each tagged with its weekday)
  const dayFiles = readdirSync(DAYS_DIR).filter((f) =>
    /\.(webp|jpg|jpeg|png)$/i.test(f),
  );
  console.log(`\nMigrating ${String(dayFiles.length)} day photos…`);
  for (const filename of dayFiles) {
    const tagId = dayTagByFilename[filename];
    if (!tagId) {
      console.warn(`  ⚠ no tag mapping for ${filename}, skipping`);
      continue;
    }
    console.log(`• ${filename}`);
    await uploadFileAndTag({
      absPath: resolve(DAYS_DIR, filename),
      filename,
      tagId,
    });
    await sleep(75);
  }

  // 5. Upload affiches (edition-specific posters)
  const afficheFiles = readdirSync(AFFICHES_DIR).filter((f) =>
    /\.(webp|jpg|jpeg|png)$/i.test(f),
  );
  console.log(`\nMigrating ${String(afficheFiles.length)} affiches…`);
  for (const filename of afficheFiles) {
    const tagId = afficheTagByFilename[filename];
    if (!tagId) {
      console.warn(`  ⚠ no tag mapping for ${filename}, skipping`);
      continue;
    }
    console.log(`• ${filename}`);
    await uploadFileAndTag({
      absPath: resolve(AFFICHES_DIR, filename),
      filename,
      tagId,
    });
    await sleep(75);
  }

  console.log("\n✓ Done.");
}

migrate().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
