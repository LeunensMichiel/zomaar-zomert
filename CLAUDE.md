# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`zomaar-zomert` is the Next.js 14 (pages router) website for the Belgian summer festival *Zomaar Zomert*. It is built on top of an in-house "Next Foundry" starter — many of the components in [components/common](components/common/) and [components/ui](components/ui/) are generic template pieces that the festival site selectively uses.

## Commands

Package manager is **Yarn 4.2.2** (Berry) and Node `>=24`.

- `yarn dev` — run the Next dev server.
- `yarn build` — production build. Runs `next-sitemap` automatically via `postbuild` (configured in [next.sitemap.js](next.sitemap.js)).
- `yarn start` — run the built app.
- `yarn lint` — `eslint .` (flat config in [eslint.config.js](eslint.config.js); type-checked rules require a working `tsconfig`).
- `yarn format` — run Prettier across the repo.
- `yarn tsc --noEmit` — type-check only (no `typecheck` script alias). The Husky pre-commit hook runs this on staged `.ts`/`.tsx` via [lint-staged.config.js](lint-staged.config.js).

There are no tests in this project.

## Architecture

### Pages router with per-page layouts

`_app.tsx` ([pages/_app.tsx](pages/_app.tsx)) reads a static `Component.Layout` from each page and wraps the page in it. Pages opt in by assigning at the bottom of the file, e.g. `Home.Layout = Layout`. Pages without a `Layout` get a `Noop` wrapper (no Navbar/Footer). When adding a top-level page, follow this same pattern rather than wrapping inside the page body.

The shared [Layout](components/common/Layout/Layout.tsx) renders `Navbar`, `main`, `Footer`, and a single global `Modal` whose contents are switched by the UI context (see below). The Navbar goes transparent only on routes listed in `transparentRoutes` inside Layout.tsx — currently just `/`.

### Global modal via UI context

[lib/context/ui](lib/context/ui/) exposes a `ManagedUIProvider` and a `useUI()` hook (re-exported from [@lib/hooks](lib/hooks/index.ts)). The Layout owns the single `<Modal>` and switches body by `modalView`: `'NO_VIEW' | 'ARTIST_VIEW' | 'LANGUAGE_VIEW'`. To show a new modal, call `setModalView('ARTIST_VIEW', title, data)` and `openModal()`. To add a new modal type, extend `ModalViews` in [UIContext.tsx](lib/context/ui/UIContext.tsx) and add the matching branch in Layout.tsx — don't render ad-hoc modals from inside pages.

### Content as static JSON, translated at build time

Festival content lives as JSON in [public/](public/), not in a CMS:

- [public/data.json](public/data.json) — artists/line-up
- [public/menu.json](public/menu.json) — food & drinks
- [public/partners.json](public/partners.json) — sponsors

Each record stores translated strings as `{ nl, fr, en }` objects (`TranslationString` in [lib/models.ts](lib/models.ts)). Pages read these via `getStaticProps`, then flatten the strings down to the active `locale` before returning props — see [pages/line-up.tsx](pages/line-up.tsx#L229) and [pages/menu.tsx](pages/menu.tsx#L129) for the canonical pattern (`APIArtist → Artist`, `APIMenuItem → MenuItem`). When you add a new content collection, mirror this `API*` → flat-shape transform so page components stay locale-agnostic.

Artists are filtered at render time by `showFrom` (a date string) and the festival date constants — TBA placeholders are appended client-side until at least 3 entries exist for a day.

### Festival dates and feature gates

Hard-coded festival constants live in [lib/models.ts](lib/models.ts) (`ZZ_DATES`, `ZZ_DATE_FRIDAY/SATURDAY/SUNDAY`, `ZZ_YEAR`, signup form URLs, `ENABLE_LINKS_DATE`). Several pages compare `new Date()` against these to enable/disable signup buttons (e.g. [pages/index.tsx:51-53](pages/index.tsx#L51-L53)). When rolling the site to a new edition, update these constants — they are the single source of truth, referenced from both pages and content filters.

### Internationalization

`next-translate` with locales `nl` (default) / `fr` / `en`, configured in [i18n.json](i18n.json) and [next.config.js](next.config.js). Per-page namespaces are declared in `i18n.json` — adding a new page with translations means adding both the file under [locales/](locales/) for each language and a route entry in `i18n.json`.

The Belgian default is **`nl`**, not `en` — keep that in mind when adding strings or test data. `usePersistLocaleCookie` ([lib/hooks/usePersistLocale.ts](lib/hooks/usePersistLocale.ts)) is invoked in `_app.tsx` to remember user-selected language across visits.

### Path aliases

Defined in [tsconfig.json](tsconfig.json): `@components/*`, `@lib/*`, `@styles/*`, `@utils/*`, `@config/*`, `@assets/*`, `@public/*`. Prefer these over relative imports (most existing code does, with a few `../lib/...` exceptions in pages).

Component barrel exports live at [components/common/index.ts](components/common/index.ts), [components/ui/index.ts](components/ui/index.ts), and [components/icons/index.ts](components/icons/index.ts). Import from the barrel (`import { ImageCard, Layout } from '@components/common'`) rather than reaching into subfolders.

### Styling

SCSS modules per component (`Foo.module.scss`) plus globals in [styles/](styles/):

- [styles/global/](styles/global/) — reset, typography, colors, grid; loaded once via [styles/global/style.scss](styles/global/style.scss) imported in `_app.tsx`.
- [styles/themes/](styles/themes/) — light/dark theme variables, switched by `next-themes`.
- [styles/mixins/](styles/mixins/) — `breakpoint-up`, transitions, animations. Use `@use '@styles/mixins'` then `mixins.breakpoint-up(md)` rather than redefining breakpoints.

Class composition is done with `classnames` (`cn()`). Container widths and section padding use the global utility classes `container` and `py-container--sm` rather than module-local rules.

### Lint rules worth knowing

The flat ESLint config ([eslint.config.js](eslint.config.js)) enables `typescript-eslint`'s **type-checked** ruleset, so lint requires a successful `tsc` parse and is sensitive to `any` and unsafe assignments. Notable enforced rules:

- `@typescript-eslint/no-explicit-any: error` (a few legitimate escape hatches exist in [UIContext.tsx](lib/context/ui/UIContext.tsx) and [_app.tsx](pages/_app.tsx) — disable line-locally with a comment if truly needed).
- `simple-import-sort/imports` and `/exports` — imports are auto-sorted; don't hand-order them.
- `reportUnusedDisableDirectives: error` — stale `eslint-disable` comments fail the build.
