@AGENTS.md

# CLAUDE.md

Guidance for Claude Code in this repo. Visual language, primitives, and motion conventions live in [Design.md](Design.md). The [home page](app/%5Blocale%5D/page.tsx) is the canonical reference implementation for the design language.

## Project

`zomaar-zomert` is the Next.js 16 (App Router, Turbopack) site for the Belgian summer festival _Zomaar Zomert_. Stack: **Tailwind v4** + **shadcn/ui** (`new-york` style on the `base-ui` registry — see [components.json](components.json)). Primitives in [components/ui/](components/ui/) wrap [`@base-ui-components/react`](https://base-ui.com).

## Design language

Visual language, tokens, and primitives live in [Design.md](Design.md). The festival-zine / sticker-pack / paper-cut-postcard system is fully rolled out across the site — every page opens with a dark hero band (so the always-transparent navbar reads in white), with a chunky-block headline + paired doodle, a `<PaperTear>` into the lighter content section below, and gutter doodles per the scatter rule. The [home page](app/%5Blocale%5D/page.tsx) is the canonical reference; mirror an existing page when adding a new one and pick a fresh chunky-block combo per the [per-page header variation](Design.md#per-page-header-variation) rule.

Keep the server `page.tsx` + `'use client'` `_components/*` boundary. `<Doodle>` and `<PaperTear>` are server-only — render them in the page and pass through as named props (`topTear`, `bottomTear`, etc.) when a client subtree needs them.

## Commands

Yarn 4.14.1 (Berry), Node `>=24`.

- `yarn dev` — Next dev server (Turbopack).
- `yarn build` / `yarn start` — production.
- `yarn lint` — `eslint .` (flat config in [eslint.config.js](eslint.config.js); type-checked rules need a clean tsc parse).
- `yarn format` — Prettier across the repo.
- `yarn tsc --noEmit` — type-check only. Husky pre-commit runs this on staged `.ts`/`.tsx` via [lint-staged.config.js](lint-staged.config.js).

There are no tests.

## Architecture

### App Router with locale-aware shell

All routes live under [app/[locale]/](app/[locale]/). The root [app/[locale]/layout.tsx](app/[locale]/layout.tsx) is the _only_ layout that renders `<html>`/`<body>` — there is no `app/layout.tsx`. It validates locale via `hasLocale(routing.locales, locale)` (`notFound()` on miss), runs `setRequestLocale(locale)`, then mounts providers and the shell.

[components/layout.tsx](components/layout.tsx) is the shell rendering `Navbar` / `<main>` / `Footer` / `CookieBanner`. The navbar is always transparent — every page is responsible for opening with a dark hero band so the white logo + menu trigger read on top.

### Server vs. client split

`app/**/page.tsx` is **always** a server component — `await params`, call `setRequestLocale(locale)`, fetch/transform data, call `getTranslations(...)` for SEO, render a `'use client'` subcomponent in `_components/` for interactive content. UI primitives that use motion / hooks / DOM APIs (`Button`, `Dialog`, `Navbar`, `LocaleSwitcher`, `CookieBanner`, `Form`, `Map`) are `'use client'`. Component file names are kebab-case.

`<Doodle>` and `<PaperTear>` are **server-only** (declare `import "server-only"`) — the inlined SVG path data would bloat the client bundle. To use them inside a client tree, render them in the parent `page.tsx` and pass through as `children` or a ReactNode prop. See [/line-up/page.tsx](app/%5Blocale%5D/line-up/page.tsx) for the bottom paper-tear pattern.

### Content sources

All festival content lives in **Sanity** — partners, artists, and menu items. Schemas in [sanity/schemaTypes/](sanity/schemaTypes/), GROQ + types in [sanity/lib/queries.ts](sanity/lib/queries.ts), reads via typed `client.fetch<T[]>` from [sanity/lib/client.ts](sanity/lib/client.ts) (private dataset, `SANITY_API_READ_TOKEN`-gated). Studio is embedded at `/studio`.

**Localized fields** use the [sanity-plugin-internationalized-array](https://github.com/sanity-io/plugins/tree/main/plugins/sanity-plugin-internationalized-array) plugin (v5 shape — `language` field, not `_key`). The plugin is configured in [sanity.config.ts](sanity.config.ts) with `nl/fr/en` and `fieldTypes: ["string", "text"]`. GROQ flattens to the active locale at query time via the `localizedFlat` fragment in [sanity/lib/queries.ts](sanity/lib/queries.ts) — page components receive flat strings, never the locale array.

**Artist visibility** is enforced **server-side** in the GROQ query (`showFrom <= now() && showFrom >= $yearStart`) so unannounced acts never leave Sanity — pass `yearStart = \`${ZZ_YEAR}-01-01T00:00:00Z\`` and `locale` to the query. TBA placeholders are still constructed client-side in [line-up-client.tsx](app/%5Bsite%5D/%5Blocale%5D/line-up/_components/line-up-client.tsx) to pad each day to a minimum count.

### Festival dates and feature gates

Constants in [lib/models.ts](lib/models.ts): `ZZ_DATES`, `ZZ_DATE_FRIDAY/SATURDAY/SUNDAY/MONDAY`, `ZZ_YEAR`, signup form URLs, `ENABLE_LINKS_DATE`. `isSignupOpen()` gates petanque/paella signup buttons. When rolling to a new edition, this file is the single source of truth.

### Internationalization (next-intl)

**next-intl 4** with **localized pathnames**, `localePrefix: 'never'`, default locale `nl` (Belgian site). Routing config in [lib/i18n/routing.ts](lib/i18n/routing.ts). Locale negotiation runs in [proxy.ts](proxy.ts) (Next 16 renamed `middleware.ts` → `proxy.ts`).

**Always use the locale-aware navigation primitives** from [lib/i18n/navigation.ts](lib/i18n/navigation.ts):

```ts
import { Link, redirect, useRouter, usePathname, getPathname } from '@lib/i18n/navigation';
```

Never import `Link` / `useRouter` / `usePathname` from `next/link` or `next/navigation` for app navigation — those don't honor pathname localization. (`useSearchParams` is fine to import from `next/navigation`.)

**Translations**: per-namespace JSON files in [locales/{nl,fr,en}/](locales/) (one per page namespace + `common`), loaded by [lib/i18n/request.ts](lib/i18n/request.ts). Adding a new namespace means adding the JSON in all three locales **and** updating the `loadMessages` array in `request.ts`.

**Rich strings**: `t.rich(...)` with named tags, e.g. `<strong>...</strong>`, `<br></br>` (use empty close tag — ICU MessageFormat doesn't support `<br/>`).

### SEO / metadata

Every page exports `generateMetadata({ params })` that awaits params, calls `getTranslations({ locale, namespace })` for SEO copy, and returns a `Metadata` object. Root layout sets the title template, default OG image, icons, manifest, theme color. There is no `next-seo`. [app/sitemap.ts](app/sitemap.ts) reads `routing.pathnames` directly (don't use `getPathname` here — needs request context). [app/robots.ts](app/robots.ts) handles robots.txt.

### Path aliases

Defined in [tsconfig.json](tsconfig.json): `@/*`, `@components/*`, `@lib/*`, `@public/*`. Prefer these over relative imports. No barrel files — import each component from its own file.

### Styling

Tailwind v4 only — tokens, fonts, scales declared in [app/globals.css](app/globals.css) `@theme {}` block. Class composition via `cn()` from [lib/utils.ts](lib/utils.ts) (wraps `clsx` + `tailwind-merge`). Don't import `classnames` — not a dependency. shadcn primitives in [components/ui/](components/ui/) are styled with `tailwind-variants` / `class-variance-authority`. No theme switcher (light only). For visual conventions and primitives, see [Design.md](Design.md).

### Motion

`motion/react` (rebranded `framer-motion`). Don't import from `framer-motion` — not a dep. Honor `useReducedMotion()` for any new effect. Specific motion moments (header scroll-shrink, kinetic menu hover, line-up filter pill, deal/flip card entries, etc.) documented in [Design.md](Design.md#motion).

### Lint rules worth knowing

ESLint flat config, type-checked. Notable enforced rules:

- `@typescript-eslint/no-explicit-any: error` — disable line-locally if you genuinely need an escape hatch.
- `simple-import-sort/imports` and `/exports` — imports are auto-sorted; don't hand-order.
- `reportUnusedDisableDirectives: error` — stale `eslint-disable` comments fail the build.
- `react-hooks/recommended-latest` (incl. `set-state-in-effect`). The `eslint-disable react-hooks/purity` lines you'll see are for legitimate hydration-only patches (random shuffles, `Date.now()` in server-component render, `localStorage` reads). Don't reach for `setState` inside `useEffect` for ordinary state syncing — derive from props/URL instead.
