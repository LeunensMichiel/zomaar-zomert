/**
 * One-shot migration: lib/data/partners.json → Sanity `partner` documents.
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-partners.ts
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (Editor-level token from
 * https://www.sanity.io/manage → Project → API → Tokens).
 *
 * Re-runs are idempotent: documents use deterministic IDs derived from the
 * partner name slug. If a partner already has a logo asset attached, the SVG
 * is not re-uploaded — useful to resume after a partial run.
 */

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
const PARTNERS_JSON = resolve(REPO_ROOT, "lib/data/partners.json");
const PUBLIC_DIR = resolve(REPO_ROOT, "public");
const MAX_ATTEMPTS = 4;

type SourcePartner = {
  name: string;
  formula: 1 | 2 | 3 | 4;
  logoWhite?: string;
  logoSize?: "sm" | "md" | "lg" | "xl";
  site?: string;
  disabled?: boolean;
};

type ExistingPartner = { _id: string; logo?: { asset?: { _ref?: string } } };

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const partnerIdFor = (name: string) => `partner.${slugify(name)}`;

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

async function uploadLogo(logoPath: string) {
  const absPath = resolve(PUBLIC_DIR, logoPath.replace(/^\//, ""));
  if (!existsSync(absPath)) {
    console.warn(`  ⚠ logo missing on disk: ${logoPath}`);
    return null;
  }
  const filename = absPath.split("/").pop() ?? "logo.svg";
  const asset = await withRetry(`upload ${filename}`, () =>
    client.assets.upload("image", createReadStream(absPath), {
      filename,
      contentType: "image/svg+xml",
    }),
  );
  return asset._id;
}

async function migrate() {
  const raw = await readFile(PARTNERS_JSON, "utf-8");
  const partners: SourcePartner[] = JSON.parse(raw);

  const ids = partners.map((p) => partnerIdFor(p.name));
  const existing = await client.fetch<ExistingPartner[]>(
    `*[_id in $ids]{ _id, logo { asset } }`,
    { ids },
  );
  const existingById = new Map(existing.map((d) => [d._id, d]));

  console.log(`Migrating ${String(partners.length)} partners…`);
  const failures: { name: string; error: string }[] = [];

  for (const p of partners) {
    const _id = partnerIdFor(p.name);
    console.log(`• ${p.name} (${_id})`);

    try {
      let logoAssetId: string | null = null;
      const existingLogoRef = existingById.get(_id)?.logo?.asset?._ref;

      if (existingLogoRef) {
        logoAssetId = existingLogoRef;
        console.log(`  ↺ reusing existing logo`);
      } else if (p.logoWhite) {
        logoAssetId = await uploadLogo(p.logoWhite);
      }

      const doc = {
        _id,
        _type: "partner",
        name: p.name,
        tier: p.formula,
        logoSize: p.logoSize ?? "md",
        website: p.site ?? null,
        active: !p.disabled,
        ...(logoAssetId && {
          logo: {
            _type: "image",
            asset: { _type: "reference", _ref: logoAssetId },
            alt: p.name,
          },
        }),
      };

      await withRetry(`createOrReplace ${_id}`, () =>
        client.createOrReplace(doc),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ failed: ${message}`);
      failures.push({ name: p.name, error: message });
    }

    await sleep(75);
  }

  const done = partners.length - failures.length;
  console.log(
    `\n✓ ${String(done)}/${String(partners.length)} partners migrated.`,
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
