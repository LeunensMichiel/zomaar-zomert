@AGENTS.md

# CLAUDE.md

Guidance for Claude Code in this repo. Visual language, primitives, and motion conventions live in [Design.md](Design.md). The [home page](app/%5Blocale%5D/page.tsx) is the canonical reference implementation for the design language.

## Project

`zomaar-zomert` is the Next.js 16 (App Router, Turbopack) site for the Belgian summer festival _Zomaar Zomert_. Stack: **Tailwind v4** + **shadcn/ui** (`new-york` style on the `base-ui` registry — see [components.json](components.json)). Primitives in [components/ui/](components/ui/) wrap [`@base-ui-components/react`](https://base-ui.com).

## Redesign rollout — status

The site is mid-rollout of a new visual language (festival zine / sticker-pack / paper-cut postcard). Patterns and primitives live in [Design.md](Design.md); the home page is the reference implementation.

**Done** (ported to the new design language):

- `/` (home) — was the `/redesign` prototype; now the live home, with the `/redesign` route + folder removed
- `/contact` — chunky-block header (yellow-on-black, right), form-first layout, map below
- `/info` — chunky-block header (pink-on-black, left), bento grid for FAQ + activities feature section
- `/line-up` — chunky-block header (red-on-yellow, centered) on `bg-blue-900`, sticky filter chips with `layoutId` pill, deal/flip card animations, route in `transparentRoutes`
- `/history` — chunky-block header (yellow-on-blue, left), shadcn-installed `<Timeline>` re-skinned, scroll-driven bg colour wave (`<ScrollBg>`), real first-edition poster + slides + closing crew portrait

**Not yet ported** (still on legacy markup):

- `/menu`, `/partners`, `/privacy-policy`, `app/[locale]/not-found.tsx`, `app/[locale]/error.tsx`

When porting, mirror an existing chunky-block page and pick a fresh colour combo for the header — the per-page header variation rule in [Design.md](Design.md#per-page-header-variation) lists the four taken so far. Keep server `page.tsx` + `'use client'` `_components/*` boundary; remember `<Doodle>` and `<PaperTear>` are server-only (server-render in the page, pass through as children when a client subtree needs them).

**Known dead code** (safe to delete in a cleanup pass; no remaining import paths):

- [app/[locale]/_components/home-marquees.tsx](app/%5Blocale%5D/_components/home-marquees.tsx) — used by the legacy home, replaced by `<PhotoMarquees>`. Source of the two pre-existing `<img>` lint warnings.
- [components/image-card.tsx](components/image-card.tsx) — legacy artist tile (`<ImageCard>`), unused since `/line-up` switched to `<LineUpArtistCard>` and the home swap. Note: `IImageCard` _type_ in [lib/models.ts](lib/models.ts) is still used by [components/artist-modal.tsx](components/artist-modal.tsx).
- [components/textured-image.tsx](components/textured-image.tsx) — only consumer is the dead `image-card.tsx`.

**Known acceptable noise**:

- [components/form.tsx:25](components/form.tsx#L25) — pre-existing `@typescript-eslint/no-unnecessary-condition` error on the `??` operator. Left alone per the original task brief.
- Legacy `<Button>` variants (`primary`, `transparent`, `minimal*`) — still used by `error.tsx`, `not-found.tsx`, `menu/_components/menu-client.tsx`, `cookie-banner.tsx`. Decommission only after the remaining pages are ported.

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

[components/layout.tsx](components/layout.tsx) is a `'use client'` shell rendering `Navbar` / `<main>` / `Footer` / `CookieBanner`. Navbar goes transparent only on routes listed in `transparentRoutes` inside that file (routes whose hero floats behind the navbar — currently `/` and `/line-up`).

### Server vs. client split

`app/**/page.tsx` is **always** a server component — `await params`, call `setRequestLocale(locale)`, fetch/transform data, call `getTranslations(...)` for SEO, render a `'use client'` subcomponent in `_components/` for interactive content. UI primitives that use motion / hooks / DOM APIs (`Button`, `Dialog`, `Navbar`, `LocaleSwitcher`, `CookieBanner`, `Form`, `Map`) are `'use client'`. Component file names are kebab-case.

`<Doodle>` and `<PaperTear>` are **server-only** (declare `import "server-only"`) — the inlined SVG path data would bloat the client bundle. To use them inside a client tree, render them in the parent `page.tsx` and pass through as `children` or a ReactNode prop. See [/line-up/page.tsx](app/%5Blocale%5D/line-up/page.tsx) for the bottom paper-tear pattern.

### Content as static JSON

Festival content lives as JSON in [lib/data/](lib/data/), not a CMS:

- [lib/data/artists.json](lib/data/artists.json), [lib/data/menu.json](lib/data/menu.json), [lib/data/partners.json](lib/data/partners.json)

Each record stores translated strings as `{ nl, fr, en }` (`TranslationString` in [lib/models.ts](lib/models.ts)). Server pages flatten these to the active locale via `loadXxx(locale)` helpers — see [/line-up/page.tsx](app/%5Blocale%5D/line-up/page.tsx) (`APIArtist → Artist`) for the canonical pattern. New content collections should mirror this `API*` → flat-shape transform so page components stay locale-agnostic.

Artists are filtered at render time by `showFrom` (date string) and `ZZ_YEAR`; TBA placeholders pad each day to a minimum count.

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
