# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`zomaar-zomert` is the Next.js 16 (App Router, Turbopack) website for the Belgian summer festival *Zomaar Zomert*. It is built on top of an in-house "Next Foundry" starter — many of the components in [components/common](components/common/) and [components/ui](components/ui/) are generic template pieces that the festival site selectively uses.

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

All routes live under [app/[locale]/](app/[locale]/). The root [app/[locale]/layout.tsx](app/[locale]/layout.tsx) is the *only* layout that renders `<html>`/`<body>` — there is no separate `app/layout.tsx`. It validates the locale via `hasLocale(routing.locales, locale)` (calling `notFound()` on miss), runs `setRequestLocale(locale)`, then mounts the global providers and shell:

```
<NextIntlClientProvider>
  <ManagedUIProvider>
    <Layout>{children}<CookieBanner /></Layout>
  </ManagedUIProvider>
</NextIntlClientProvider>
<GoogleAnalytics gaId={...} />
```

[components/common/Layout/Layout.tsx](components/common/Layout/Layout.tsx) is a `'use client'` shell that renders `Navbar` / `<main>` / `Footer` and a single global `<Modal>` whose body is switched by the UI context. Navbar goes transparent only on routes listed in `transparentRoutes` inside Layout.tsx — currently just `/`.

**Server vs. client split**: `app/**/page.tsx` is always a server component — it `await params`, calls `setRequestLocale(locale)`, fetches/transforms data, calls `getTranslations(...)` for SEO, and renders a `'use client'` subcomponent in `_components/` for any interactive content. UI primitives that use motion, hooks, or DOM APIs (`Button`, `Modal`, `Navbar`, `Footer`, `LanguagePicker`, `CookieBanner`, `Form`, `Countdown`, `ImageCard`, `Map`) are all `'use client'`.

### Global modal via UI context

[lib/context/ui](lib/context/ui/) exposes a `ManagedUIProvider` and a `useUI()` hook (re-exported from [@lib/hooks](lib/hooks/index.ts)). The Layout owns the single `<Modal>` and switches body by `modalView`: `'NO_VIEW' | 'ARTIST_VIEW' | 'LANGUAGE_VIEW'`. To show a new modal, call `setModalView('ARTIST_VIEW', title, data)` and `openModal()`. To add a new modal type, extend `ModalViews` in [UIContext.tsx](lib/context/ui/UIContext.tsx) and add the matching branch in Layout.tsx — don't render ad-hoc modals from inside pages.

The Modal and the mobile Navbar drawer use `react-remove-scroll`'s `<RemoveScroll enabled={...}>` to lock body scroll while open — don't wire body-scroll-lock or hand-rolled overflow toggles back in.

### Content as static JSON, translated at build time

Festival content lives as JSON in [public/](public/), not in a CMS:

- [public/data.json](public/data.json) — artists/line-up
- [public/menu.json](public/menu.json) — food & drinks
- [public/partners.json](public/partners.json) — sponsors

Each record stores translated strings as `{ nl, fr, en }` objects (`TranslationString` in [lib/models.ts](lib/models.ts)). Server pages read these from disk in `loadXxx(locale)` helpers, flatten the strings down to the active `locale`, and pass the result to a client subcomponent — see [app/[locale]/line-up/page.tsx](app/%5Blocale%5D/line-up/page.tsx) (`APIArtist → Artist`) and [app/[locale]/menu/page.tsx](app/%5Blocale%5D/menu/page.tsx) (`APIMenuItem → MenuItem`) for the canonical pattern. When you add a new content collection, mirror this `API*` → flat-shape transform so page components stay locale-agnostic.

Artists are filtered at render time by `showFrom` (a date string) and the festival date constants — TBA placeholders are appended client-side until at least 3 entries exist for a day.

### Festival dates and feature gates

Hard-coded festival constants live in [lib/models.ts](lib/models.ts) (`ZZ_DATES`, `ZZ_DATE_FRIDAY/SATURDAY/SUNDAY`, `ZZ_YEAR`, signup form URLs, `ENABLE_LINKS_DATE`). Several pages compare `new Date()` against these to enable/disable signup buttons (e.g. [app/[locale]/_components/HomeClient.tsx](app/%5Blocale%5D/_components/HomeClient.tsx)). When rolling the site to a new edition, update these constants — they are the single source of truth, referenced from both pages and content filters.

### Internationalization (next-intl)

i18n is powered by **next-intl 4** with **localized pathnames** and `localePrefix: 'never'`. Routing config lives in [lib/i18n/routing.ts](lib/i18n/routing.ts):

- Locales `['nl', 'fr', 'en']`, **default `nl`** (Belgian site — keep this in mind when adding strings or test data).
- Per-locale URLs (e.g. `/history` → NL `/historie`, FR `/histoire`, EN `/history`). Internal route keys are typed as `AppPathname`.
- Locale negotiation runs in [proxy.ts](proxy.ts) (Next 16 renamed `middleware.ts` → `proxy.ts`). It sets the `NEXT_LOCALE` cookie and rewrites incoming localized URLs to the internal route.

**Always use the locale-aware navigation primitives** from [lib/i18n/navigation.ts](lib/i18n/navigation.ts):
```ts
import { Link, redirect, useRouter, usePathname, getPathname } from '@lib/i18n/navigation';
```
Never import `Link` / `useRouter` / `usePathname` from `next/link` or `next/navigation` for app navigation — those don't honor pathname localization. (`useSearchParams` is fine to import from `next/navigation`.)

**Translations**: per-namespace JSON files in [locales/{nl,fr,en}/](locales/) (one file per page namespace plus `common`). [lib/i18n/request.ts](lib/i18n/request.ts) loads them all per request. Adding a new namespace means adding the JSON file in all three locales **and** updating the `loadMessages` array in `request.ts`.

**Rich strings**: use named tags with `t.rich(...)`, e.g. `<strong>...</strong>`, `<br></br>` (use empty close tag rather than self-closing — ICU MessageFormat doesn't support `<br/>`), `<policy>...</policy>`. Don't use the legacy `<0>...</0>` indexed syntax from `next-translate`.

### SEO / metadata

Every page exports `generateMetadata({ params })` that awaits `params`, calls `getTranslations({ locale, namespace })` for SEO copy, and returns a `Metadata` object. The root layout sets the title template, default OG image, icons, manifest, and theme color. There is no `next-seo`.

[app/sitemap.ts](app/sitemap.ts) generates the sitemap with `hreflang` alternates for every locale, reading `routing.pathnames` directly (don't use `getPathname` here — it requires a request context). [app/robots.ts](app/robots.ts) handles robots.txt. There is no `next-sitemap` config.

### Path aliases

Defined in [tsconfig.json](tsconfig.json): `@/*`, `@components/*`, `@lib/*`, `@styles/*`, `@utils/*`, `@config/*`, `@assets/*`, `@public/*`. Prefer these over relative imports.

Component barrel exports live at [components/common/index.ts](components/common/index.ts), [components/ui/index.ts](components/ui/index.ts), and [components/icons/index.ts](components/icons/index.ts). Import from the barrel (`import { ImageCard, Layout } from '@components/common'`) rather than reaching into subfolders.

### Styling

SCSS modules per component (`Foo.module.scss`) plus globals in [styles/](styles/):

- [styles/global/](styles/global/) — reset, typography, colors, grid; loaded once via [styles/global/style.scss](styles/global/style.scss) imported in the root layout.
- [styles/themes/](styles/themes/) — light theme variables apply on `:root`. There is no theme switcher (next-themes was removed).
- [styles/mixins/](styles/mixins/) — `breakpoint-up`, transitions, animations.

[next.config.js](next.config.js) sets `sassOptions.loadPaths` to `[./styles, ./]`, so use **bare imports**: `@use 'mixins'` then `mixins.breakpoint-up(md)`. Don't write `@use '@styles/mixins'` — the `@` alias is TS-only, sass doesn't honor it.

Class composition is done with `classnames` (`cn()`). Container widths and section padding use the global utility classes `container` and `py-container--sm` rather than module-local rules.

### Animation / motion

Motion is provided by [`motion`](https://motion.dev) (rebranded `framer-motion`). Import from `motion/react`:

```ts
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
```

Don't import from `framer-motion` — it's not a dependency.

### Lint rules worth knowing

The flat ESLint config ([eslint.config.js](eslint.config.js)) enables `typescript-eslint`'s **type-checked** ruleset, so lint requires a successful `tsc` parse and is sensitive to `any` and unsafe assignments. Notable enforced rules:

- `@typescript-eslint/no-explicit-any: error` (a few legitimate escape hatches exist in [UIContext.tsx](lib/context/ui/UIContext.tsx) and [UIProvider.tsx](lib/context/ui/UIProvider.tsx) — disable line-locally with a comment if truly needed).
- `simple-import-sort/imports` and `/exports` — imports are auto-sorted; don't hand-order them.
- `reportUnusedDisableDirectives: error` — stale `eslint-disable` comments fail the build.
