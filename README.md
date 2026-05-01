# zomaar-zomert

Next.js 16 (App Router, Turbopack) website for the Belgian summer festival _Zomaar Zomert_.

Built with **React 19**, **Tailwind v4**, **shadcn/ui** on the `base-ui` registry, **next-intl 4**, and **motion**. See [CLAUDE.md](CLAUDE.md) for architecture details.

## Requirements

- Node `>=24`
- Yarn `4.14.1` (Berry)

## Getting started

```bash
yarn         # install
yarn dev     # dev server
yarn build   # production build
yarn start   # serve the build
```

## Quality

```bash
yarn lint           # eslint (flat config)
yarn format         # prettier
yarn tsc --noEmit   # type-check (also runs on staged files via Husky)
```

## Festival edition

Hard-coded festival constants live in [lib/models.ts](lib/models.ts) (`ZZ_DATES`, `ZZ_YEAR`, signup form URLs, `ENABLE_LINKS_DATE`). Update these to roll the site to a new edition. Content lives as static JSON under [public/](public/) (`data.json`, `menu.json`, `partners.json`).
