# Design.md

Visual language, tokens, and primitives for the Zomaar Zomert site. The [home page](<app/(site)/[locale]/page.tsx>) is the reference implementation; mirror an existing page when adding a new one.

## Direction

Summer-festival zine, skate-shop sticker pack, paper-cut postcard. Young, loud, hand-made. Never SaaS, never corporate. Reference points: Pukkelpop, Rock Werchter, with our own torn-paper / collage / bold DNA.

Recurring moves:

1. **Halftone dots** over photography (`mix-blend-multiply`).
2. **Paper tears** between sections.
3. **Stickers**: chunky uppercase badges, 2px black border, hard offset shadow, slight rotation.
4. **Big Oswald headlines** that fill the screen.
5. **Tilted, overlapping cards**. Never a perfectly aligned grid; 1–2° is plenty.

## Tokens

All tokens live in the `@theme` block of [app/globals.css](app/globals.css).

### Colour

| Name (Figma) | Hex       | Scale slot   | Alias          | Usage                                   |
| ------------ | --------- | ------------ | -------------- | --------------------------------------- |
| Summer Red   | `#de350b` | `brand-500`  | `summer-red`   | CTAs, hot fills                         |
| Royal Yellow | `#ffb600` | `yellow-400` | `royal-yellow` | Stickers, highlights                    |
| Dimmed Led   | `#fee198` | `yellow-100` | `dimmed-led`   | Cream highlights, soft sticker fills    |
| Blue Cola    | `#3b84db` | `blue-500`   | `blue-cola`    | Secondary tiles, headliner cards        |
| Tardis Blue  | `#193d6b` | `blue-900`   | `tardis-blue`  | Deep "summer night" backgrounds         |
| Black        | `#000000` |              |                | Offset shadows and sticker borders only |

Pink `pink-400` (`#ff8faa`) is the hot pink in gradient stops; `pink-50` / `pink-300` are soft backgrounds. Ink is `gray-900` (`#1a1a1a`) for body text. Don't introduce greys outside the existing scale.

### Gradients

Exposed as `bg-*` utilities and accepted as `color` / `accent` on `<Doodle>`.

| Utility            | Stops                          | Use                                  |
| ------------------ | ------------------------------ | ------------------------------------ |
| `bg-linear-red`    | `#ff1d25` → `#961702`          | Countdown panel, anchor doodle fills |
| `bg-linear-sunset` | `#ffb600` → `#ff7bac`          | Star-bursts, sun-rays                |
| `bg-radial-red`    | `#ff7bac` → `#de350b` (radial) | One-off accents                      |
| `bg-80s-gum`       | `#3b84db` → `#ff8faa`          | Cool-to-hot accent for blue sections |

At most one gradient per section.

### Type

- **Display**: Oswald 700 (`font-display`). Headings, sticker labels, buttons, eyebrows. Uppercase, line-height ≤ 1.05.
- **Body**: Open Sans (`font-sans`), 400, 700 for `<strong>`. Line-height 1.5.

### Radius, shadow, spacing

- `--radius: 0`. Square corners everywhere; pills only on deliberate sticker shapes.
- No drop shadows. Use `shadow-sticker[-sm|-lg]` (hard black offset; tune via `--sticker-x`, `--sticker-y`, `--sticker-color`).
- Cards: 2px black border + sticker shadow.
- Width: `container-wide` (1640px). `container-page` is legacy.
- Vertical rhythm: `section-y` (3 / 6 / 9 rem) or `section-y-sm` (3 / 5 rem). Don't hand-roll section padding.
- Mobile is the primary canvas (80% of traffic). Stacks collapse to one column; tilt stays visible at every breakpoint.

## Headlines

**Section titles are short, big, or absent.** Sticker eyebrow + visuals usually say enough; skip the title. If you keep one, make it one or two words at poster scale (`text-7xl leading-[0.85] md:text-9xl xl:text-[14rem]`), e.g. `Line-up.`, `Doe mee.`, `100% Gratis.`. No sentence-y subtitles or marketing ledes.

**Chunky block** is the interior-page alternative when the body is the main event: the headline word sits in a tilted bordered block with sticker shadow at mid scale.

```tsx
<h1 className="font-display shadow-sticker-lg inline-block -rotate-2 bg-gray-900 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-300 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
  Info.
</h1>
```

### Per-page header variation

Every page opens with a dark band so the always-transparent navbar reads in white. Vary at least two axes between pages so the site doesn't feel templated: position (left / right / centre), pairing element (doodle, polaroid, ticker, photo), colour combo, tilt direction, treatment (chunky block / poster word / stacked words).

The shared interior shape is **header-below-tear**: a thin coloured strip (`h-16 md:h-20 lg:h-24`) behind the fixed navbar, capped by `<PaperTear tear={1}>` into the content section. The chunky block lives at the top of that next section, not in the strip. Current combos:

| Page        | Strip       | Block                              |
| ----------- | ----------- | ---------------------------------- |
| `/info`     | `brand-500` | gray-900 / pink-300, `-rotate-2`   |
| `/contact`  | `brand-500` | gray-900 / pink-300, `rotate-2`    |
| `/menu`     | `blue-500`  | brand-500 / yellow-400, `rotate-2` |
| `/history`  | `blue-900`  | blue-900 / yellow-400, `-rotate-1` |
| `/partners` | `brand-900` | yellow-400 / blue-900, `-rotate-2` |

Exceptions: `/line-up` has a full `blue-900` hero with a centred yellow block over a rotating star tear; `/` has a `min-h-svh` video hero with the logo and date stickers and no block at all.

## Primitives

Site-wide primitives live in [components/](components/); home-only pieces in [app/(site)/[locale]/\_components/](<app/(site)/[locale]/_components/>).

### `<Sticker>`

Rotated badge with bordered fill and offset shadow. Props: `color` (`yellow|brand|blue|pink|ink|paper`), `size` (`xs`–`xl`), `shape` (`rect|pill|tag`), `rotate` (deg). Use for eyebrows, date pills, callouts, footer column headings.

### `<Doodle>`

Decorative SVG shapes from the Figma Doodles frame, inlined from [doodle-svgs.ts](components/doodle-svgs.ts) so each layer can be themed. **Server-only.**

- Shapes: `eye`, `plus` (inline JSX) and `zz`, `play`, `cross`, `banner`, `sun-rays`, `star-burst`, `zzz`, `stroke`, `horns`, `coil`, `radial`, `lips`, `stripes`, `asterisk`, `flame`, `cocktail`, `star`.
- `color` is the primary paint, `accent` the secondary (back layer / outline / pupil). Both accept palette tokens (`summer-red`, `royal-yellow`, `dimmed-led`, `blue-cola`, `tardis-blue`, `pink`, `ink`, `paper`, `white`) or a gradient name (`linear-red`, `linear-sunset`, `radial-red`, `80s-gum`).
- Single-layer shapes ignore `accent`: `asterisk`, `banner`, `cocktail`, `lips`, `play`, `radial`, `star`, `stripes`, `zz`, `plus`. Duo-layer: `cross`, `sun-rays`, `horns`, `eye`. Gradient-baked (keep their Figma gradient unless you pass `color`): `coil`, `stroke`, `star-burst`, `zzz`, `flame`.
- **Always pass `color`.** Avoid `ink` and `white` for gutter doodles; use bright tokens or a gradient.
- Size with a height utility only (`h-44`, `lg:h-96`); the viewBox sets the width. Shapes aren't square.
- Re-exporting from Figma: regenerate `doodle-svgs.ts` and replace hardcoded hexes with `var(--fill-0, …)` / `var(--stroke-0, …)`.

**Scatter rule.** Doodles go in section gutters, absolutely positioned, `pointer-events-none aria-hidden`, never over copy or inside cards.

- Two or three per section, max.
- One huge anchor (`h-48` and up, `lg:h-96`+) bleeding off the section edge with negative offsets.
- One or two small accents (`h-10`–`h-16`) in a contrasting shape and colour.
- Never two doodles at the same size in one section.
- Small shapes that read well: `plus`, `cross`, `play`, `sun-rays`, `star-burst`, `zz`, `radial`, `asterisk`, `cocktail`, `star`. The rest are anchors only. Repeating a small shape is fine.
- A big anchor shape appears once per page, and don't reuse the same big shape above the fold on more than two pages.

### `<PaperTear>`

Inlines the torn-paper paths from [tear-paths.ts](components/tear-paths.ts) so `fill` is controllable. **Server-only.** Renders in-flow at `relative z-0` with a 1px bleed into the neighbouring section. Drop it as the first or last child of a section.

| tear | aspect  | use                                      |
| ---- | ------- | ---------------------------------------- |
| 1, 2 | ~9–10:1 | full-body dividers between tall sections |
| 3, 7 | ~14:1   | medium dividers                          |
| 6    | ~18:1   | medium-compact                           |
| 4, 5 | ~22:1   | most compact, over short marquees etc.   |

Pass the **adjacent** section's colour: `edge="bottom"` takes the colour of the section below, `edge="top"` the colour of the section above. Optional `bgColor` makes the tear a self-contained two-tone block.

### Server-only primitives in client trees

`<Doodle>` and `<PaperTear>` can't be imported from `'use client'` files. Render them in `page.tsx` and pass them through as `children` or a named ReactNode prop (`topTear`, `bottomTear`, …). See [/line-up/page.tsx](<app/(site)/[locale]/line-up/page.tsx>). Last resort: `<Image src="/assets/doodles/{shape}.svg">`, losing per-layer theming.

### Atmosphere

- `<HotGradient>`: `from-brand-900 via-brand-500 to-pink-400`, `absolute inset-0`. Tint via `className` (`opacity-25`, `opacity-50`).
- `<GrainOverlay>`: pre-rasterised `menu-noise.svg` tile at `mix-blend-overlay` for risograph texture.
- `<MenuBackground>`: gradient + drifting blob + optional star-burst halo + grain. Used by the menu; the hero and footer compose the same layers.
- CSS utilities: `halftone[-soft|-dense]`, `tape-strip`.

### Cards and content pieces

- `<DayCard>` / `<HeadlinerCard>`: tilted halftone image cards, `md:grid-cols-3`, `h-full flex flex-col` so mixed-length rows share a height. `<HeadlinerCard>` takes `tbaLabel` and delegates to `<TBACard>` when the name is `TBA`.
- `<TBACard>`: shared TBA placeholder (home + line-up), `size: "md" | "lg"`.
- `<FloatingPolaroid>`: polaroid with a 6s bob; `float={false}` for a static tilt. `caption` is a ReactNode so callers can pass a server-rendered `<Sticker>`.
- **Polaroid recipe** for static placements: white card, 2px black border, `shadow-sticker-lg`, ±2° tilt, inner 2px-bordered photo with `halftone opacity-30 mix-blend-multiply`, oversized bottom padding, uppercase display caption, optional `tape-strip` at a corner (needs a `relative` wrapper so the tape doesn't inherit the tilt).
- `<PhotoMarquees>`: twin shuffled photo marquees for coloured sections.
- `<TickerStrip>`: all-caps rolling marquee (`react-fast-marquee`); set `direction="right"` for the second strip of a pair.
- `<Countdown>` / `<CountdownHero>`: countdown clock; inherits `currentColor`.
- `<RevealCard>`: flip-in on viewport entry with per-`index` delay.
- `<Timeline>`: scroll-driven vertical timeline with sticky year markers (used on `/history`).
- `<ScrollBg>`: section wrapper whose background interpolates through a `colors` array as you scroll (used on `/history` and `/menu`).
- `<StrokeLoader>`: the `stroke` doodle painting itself in a loop, used by `loading.tsx`. Pure CSS.
- `<LocaleSwitcher>`: `NL FR EN` with a sliding yellow underline (`layoutId`). Only inside the menu and footer.

### `<Button>`

Variants `brand` (red), `accent` (yellow), `sky` (blue), `ink` (black / yellow text); `size="2xl"` for hero CTAs; `sticker` adds the offset shadow and lift on hover. Polymorphic via `as`; `disabled` becomes `aria-disabled` on non-button elements.

### Footer and navbar

- **Footer**: photo strip (parallax `footer.webp`, hot gradient wash, spinning star-burst, grain, three tears at the edges, sticker social buttons) over a `bg-gray-900` info section on a `lg:grid-cols-4` grid: contact (2 cols), line-up links, more-info links, all headed by `<Sticker>`s. Partners are tiered from the Sanity `tier` field: lead partners in a large-logo grid at full opacity, support partners as a smaller `opacity-60` flex-wrap. Bottom bar holds the locale switcher and copyright. No newsletter or funnel CTAs; the footer is signage.
- **Navbar**: fixed, always white text, no bar. The logo scales and fades out over the first 120px of scroll and comes back when the menu opens. A frosted circle appears behind the hamburger once scrolled. The menu is a Base UI `Dialog` over `<MenuBackground>` with two tiers: five primary poster links (`text-4xl` → `xl:text-7xl`, star bullet, CSS kinetic text-swap on hover) and a bottom band with secondary links, socials, locale switcher, and a tilted date sticker driven by `ZZ_DATE_*`. Open is a single panel fade with staggered links; close is faster with links exiting upward first. Primary nav is budgeted for five items on a 320×568 viewport.

## Section template and z-layering

Each section is `relative bg-X`. **Don't add `isolate` or `overflow-x-clip` to a section**: both stop gutter doodles from bleeding across section boundaries (horizontal clipping is handled once on `html`). Layers inside a section:

- `<PaperTear>` at `z-0`
- `<Doodle>` at `z-10` (add `absolute …` yourself)
- content wrapper at `relative z-20`

Without the explicit `z-20`, in-flow content paints below absolutely positioned doodles. If an inner block needs high z-indexes (e.g. marquee tears at `z-40`), wrap that subtree, not the section, in `relative isolate`.

## Motion

`motion/react` only; never gsap. Honour `useReducedMotion()`. Prefer CSS transitions where they suffice; reach for `motion` for orchestration (stagger, layout, scroll-driven values). All CSS keyframe utilities (`animate-doodle-*`, `animate-hero-*`, `animate-menu-blob-d`) are paused under `prefers-reduced-motion` in `globals.css`.

Existing moments, for consistency when adding new ones:

- **Hero atmosphere**: hot gradient wash, three blurred blobs on coprime 10 / 13 / 11 s loops, star-burst halo drifting inside a slow spin (two wrappers, since one element can't stack two transform animations), grain on top.
- **Header**: logo scroll-fade; frosted trigger circle fades in past 24px.
- **Menu**: panel opacity fade (0.35s, `[0.22, 0.61, 0.36, 1]`), primary links stagger 0.04s apart, secondary band lands 0.22–0.36s. Close is about a third faster.
- **Hover**: stickers and cards `hover:-translate-y-1`; menu links CSS text-swap; socials lift and rotate.
- **Layout ids**: `locale-bar` (locale switcher), `filter-pill` (line-up day filter).
- **Line-up grid**: `flip` (per-day, `rotateY -90 → 0` in shuffled order) or `deal` (all days, cards thrown from rotating corners with a spring). Day sections re-mount on filter change so it replays.
- **Home cards**: `<RevealCard>` flip on `whileInView` (`once`, `amount: 0.3`).
- **TBA card hover**: slight scale + rotation, inner star-burst swings.
- **Recap gallery**: tiles gather at the grid centre and fan out to their slots with random per-tile timing; measured via `getBoundingClientRect` and driven with motion values, no `setState` in effects.
- **Countdown**: digits roll like a flip-clock via `AnimatePresence mode="popLayout"`; colons pulse.
- **Floating polaroid**: 6s bob.
- **Brush-stroke reveal**: `animate-doodle-paint-stroke` (one-shot) and `-loop` (used by `<StrokeLoader>`) animate `stroke-dashoffset` on `svg path`.
- **History / menu background**: `<ScrollBg>` colour interpolation.
