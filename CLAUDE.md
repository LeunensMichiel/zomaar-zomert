@AGENTS.md

# CLAUDE.md

Next.js 16 (App Router, Turbopack) site for the Belgian summer festival _Zomaar Zomert_. Tailwind v4 + shadcn/ui (`new-york` on the `base-ui` registry). Visual language lives in [Design.md](Design.md); the [home page](<app/(site)/[locale]/page.tsx>) is the reference implementation.

## Commands

Yarn 4 (Berry), Node >= 24.

- `yarn dev` / `yarn build` / `yarn start`
- `yarn lint` — eslint, type-checked rules
- `yarn format` — prettier
- `yarn tsc --noEmit` — runs on staged files via husky pre-commit

No tests.

## Architecture

**Routing.** All site routes live under [app/(site)/[locale]/](<app/(site)/[locale]/>); the Sanity Studio is at [app/(studio)/studio/](<app/(studio)/studio/>). There is no `app/layout.tsx`. The locale layout renders `<html>`/`<body>`, validates the locale (`notFound()` on miss), calls `setRequestLocale`, and mounts the shell from [components/layout.tsx](components/layout.tsx) (navbar, main, footer, cookie banner).

**Server/client split.** `page.tsx` is always a server component: `await params`, `setRequestLocale(locale)`, fetch data, `getTranslations` for metadata, then render a `'use client'` component from `_components/` for anything interactive. `<Doodle>` and `<PaperTear>` are `server-only` (their inlined SVG data would bloat the client bundle). To use them inside a client tree, render them in `page.tsx` and pass them down as `children` or a ReactNode prop. Component file names are kebab-case.

**Content.** Everything editable lives in Sanity: artists, partners, menu items, history entries, activities, side events, and a `siteSettings` singleton. Schemas in [sanity/schemaTypes/](sanity/schemaTypes/), GROQ and types in [sanity/lib/queries.ts](sanity/lib/queries.ts), typed reads via [sanity/lib/client.ts](sanity/lib/client.ts). The dataset is private and read with `SANITY_API_READ_TOKEN`. Localized fields use `sanity-plugin-internationalized-array` (v5 shape, `language` key) and are flattened to the active locale in GROQ via the `localizedFlat` fragment, so components receive plain strings. Artist visibility is enforced in the query (`showFrom <= now()`), never client-side.

**Dates and gates.** [lib/models.ts](lib/models.ts) is the single source of truth for festival dates (`ZZ_DATES`, `ZZ_YEAR`, …) and feature gates (`isSignupOpen`, `isRecapWindow`, `isGpxDownloadOpen`, …). Update it when rolling to a new edition.

**i18n.** next-intl 4, localized pathnames, `localePrefix: 'never'`, default `nl`. Routing in [lib/i18n/routing.ts](lib/i18n/routing.ts), negotiation in [proxy.ts](proxy.ts). Always import `Link`, `redirect`, `useRouter`, `usePathname`, `getPathname` from `@lib/i18n/navigation`, never from `next/link` or `next/navigation`. Messages are per-namespace JSON in [locales/{nl,fr,en}/](locales/); a new namespace needs all three files plus an entry in the `NAMESPACES` array in [lib/i18n/request.ts](lib/i18n/request.ts). Rich strings use `t.rich` with named tags; write `<br></br>`, not `<br/>`. Never hardcode user-facing strings.

**Metadata.** Every page exports `generateMetadata` using `getTranslations({ locale, namespace })`. [app/sitemap.ts](app/sitemap.ts) reads `routing.pathnames` directly (no request context there).

**Aliases.** `@/*`, `@components/*`, `@lib/*`, `@public/*`. No barrel files.

## Conventions

- **Styling:** Tailwind v4 only. Tokens in the `@theme` block of [app/globals.css](app/globals.css). Compose classes with `cn()` from `@lib/utils` (`classnames` is not a dep). Light theme only.
- **Motion:** `motion/react` only (not `framer-motion`, never gsap). Honor `useReducedMotion()` for every new effect.
- **Lint:** `no-explicit-any` is an error; imports are auto-sorted; unused `eslint-disable` directives fail. Existing `react-hooks/purity` disables cover hydration-only randomness. Don't `setState` inside `useEffect` to sync state; derive it instead.
- **Comments:** only for a non-obvious WHY, one or two lines. Don't narrate Tailwind, hooks, animations, or section layout, and don't add section-divider banners. If deleting the comment makes nothing harder to read, don't write it.
- **Copy:** read [.claude/product-marketing.md](.claude/product-marketing.md) before touching copy. Punchy, no em-dashes in user-facing text, at most one Brussels wink per block.
