# zomaar-zomert

Next.js 16 (App Router, Turbopack) website for the Belgian summer festival _Zomaar Zomert_.

Built with **React 19**, **Tailwind v4**, **shadcn/ui** on the `base-ui` registry, **next-intl 4**, and **motion**. See [CLAUDE.md](CLAUDE.md) for architecture details.

## Requirements

- Node `>=24` (Ideally use nvm when on mac)
- Yarn `4.14.1` (Berry)

## Getting started

```zsh
# enable corepack if not yet done to download yarn 4
corepack enable
```

```zsh
yarn         # install
yarn dev     # dev server
yarn build   # production build
yarn start   # serve the build
```

## Quality

```zsh
yarn lint           # eslint (flat config)
yarn format         # prettier
yarn tsc --noEmit   # type-check (also runs on staged files via Husky)
```

## Festival edition

Hard-coded festival constants live in [lib/models.ts](lib/models.ts) (`ZZ_DATES`, `ZZ_YEAR`, signup form URLs, `ENABLE_LINKS_DATE`). Update these to roll the site to a new edition. Artists and menu live as static JSON under [lib/data/](lib/data/); partners are managed in Sanity (Studio mounted at `/studio`, schema in [sanity/schemaTypes/](sanity/schemaTypes/)).
