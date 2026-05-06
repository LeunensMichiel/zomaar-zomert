@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`zomaar-zomert` is the Next.js 16 (App Router, Turbopack) website for the Belgian summer festival _Zomaar Zomert_. UI is built on **Tailwind v4** + **shadcn/ui** (the `new-york` style on the `base-ui` registry — see [components.json](components.json)), so primitives in [components/ui/](components/ui/) wrap [`@base-ui-components/react`](https://base-ui.com) under the shadcn conventions.

For the visual language, design tokens, and reusable primitives (stickers, paper tears, halftones, ticker strips, sticker buttons), see [Design.md](Design.md). [/redesign](app/%5Blocale%5D/redesign/page.tsx) is the reference implementation — when applying the design language to other pages, mirror its patterns.

## Commands

Package manager is **Yarn 4.14.1** (Berry) and Node `>=24`.

- `yarn dev` — Next dev server (Turbopack by default in Next 16; output to `.next/dev`).
- `yarn build` — production build (Turbopack).
- `yarn start` — run the built app.
- `yarn lint` — `eslint .` (flat config in [eslint.config.js](eslint.config.js); type-checked rules require a working `tsconfig`).
- `yarn format` — run Prettier across the repo.
- `yarn tsc --noEmit` — type-check only. The Husky pre-commit hook runs this on staged `.ts`/`.tsx` via [lint-staged.config.js](lint-staged.config.js).

There are no tests in this project.

## Architecture

### App Router with locale-aware shell

All routes live under [app/[locale]/](app/[locale]/). The root [app/[locale]/layout.tsx](app/[locale]/layout.tsx) is the _only_ layout that renders `<html>`/`<body>` — there is no separate `app/layout.tsx`. It validates the locale via `hasLocale(routing.locales, locale)` (calling `notFound()` on miss), runs `setRequestLocale(locale)`, then mounts the providers and shell:

```
<NextIntlClientProvider>
  <Layout>{children}</Layout>
</NextIntlClientProvider>
<GoogleAnalytics gaId={...} />
```

[components/layout.tsx](components/layout.tsx) is a `'use client'` shell that renders `Navbar` / `<main>` / `Footer` / `CookieBanner`. Navbar goes transparent only on routes listed in `transparentRoutes` inside that file (routes whose hero sits behind the fixed navbar).

**Server vs. client split**: `app/**/page.tsx` is always a server component — it `await params`, calls `setRequestLocale(locale)`, fetches/transforms data, calls `getTranslations(...)` for SEO, and renders a `'use client'` subcomponent in `_components/` for interactive content (e.g. [home-client.tsx](app/%5Blocale%5D/_components/home-client.tsx), [line-up-client.tsx](app/%5Blocale%5D/line-up/_components/line-up-client.tsx)). UI primitives that use motion, hooks, or DOM APIs (`Button`, `Dialog`, `Navbar`, `LocaleSwitcher`, `CookieBanner`, `Form`, `Countdown`, `ImageCard`, `Map`) are all `'use client'`. The global `Footer` is a server component (rendered as a prop into the client `Layout`). Component file names are kebab-case (`image-card.tsx`, not `ImageCard.tsx`).

### Modals

There is no global modal context — render modals locally with the shadcn `Dialog` wrapper from [components/ui/dialog.tsx](components/ui/dialog.tsx) (which proxies `@base-ui-components/react/dialog`). Hold open state where it belongs, e.g. [image-card.tsx](components/image-card.tsx) for the artist sheet, [navbar.tsx](components/navbar.tsx) for the kinetic full-screen menu. Base UI's Dialog handles its own scroll lock — don't add `body.style.overflow` toggles or `react-remove-scroll` (it isn't installed).

### Content as static JSON, translated at build time

Festival content lives as JSON in [lib/data/](lib/data/), not in a CMS:

- [lib/data/artists.json](lib/data/artists.json) — artists/line-up
- [lib/data/menu.json](lib/data/menu.json) — food & drinks
- [lib/data/partners.json](lib/data/partners.json) — sponsors

Each record stores translated strings as `{ nl, fr, en }` objects (`TranslationString` in [lib/models.ts](lib/models.ts)). Server pages read these from disk in `loadXxx(locale)` helpers, flatten the strings down to the active `locale`, and pass the result to a client subcomponent — see [app/[locale]/line-up/page.tsx](app/%5Blocale%5D/line-up/page.tsx) (`APIArtist → Artist`) and [app/[locale]/menu/page.tsx](app/%5Blocale%5D/menu/page.tsx) (`APIMenuItem → MenuItem`) for the canonical pattern. When you add a new content collection, mirror this `API*` → flat-shape transform so page components stay locale-agnostic.

Artists are filtered at render time by `showFrom` (a date string) and the festival date constants — TBA placeholders are appended client-side until at least 3 entries exist for a day.

### Festival dates and feature gates

Hard-coded festival constants live in [lib/models.ts](lib/models.ts) (`ZZ_DATES`, `ZZ_DATE_FRIDAY/SATURDAY/SUNDAY/MONDAY`, `ZZ_YEAR`, signup form URLs, `ENABLE_LINKS_DATE`). Several pages compare `new Date()` against these to enable/disable signup buttons (e.g. [home-client.tsx](app/%5Blocale%5D/_components/home-client.tsx)). When rolling the site to a new edition, update these constants — they are the single source of truth, referenced from both pages and content filters.

### Internationalization (next-intl)

i18n is powered by **next-intl 4** with **localized pathnames** and `localePrefix: 'never'`. Routing config lives in [lib/i18n/routing.ts](lib/i18n/routing.ts):

- Locales `['nl', 'fr', 'en']`, **default `nl`** (Belgian site — keep this in mind when adding strings or test data).
- Per-locale URLs (e.g. `/history` → NL `/historie`, FR `/histoire`, EN `/history`). Internal route keys are typed as `AppPathname`.
- Locale negotiation runs in [proxy.ts](proxy.ts) (Next 16 renamed `middleware.ts` → `proxy.ts`). It sets the `NEXT_LOCALE` cookie and rewrites incoming localized URLs to the internal route.

**Always use the locale-aware navigation primitives** from [lib/i18n/navigation.ts](lib/i18n/navigation.ts):

```ts
import {
  Link,
  redirect,
  useRouter,
  usePathname,
  getPathname,
} from '@lib/i18n/navigation';
```

Never import `Link` / `useRouter` / `usePathname` from `next/link` or `next/navigation` for app navigation — those don't honor pathname localization. (`useSearchParams` is fine to import from `next/navigation`.)

**Translations**: per-namespace JSON files in [locales/{nl,fr,en}/](locales/) (one file per page namespace plus `common`). [lib/i18n/request.ts](lib/i18n/request.ts) loads them all per request. Adding a new namespace means adding the JSON file in all three locales **and** updating the `loadMessages` array in `request.ts`.

**Rich strings**: use named tags with `t.rich(...)`, e.g. `<strong>...</strong>`, `<br></br>` (use empty close tag rather than self-closing — ICU MessageFormat doesn't support `<br/>`), `<policy>...</policy>`. Don't use the legacy `<0>...</0>` indexed syntax from `next-translate`.

### SEO / metadata

Every page exports `generateMetadata({ params })` that awaits `params`, calls `getTranslations({ locale, namespace })` for SEO copy, and returns a `Metadata` object. The root layout sets the title template, default OG image, icons, manifest, and theme color. There is no `next-seo`.

[app/sitemap.ts](app/sitemap.ts) generates the sitemap with `hreflang` alternates for every locale, reading `routing.pathnames` directly (don't use `getPathname` here — it requires a request context). [app/robots.ts](app/robots.ts) handles robots.txt. There is no `next-sitemap` config.

### Path aliases

Defined in [tsconfig.json](tsconfig.json): `@/*`, `@components/*`, `@lib/*`, `@public/*`. Prefer these over relative imports. There are no barrel files — import each component from its own file (e.g. `import { ImageCard } from '@components/image-card'`, `import { Button } from '@components/ui/button'`).

### Styling

Tailwind v4 only — there is no SCSS in this project. Tokens, fonts, and the colour scale are declared in [app/globals.css](app/globals.css) inside an `@theme {}` block (e.g. `--color-brand-500`, `--font-display`); use the generated utilities (`bg-brand-500`, `font-display`) rather than hand-rolling CSS.

- [app/globals.css](app/globals.css) is the single stylesheet, imported by the root layout.
- shadcn primitives in [components/ui/](components/ui/) are styled with `tailwind-variants` / `class-variance-authority` and use `data-[...]` attributes from Base UI for state styling.
- There is no theme switcher (light only).

Class composition is done with **`cn()` from [lib/utils.ts](lib/utils.ts)** — it pipes `clsx` through `tailwind-merge`, so later classes win conflicts cleanly. Don't import `classnames` (not a dependency).

### Animation / motion

Motion is provided by [`motion`](https://motion.dev) (rebranded `framer-motion`). Import from `motion/react`:

```ts
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
```

Don't import from `framer-motion` — it's not a dependency.

### Lint rules worth knowing

The flat ESLint config ([eslint.config.js](eslint.config.js)) enables `typescript-eslint`'s **type-checked** ruleset, so lint requires a successful `tsc` parse and is sensitive to `any` and unsafe assignments. Notable enforced rules:

- `@typescript-eslint/no-explicit-any: error` — disable line-locally with a comment if you genuinely need an escape hatch.
- `simple-import-sort/imports` and `/exports` — imports are auto-sorted; don't hand-order them.
- `reportUnusedDisableDirectives: error` — stale `eslint-disable` comments fail the build.
- `react-hooks` plugin runs the `recommended-latest` config, which includes `set-state-in-effect`. The disables you see in the codebase mark genuine hydration-only patches (random shuffles, `localStorage` reads); don't reach for `setState` inside `useEffect` for ordinary state syncing — derive from props or URL instead.
