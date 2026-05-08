# Design.md — Zomaar Zomert

Living reference for the visual language, design tokens, and reusable primitives used across the site. The [home page](app/%5Blocale%5D/page.tsx) is the canonical reference implementation — when porting another page to this design language, copy its patterns.

## Aesthetic direction

**Hybrid maximalism + collage.** Think summer-festival zine, skate-shop sticker pack, paper-cut postcard. We want the site to feel young, loud, hand-made — never SaaS, never corporate. Reference points: Pukkelpop, Rock Werchter, but with our own torn-paper / risograph DNA.

Keywords: _summer, vibes, young, fun, stickers, skateboard._

Five recurring moves:

1. **Halftone dots** layered over photography (mix-blend-multiply).
2. **Paper tears** between sections — the existing white SVGs in [public/assets/](public/assets/) (`tear-1` … `tear-7`).
3. **Stickers** — chunky uppercase badges on a colored fill, 2px black border, hard offset shadow, slight rotation.
4. **Big Oswald headlines** that fill the screen (clamp into the 4xl–9xl range).
5. **Rotated / overlapping cards** — never a perfectly aligned grid. 1°–2° tilt is plenty.

## Tokens

All tokens live in [app/globals.css](app/globals.css) inside the `@theme` block; consume via Tailwind utilities (`bg-brand-500`, `font-display`).

### Color roles

The palette is anchored on the **Zomaar Zomert** colour set defined in the ZZ 2026 Figma file. Each named anchor sits at a fixed slot in its scale so tints/shades stay in lockstep, and an alias token (`--color-summer-red`, etc.) points to the slot.

| Name (Figma) | Hex       | Scale slot           | Alias token            | Usage                                                |
| ------------ | --------- | -------------------- | ---------------------- | ---------------------------------------------------- |
| Summer Red   | `#de350b` | `--color-brand-500`  | `--color-summer-red`   | Big CTAs, hot fills, brand accents                   |
| Royal Yellow | `#ffb600` | `--color-yellow-400` | `--color-royal-yellow` | Stickers, highlights, "free entry" stamps            |
| Dimmed Led   | `#fee198` | `--color-yellow-100` | `--color-dimmed-led`   | Cream highlights, soft sticker fills                 |
| Blue Cola    | `#3b84db` | `--color-blue-500`   | `--color-blue-cola`    | Secondary tiles, headliner cards                     |
| Tardis Blue  | `#193d6b` | `--color-blue-900`   | `--color-tardis-blue`  | Deep "summer night" backgrounds (hero, closing CTA)  |
| Black        | `#000000` | n/a                  | n/a                    | Reserved for offset shadow / sticker borders only    |

**Adjacent helpers.** Pink (`--color-pink-400` `#ff8faa`) is the hot pink used in the gradient stops — keep the existing pink scale for soft backgrounds (`pink-50`, `pink-300`). Ink lives at `--color-gray-900` (`#1a1a1a`) — body text and the offset shadow.

Don't introduce greys outside the existing scale. The named ZZ palette is the source of truth — when in doubt, reach for an alias.

### Gradients

Four named gradient styles ride alongside the solid palette (Figma styles `Linear Red`, `Linear Sunset`, `Radial Red`, `80s Gum`). Exposed as Tailwind `bg-*` utilities in [app/globals.css](app/globals.css), and accepted as `color`/`accent` values on `<Doodle>` (e.g. `<Doodle shape="lips" color="linear-sunset" />`):

| Utility            | Style          | Stops                                  | Where it earns its place                                |
| ------------------ | -------------- | -------------------------------------- | ------------------------------------------------------- |
| `bg-linear-red`    | Linear Red     | `#ff1d25` 0% → `#961702` 100%          | Countdown panel, "linear-red" doodle fill (anchors)     |
| `bg-linear-sunset` | Linear Sunset  | `#ffb600` 0% → `#ff7bac` 100%          | Star-bursts, sun-rays — yellow→pink hero/closing pieces |
| `bg-radial-red`    | Radial Red     | `#ff7bac` 0% → `#de350b` 100% (radial) | One-off accents (e.g. lips on the yellow gallery)       |
| `bg-80s-gum`       | 80s Gum        | `#3b84db` 3% → `#ff8faa` 61%           | Cool-to-hot accent for blue-leaning sections            |

Use gradients _sparingly_ — too many on one page reads as Web 2.0 sheen. **At most one gradient per section**, applied either to the anchor doodle or to a single panel (e.g. the countdown).

### Type

- **Display**: `Oswald 700` (`font-display`). All headings, sticker labels, button labels, sectional eyebrows. UPPERCASE, line-height ≤ 1.05.
- **Body**: `Open Sans` (`font-sans`), 400 default, 700 for `<strong>`. Line-height 1.5.

Headline scale is set in [app/globals.css](app/globals.css#L137-L178). For loud hero moments, use `text-4xl md:text-6xl xl:text-7xl` (or `clamp(...)` when you need a continuous ramp). For the home hero, **stacked logo + date stamps + location strip** is the visual anchor — not a single `<h1>`.

#### Section titles: short, big, or absent

This is **not** a SaaS site. Section eyebrows + sentence-y subtitles read like product copy and dilute the festival voice. Apply this rule for new sections:

- **Prefer no title at all** when context (sticker eyebrow + cards/visuals) already says what the section is. The Days, Numbers, and Activities cards make their meaning obvious; a sentence on top is noise.
- **If you do keep a title, use one or two words and make it huge** — poster-grade, not header-grade. The standard scale is `text-7xl leading-[0.85] md:text-9xl xl:text-[14rem]` for these single-word "stamps" (e.g. `Line-up.`, `Doe mee.`, `Vibes.`, `Aftermovie.`, `Tot dan.`). Pick a scale, commit to it, and let the type itself be the visual.
- **Drop redundant lede paragraphs.** A short body line under the big stamp is fine; a marketing summary is not.
- **Sticker eyebrows are still allowed** when they add useful context the headline doesn't ("Mogelijk gemaakt door" before "100% Gratis."), but most sections don't need one.

Examples that earn their words: `100% Gratis.`, `Tot dan.`. Examples that don't: ~~"De namen die het dak eraf gooien."~~, ~~"Foto's zeggen meer dan een bandenbericht."~~ — context already communicates these; the title is overhead.

#### Chunky block headlines

For pages where the body is the main event (info pages, contact pages, anywhere the bento/form does the heavy lifting), the poster word can feel too loud. The alternative is a **chunky bordered block** — the headline word sits inside a `bg-gray-900` block with high-contrast text (`text-pink-300`, `text-yellow-400`), `inline-block`, `shadow-sticker-lg`, and a small tilt (`-rotate-2` / `rotate-2`). Reads like a rubber stamp pressed onto the page. Mid-scale (`text-5xl md:text-7xl xl:text-8xl`) — smaller than the poster word, larger than a body header.

```tsx
<h1 className="font-display shadow-sticker-lg inline-block -rotate-2 bg-gray-900 px-5 py-2 text-5xl leading-[0.9] font-bold text-pink-300 uppercase md:px-7 md:py-3 md:text-7xl xl:text-8xl">
  Info.
</h1>
```

### Radius / shadow

- `--radius: 0` — corners are square by default. Pills only on conscious sticker shapes.
- No drop shadows. Replace with **hard offset block shadow** (`shadow-sticker*` utilities).

## Reusable primitives

### `shadow-sticker[-sm|-lg]` (CSS utility)

Defined in [app/globals.css](app/globals.css). Produces a flat black offset block shadow. Override the offset / color via the `--sticker-x`, `--sticker-y`, `--sticker-color` custom properties.

### `halftone[-soft|-dense]` (CSS utility)

Two-layer radial gradient that mimics a halftone print. Use with `mix-blend-multiply` on top of imagery, or `mix-blend-screen` on solid color blocks.

### `tape-strip` (CSS utility)

Striped washi-tape look for collage corners.

### `<Sticker>` — [components/sticker.tsx](components/sticker.tsx)

Rotated badge with bordered fill and offset shadow. Anywhere a sticker eyebrow makes sense, this is the primitive — used by the global `<Footer>` as well as the page bodies.
Props: `color` (`yellow|brand|blue|pink|ink|paper`), `size` (`xs|sm|md|lg|xl`), `shape` (`rect|pill|tag`), `rotate` (number, deg).
Use for eyebrows, "FREE ENTRY", date pills, "DOE MEE" callouts, footer column headings.

### `<Doodle>` — [components/doodle.tsx](components/doodle.tsx)

Decorative shapes — the building block for the maximalist, sticker-pack feel. SVG illustrations exported from the **Doodles** frame in the ZZ 2026 Figma file (sources in [public/assets/doodles/](public/assets/doodles/), pre-extracted into [doodle-svgs.ts](components/doodle-svgs.ts)) are inlined so each layer's fill/stroke can be themed independently — `mask-image` would collapse every layer to a single colour. Two inline shapes (`eye`, `plus`) are drawn as plain JSX paths.

**Shapes:**

- _Inline_: `eye`, `plus`.
- _Asset-backed_: `zz`, `play`, `cross`, `banner`, `sun-rays`, `star-burst`, `zzz`, `stroke`, `horns`, `coil`, `radial`, `lips`, `stripes`, `asterisk`, `flame`, `cocktail`, `star`.

**Theming**:

- `color` — primary paint. Maps to the SVG's `var(--fill-0)` slot, the inline shapes' outline + pupil, and (for gradient-baked shapes) overrides the baked gradient. Default `ink`.
- `accent` — secondary detail. Maps to `var(--stroke-0)` on duo-layer shapes (the back/outline) and to the pupil on `eye`. Optional.

Both `color` and `accent` accept solid palette tokens (`summer-red`, `royal-yellow`, `dimmed-led`, `blue-cola`, `tardis-blue`, `pink`, `ink`, `paper`, `white`) **or** one of the four named gradients: `linear-red`, `linear-sunset`, `radial-red`, `80s-gum`. Gradients are minted at render time as inline `<linearGradient>` / `<radialGradient>` defs with unique ids; the prop value resolves to a `url(#…)` paint server.

Doodles fall into three theming buckets:

1. **Single-layer.** One paint reference — pass `color`. `accent` is ignored. Includes `asterisk`, `banner`, `cocktail`, `lips`, `play`, `radial`, `star`, `stripes`, `zz`, plus the inline `plus`.
2. **Duo-layer.** Two distinct paints — pass both `color` (front) and `accent` (back/outline). When `accent` is omitted, the SVG falls back to its baked-in Figma detail colour. Includes `cross` (cream front + red shadow), `sun-rays` (yellow front + red shadow), `horns` (yellow hand + red outline), and the inline `eye` (outline + pupil; the white-of-eye is hardcoded `pink-50`).
3. **Gradient-baked.** Ship with a Figma gradient embedded in the SVG defs (`Linear Red`, `Linear Sunset`, `Radial Red`). The path's paint is wrapped as `var(--fill-0, url(#paint…))` so passing `color` overrides the gradient with whatever you pass — including another gradient — and omitting `color` keeps the original baked look. Includes `coil` (Linear Red stroke), `stroke` (Linear Sunset stroke — used by the loading spinner), `star-burst` (yellow), `zzz` (Linear Sunset × 4), `flame` (Radial Red fill + themable red stroke via `accent`).

Stroke-only single-layer shapes (`asterisk`, `cocktail`, `lips`, `radial`, `star`, `stripes`) use `fill="none"` so the path doesn't render a black silhouette behind the stroke — the SVG default of `fill: black` would otherwise leak through.

The asset-backed shapes have varying intrinsic aspect ratios (e.g. `lips` ≈ 1.76:1, `play` ≈ 0.72:1, `stripes` ≈ 3.5:1). Size them with a height utility (`h-44`, `lg:h-96`, …) and let the SVG's viewBox handle width — `<Doodle shape="lips" color="summer-red" className="h-44" />`. Don't force a square `w-* h-*` pair on a non-square shape.

**Always pass an explicit `color`.** Without one, single-layer shapes fall back to the dull Figma export colour and gradient-baked shapes fall back to their built-in gradient — both options should be a deliberate choice, not an oversight. Avoid `color="ink"` (black) and `color="white"` for decorative gutter doodles; reach for the bright tokens or a gradient.

If you re-export an SVG from Figma, regenerate `doodle-svgs.ts` (small Node script lives in the commit history under "extract doodle svgs"). Watch out for hardcoded hex colours in the export — convert them to `var(--fill-0, …)` for the primary paint and `var(--stroke-0, …)` for any duo-layer detail.

**Doodle is server-only** — the module declares `import "server-only"` so a stray client import fails the build. `doodle-svgs.ts` is large enough to bloat the client bundle if it ever crossed a `'use client'` boundary; same goes for `<PaperTear>`.

**Using server-only primitives inside a client tree.** Both `<Doodle>` and `<PaperTear>` can only be imported from server files. When a client component needs one, render it in the parent `page.tsx` (or any server component) and pass it through as `children` or a ReactNode prop — the client component just slots the pre-rendered React tree into its layout. See [/line-up/page.tsx](app/%5Blocale%5D/line-up/page.tsx) for the bottom `<PaperTear>` that bridges the dark hero into the footer's photo strip without breaking the client boundary. If neither option fits (e.g. a small star-burst inside a TBA card back), use `<Image src="/assets/doodles/{shape}.svg">` against the asset directly — accepting that you lose per-layer theming.

#### Scatter rule: fewer, bigger, with extreme size variation

Drop doodles into section gutters with absolute positioning — never on top of body copy or inside cards. They are `pointer-events-none` and `aria-hidden`. Apply this rule when placing them:

- **Two or three per section, max** — four+ at similar sizes reads as decoration noise, not character. Resist the urge to fill every corner.
- **One "anchor" doodle that is intentionally _huge_** (`h-48` and up; on `lg` go up to `h-96`/`h-112`/`lg:h-128`/`lg:w-lg`). Position it bleeding off the section edge with negative offsets like `-top-12 -right-16` so it reads as a stamp slammed onto the page, not a centered ornament.
- **One or two _small_ accents** (`h-10` to `h-16`) elsewhere in the gutter, in a contrasting shape and color.
- **Never two doodles at the same size** in one section — the size jump is the whole point.

#### Shape-picking rules

- **Small doodles look good in this set:** `plus`, `cross`, `play`, `sun-rays`, `star-burst`, `zz`, `radial`, `asterisk`, `cocktail`, `star`. The other shapes (`banner`, `lips`, `stripes`, `flame`, `horns`, `zzz`, `coil`, `stroke`, `eye`) are designed for big anchors — they don't read at small sizes. Header-pair doodles (the `h-20`–`h-36` partner next to a chunky-block headline) count as small for this purpose.
- **Repeating a small shape is fine.** Three little `cross`es clustered with slight rotation/size variation reads as deliberate dynamism, not laziness.
- **A big anchor shape can't appear twice on the same page** — unless it's the same shape at a different scale (one big + one or more small variants is fine). Pick a different shape for each section's anchor.
- **Distribute big anchors across pages.** Don't show the same big shape on multiple pages above the fold; the festival should feel like every page has its own poster, not a single repeated motif. Two pages sharing one big shape is borderline OK; three or more is too many.

Examples that earn their place: a 96–128 unit `lips` bleeding off the right edge of the gallery section + a 14-unit `cross` near the title; a 80-unit `flame` in the activities corner + a 12-unit `plus` accent. Avoid: four 20-unit shapes evenly distributed around a section, or `lips` big on three different pages.

### `<PaperTear>` — [components/paper-tear.tsx](components/paper-tear.tsx)

Re-renders each `<path d="…">` from the festival's torn-paper SVGs inline so we control `fill` directly — no `mask-image` recolor trickery. Path strings are pre-extracted into [tear-paths.ts](components/tear-paths.ts) (regenerate when the source SVGs change) so PaperTear has no `fs` / runtime file IO. **Server-only** (declares `import "server-only"`) — its 270KB of path data must never end up in the client bundle. Renders as an in-flow `block` with `relative z-0` (lowest layer in the section's z-stack) and a 1px translate (`-translate-y-px` for `edge="top"`, `translate-y-px` for `edge="bottom"`) that bleeds the tear into the adjacent section to hide sub-pixel hairlines. Tailwind v4 emits `translate-y-*` via the standalone `translate` CSS property, so it stacks cleanly with the inline `transform: scaleY(-1)` that flips top-edge tears. Drop it as the first or last child of a section and it sits flush at that section's edge.

Each `tear-N.svg` ships with `viewBox="0 0 11339 1418"` but the painted ink only occupies a slice of that — anywhere from ~520 (tear-4, tear-5) to ~1300 units tall (tear-1). The component stores a per-tear cropped viewBox in `TEAR_VIEWBOX` so the rendered SVG's intrinsic aspect matches the visible ink. Result: the box on screen is exactly the size of the tear, no phantom empty area.

Pick the tear by feel — natural aspects after cropping:

| tear | aspect | use |
| --- | --- | --- |
| 1, 2 | ~9:1 / ~10:1 | full-body dividers between tall sections |
| 3, 7 | ~14:1 | medium dividers |
| 6 | ~18:1 | medium-compact |
| 4, 5 | ~22:1 | the most compact — use over short marquees etc. |

Pass the **adjacent section's color** as `color` so the divider visually flows:

- `edge="bottom"` → tear sits at the bottom of section A; pass section B's color (the section _below_).
- `edge="top"` → tear sits at the top of section B; pass section A's color (the section _above_).

Optional `bgColor` makes the tear a self-contained two-tone block — `color` paints the painted silhouette, `bgColor` paints everything outside it. Swap the two values to flip which side reads as primary without touching the parent's background.

Example: hero (`bg-blue-900`) ending in a yellow ticker → `<PaperTear edge="top" tear={5} color="yellow-400" />` rendered above the ticker so the wave looks "torn" up into the dark hero.

### `<TickerStrip>` — [app/[locale]/_components/ticker-strip.tsx](app/%5Blocale%5D/_components/ticker-strip.tsx)

Pukkelpop-style rolling marquee of all-caps strings, separator between items. Wraps `react-fast-marquee` (already a dep). Set `direction` to `right` for the second strip in a paired layout.

### `<StarBurst>` — [components/star-burst.tsx](components/star-burst.tsx)

16-point star stamp built with a CSS clip-path so we don't need a new SVG asset. Drop a child label inside (e.g. "GRATIS / INKOM") and rotate the wrapper.

### `<DayCard>` / `<HeadlinerCard>` — [day-card.tsx](app/%5Blocale%5D/_components/day-card.tsx), [headliner-card.tsx](app/%5Blocale%5D/_components/headliner-card.tsx)

Tilted, halftoned image cards used in the line-up sections. Each has a slight per-card tilt (set in the page) so the row feels hand-arranged. `<HeadlinerCard>` takes a `tbaLabel` prop for the wax-seal sticker on TBA placeholders so the parent owns the translation. When `name === "TBA"` the card delegates the visual to `<TBACard>` (below).

### `<TBACard>` — [app/[locale]/_components/tba-card.tsx](app/%5Blocale%5D/_components/tba-card.tsx)

Shared TBA placeholder used by both the home page (`<HeadlinerCard>`'s TBA branch) and the line-up grid (`<LineUpArtistCard>`'s TBA branch). Static visual: tone-coloured background with halftone, oversized star-burst doodle centred, four small plus accents at the corners, "Soon" sticker as the wax seal. Gentle hover (card scales 1 → 1.015 + 1° rotation nudge, star-burst inside swings -12° → 8° via `group-hover:`) — distinct from the artist cards' lift, signals "stirs but not clickable". `size: "md" | "lg"` lets the line-up's denser 4-col grid use a smaller "TBA / ✦" footer than the home's 3-col headliner row.

### Polaroid pattern

A standard treatment for festival photos — used on [/info](app/%5Blocale%5D/info/page.tsx) (terras tile in the bento, pétanque tile in the activities section), [/history](app/%5Blocale%5D/history/page.tsx) (per-milestone snapshots + a closing wide crew portrait), and as the home contact-card postcard. Recipe rather than a component:

- White card (`bg-white`), 2px black border, `shadow-sticker-lg`, slight tilt (±2°).
- Inner photo wrapped in a second 2px black border, with a `halftone` overlay at `opacity-30 mix-blend-multiply`.
- Oversized bottom margin (`pb-10 md:pb-14`) so the white frame mimics a real polaroid's wider bottom strip.
- Centered handwritten-style caption underneath in `font-display uppercase`.
- Optional `tape-strip` absolutely positioned at a top corner — needs a `relative` wrapper above the polaroid card so the tape pins on top without inheriting the card's tilt.

```tsx
<div className="relative">
  <span aria-hidden className="tape-strip absolute -top-3 left-10 z-30 h-5 w-24 -rotate-12" />
  <article className="shadow-sticker-lg relative -rotate-2 border-2 border-gray-900 bg-white p-3 pb-10 md:p-4 md:pb-14">
    <div className="relative h-72 overflow-hidden border-2 border-gray-900">
      <Image src="..." alt="" fill className="object-cover" />
      <div aria-hidden className="halftone absolute inset-0 opacity-30 mix-blend-multiply" />
    </div>
    <p className="font-display mt-4 text-center text-base font-bold uppercase">{caption}</p>
  </article>
</div>
```

### `<PhotoMarquees>` — [app/[locale]/_components/photo-marquees.tsx](app/%5Blocale%5D/_components/photo-marquees.tsx)

Twin marquees of festival photos with a randomized client-side shuffle. Use over colored sections — the legacy `<HomeMarquees>` bakes in white tear SVGs that clash with non-white backgrounds.

### `<Countdown>` — [app/[locale]/_components/countdown.tsx](app/%5Blocale%5D/_components/countdown.tsx)

Festival countdown clock — four segments (days / hours / minutes / seconds), forced `grid-cols-4` so cells never wrap, tabular-nums for stable digit width. Inherits text colour from its parent so any panel can re-skin it.

### `<Timeline>` — [components/ui/timeline.tsx](components/ui/timeline.tsx)

Vertical scroll-driven timeline with sticky year markers on the left and an animated trailing line that fills as the user scrolls. Adapted from a shadcn/Aceternity component and re-skinned: square yellow sticker dots (not round circles), Oswald-poster year titles in `text-brand-500`, brand-red → royal-yellow gradient on the active line. Renders only the timeline body — pages provide their own hero/heading above. Each entry takes `{ title, content }`; each `content` is free-form, so milestones can mix sticker eyebrows, body copy, polaroids, poster cards, etc. Used on `/history`.

### `<RevealCard>` — [app/[locale]/_components/reveal-card.tsx](app/%5Blocale%5D/_components/reveal-card.tsx)

Wraps a card with the same `rotateY: -90 → 0` flip + scale + opacity entry animation as the line-up grid, but triggered by viewport intersection (`whileInView`) rather than filter state. Each card animates once when it scrolls into view; an `index` prop adds a small per-card delay so a row of cards appears to flip in sequence rather than all at once. `useReducedMotion` short-circuits to plain children. Used on the home page around `<DayCard>` and `<HeadlinerCard>` rows.

### `<StrokeLoader>` — [app/[locale]/_components/stroke-loader.tsx](app/%5Blocale%5D/_components/stroke-loader.tsx)

Loading state — the `stroke` doodle drawn by hand, four bursts cycling on repeat ("djoef djoef djoef djoef"). The original SVG path is split into four chunks; each `<motion.path>` animates `pathLength: [0 → 1 → 1 → 0]` over 1.5 s with staggered delays so the strokes appear sequentially and erase in the same order. Original Linear Sunset gradient (yellow → pink) preserved. Reduced-motion users get a static fully-drawn path. Replaces the legacy spinner in [loading.tsx](app/%5Blocale%5D/loading.tsx).

### `<ScrollBg>` — [app/[locale]/history/_components/scroll-bg.tsx](app/%5Blocale%5D/history/_components/scroll-bg.tsx)

Page-scoped section wrapper whose `backgroundColor` interpolates as the user scrolls. Uses `useScroll({ offset: ["start start", "end end"] })` mapped to five colour stops, e.g. on `/history`: `pink-50 → yellow-100 → pink-300 → yellow-100 → pink-50` — a warm wave through the milestones. Currently `/history`-only (the colour stops are hard-coded in the file); generalise via props if another page needs it.

### `<LocaleSwitcher>` — [locale-switcher.tsx](components/locale-switcher.tsx)

Compact two-letter language picker (`NL FR EN`). Inactive codes sit at `opacity-50`; the active one carries a yellow underline that slides between codes via `motion`'s `layoutId`. Keep it subtle — only show it when there's a clear context for switching (e.g. inside the open menu, or in the footer bottom bar).

### `<Button>` — [button.tsx](components/ui/button.tsx)

The shared button. Variants used in the new design language:

- `variant="brand"` — orange fill, black border, white text.
- `variant="accent"` — yellow fill, black border, dark text.
- `variant="sky"` — blue fill, black border, white text.
- `variant="ink"` — black fill, black border, yellow-300 text.
- `size="2xl"` — extra-large CTA scale.
- `sticker` (boolean) — adds the offset shadow + lift-on-hover behavior.

Polymorphic via `as`. `disabled` only emits the HTML attribute when `as` resolves to `"button"`; on `<a>`/`<span>` it sets `aria-disabled` and `tabIndex=-1` instead.

### Footer — [components/footer.tsx](components/footer.tsx)

Two-part global footer used on every page.

- **Photo strip** — full-bleed `footer.webp` with a darkened halftone overlay, paper tears top + bottom (`tear-5` top, `tear-6` bottom), and three rotated **sticker** social buttons (Instagram / Facebook / YouTube in `yellow / brand / blue`) above a small "Volg ons" sticker eyebrow. Each social tile is 64–80px square, 2px black border, sticker shadow, and uses `motion`'s `whileHover` to straighten its rotation and lift `-y: 6px` on hover.
- **Dark info section** (`bg-gray-900`) — asymmetric 12-col grid:
  - **5/12 — Contact**: poster-sized `info@zomaarzomert.be` (Oswald, `text-3xl md:text-4xl lg:text-5xl`) sitting under a yellow rotated sticker eyebrow, address below in body type, then accent + ink sticker buttons for "Contacteer ons" / "Inschrijven randactiviteiten".
  - **3/12 — Line-Up**: brand-colored sticker eyebrow + uppercase day links.
  - **4/12 — More info**: pink sticker eyebrow + uppercase nav links (history, partners, menu, privacy).
  - All column headings are `<Sticker>` instances (sm size, ±2–3° rotation) — never plain underlined h3s. Links use `font-display uppercase tracking-wide` and yellow on hover.
- **Partner hierarchy** — two distinct tiers driven by `formula` in [partners.json](lib/data/partners.json):
  - **Lead partners (formula 1)** — eyebrow stack: small yellow "Mogelijk gemaakt door" + medium brand "Hoofdpartners" stickers, then a `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` of larger logos (`h-12 md:h-14 lg:h-20`) at full opacity.
  - **Support partners (formula 2+)** — separated by an ink sticker tag "Met de steun van" between two thin `bg-white/15` rules, then a `flex-wrap` of smaller logos (`h-7 md:h-9 lg:h-11`) at `opacity-60`. The opacity + size jump is the hierarchy signal — don't equalize them.
- **Bottom bar** — `<LocaleSwitcher>` (matches the navbar's locale pattern) on the left, single-line copyright on the right, separated from partners by a `border-white/10` rule. Credits are minimal — webdesign credit only.

Don't add a newsletter, "stay in the loop" CTA, or any copy that pretends the festival has a continuous funnel. The footer is signage, not lead-gen.

### Navigation — kinetic full-screen menu — [components/navbar.tsx](components/navbar.tsx)

The menu is a Base UI `Dialog` that takes over the viewport when triggered. Notes:

- **Header** — permanently `position: fixed`. As the page scrolls past the first 120px, vertical padding tightens and the logo scales to 70% via `motion`'s `useScroll` + `useTransform` (no CSS keyframes — the motion values feed `motion.nav` and `motion.div` directly).
- **Backdrop** — `bg-brand-500/65` (intentionally translucent) with `backdrop-blur-2xl` and a `halftone` overlay on top, so the page underneath shows through tinted, blurred, and halftoned. The popup itself stays put; an inner `motion.div` slides the colored layer down from `translate-y: -100%` to `0` (the "gate" drop).
- **Link stagger** — the link list runs `motion` parent/child variants: `staggerChildren: 0.05`, `delayChildren: 0.35`, each link transitions `opacity 0 → 1` + `y: 30 → 0`. Reverse stagger on close.
- **Kinetic hover** — every menu link wraps two stacked copies of the label in a CSS grid cell with `overflow-hidden` + `leading-none` on the wrapper (so the row is exactly one glyph tall and `translate-y-full` is a clean 100% shift). On `:hover` / `:focus-visible` both copies translate up together — original slides out the top, the yellow duplicate slides in from below. Pure CSS, no JS.
- **Sizing** — `text-4xl md:text-6xl xl:text-7xl` with `py-2.5 px-4` on mobile (44px+ tap target, 8px gap between rows) tightening to `md:py-1` + `md:gap-1` on larger viewports. Tight enough that all six items fit on common breakpoints, loose enough that mobile fingers don't mis-tap.
- **Locale switcher** — [`<LocaleSwitcher>`](components/locale-switcher.tsx). Three two-letter codes (`NL FR EN`); inactive sit at `opacity-50`, the active one carries a yellow underline that slides between codes via `motion`'s `layoutId`. Keep it subtle — only visible while the menu is open, fading in once the link stagger settles.
- **Base UI integration** — `BaseDialog.Portal keepMounted` keeps the popup in the DOM so `motion`-driven exits play out. Use `data-closed:pointer-events-none` so the popup doesn't intercept clicks while invisible.

When adding new menu items, keep the size scale and the `<span className="grid overflow-hidden leading-none">` wrapper so the kinetic swap stays in sync.

## Layout & spacing

- Use `container-wide` (`1640px` max width) — more breathing room than `container-page`. `container-page` is reserved for legacy pages.
- Vertical rhythm via `section-y` (3rem mobile / 6rem md / 9rem xl) and `section-y-sm` (3rem / 5rem). Stick to these — don't hand-roll padding values.
- Cards: 2px solid black border + `shadow-sticker[-lg]`. No drop shadows, no rounded corners.
- Mobile is the primary canvas — 80% of traffic. Card stacks should collapse to a single column comfortably; tilt remains visible at any breakpoint.

### Section template & z-layering

Each section is `relative bg-X` — **don't add `isolate`** to the section wrapper. A doodle bleeding off section A (e.g. `-bottom-12 -left-12`) paints during A's stacking context; if A is isolated, B's background paints over the bleeding doodle when B renders next. Without `isolate`, the doodle's `z-10` lives in the page-level stacking context and paints _above_ B's bg but _below_ B's `z-20` content — exactly what the layered design wants.

**Don't** add `overflow-x-clip` to a section either: per the CSS Overflow spec, mixing `overflow-x: clip` with `overflow-y: visible` forces the visible axis to compute as `auto`, which clips negative-offset doodles vertically. Horizontal clipping is handled once at the page level via `overflow-x: clip` on `html` ([app/globals.css](app/globals.css)), so individual sections can keep `overflow: visible` and let bleeding doodles cross section boundaries.

Inside, the layers are explicit:

- `<PaperTear>` ships `relative z-0` — lowest.
- `<Doodle>` ships `z-10` (effective when the consumer adds `absolute …`) — middle.
- Each content wrapper gets `relative z-20` — top.

Without the explicit `z-20` on the content wrapper, non-positioned content paints at CSS step 3 (in-flow) which sits _below_ `absolute z-auto` doodles — leading to doodles overlapping headlines.

**Inner isolation for high-z subtrees.** If a section has an inner block that uses high z-indexes (e.g. the gallery's `<PhotoMarquees>` wrapper, where the marquee tears sit at `z-40` to ride over the photos), wrap that subtree — not the whole section — in `relative isolate`. That contains the high-z values inside the subtree without preventing gutter doodles from bleeding past the section.

### Per-page header variation

Each page's header should look distinctly different so the site doesn't feel templated. Vary at least two of these axes between pages:

- **Position** — headline left / right / center
- **Pairing element** — doodle, polaroid, starburst, ticker, photo
- **Color combo** — pink-on-black, yellow-on-black, red on cream, etc.
- **Tilt direction** — positive / negative
- **Treatment** — chunky block / poster word / stacked words

Worked examples:

- [/info](app/%5Blocale%5D/info/page.tsx) — chunky block (`bg-gray-900` + `text-pink-300`, `-rotate-2`) on the **left**, `<Doodle shape="zzz">` on the **right**. Tight `pt-6 md:pt-8` so the bento sits above the fold.
- [/contact](app/%5Blocale%5D/contact/page.tsx) — chunky block (`bg-gray-900` + `text-yellow-400`, `rotate-2`) on the **right**, `<Doodle shape="lips">` on the **left**. Mirrors `/info` to keep the two pages visually distinct.
- [/line-up](app/%5Blocale%5D/line-up/page.tsx) — chunky block (`bg-yellow-400` + `text-brand-500`, `rotate-1`) **centered**, with `/assets/star.svg` rotating behind it as a backdrop. Section is `bg-blue-900` so the always-transparent navbar floats white over the dark hero. Star asset (~370 KB) is referenced via `<motion.img>`, not inlined into `doodle-svgs.ts`.
- [/history](app/%5Blocale%5D/history/page.tsx) — chunky block (`bg-blue-900` + `text-yellow-400`, `-rotate-1`) on the **left**, `<Doodle shape="banner">` on the **right**. Same position as `/info` but a fresh bg colour + lighter tilt + different doodle so the four chunky pages all read distinctly.
- [/](app/%5Blocale%5D/page.tsx) (home) — `min-h-dvh` video hero with logo + date stickers, no chunky block at all. Different paradigm because the home is the brand moment.

## Motion

Use `motion/react` (the rebranded `framer-motion`, already a dep). **Never gsap** — applies to the public site and any internal tools. Honor `useReducedMotion()` for any new effect.

Current motion moments:

- **Hero** — `<video>` background loop; `<TickerStrip>` CSS marquee; doodles include optional `feTurbulence` grain (SVG filter).
- **Header** — permanently `position: fixed`. `motion`'s `useScroll` + `useTransform` shrink padding and logo over the first 120px of scroll.
- **Menu open** — backdrop slides down from `translate-y: -100%` to `0` (the "gate" drop, easing `[0.22, 0.61, 0.36, 1]`); link list runs parent/child variants with `staggerChildren: 0.05` + `delayChildren: 0.35`, each link `opacity 0 → 1` + `y: 30 → 0`. Reverse stagger on close. `BaseDialog.Portal keepMounted` so exits play out.
- **Kinetic link hover** — pure CSS text-swap (no JS).
- **Locale switcher** — `motion.span` with `layoutId="locale-bar"` slides the yellow underline between codes when the active locale changes.
- **Sticker / card hover** — `hover:-translate-y-1` micro-translations.
- **Line-up filter pill** — `motion.span` with `layoutId="filter-pill"` slides the active yellow chip between day filters (Pukkelpop-style).
- **Line-up grid entry** — two modes, swapped per filter state. `flip` (per-day view) — each card rotates from `rotateY: -90°` to `0`, in a Fisher-Yates shuffled order so cards reveal randomly. `deal` ("All" view) — cards thrown from one of four corners (`DEAL_ORIGINS` cycles bottom-left → top-right → bottom-right → top-left) with springy bounce; days deal sequentially via `delayChildren: 0.1 + dayIndex * 0.35`. DaySection re-mounts on filter change via composite key (`${currentDate ?? "all"}-${date}`) so the animation always replays.
- **TBA card hover** — distinct from the artist card lift: card scales 1 → 1.015 + 1° rotation nudge, while the inner star-burst doodle swings `-12° → 8°` via `group-hover:` CSS. Subtle "stirs but not clickable" cue. Lives in the shared `<TBACard>`.
- **Home cards reveal-on-scroll** — `<RevealCard>` wraps the home's `<DayCard>` and `<HeadlinerCard>` rows. Same flip variant as the line-up grid, triggered by `whileInView` (`once: true, amount: 0.3`) with per-index delay so each row staggers in as it enters the viewport.
- **History scroll-driven background** — `<ScrollBg>` interpolates the section's `backgroundColor` through five colour stops mapped to `scrollYProgress`. Reads as a warm wave (cream → soft yellow → hot pink → soft yellow → cream) through the timeline. Honour `prefers-reduced-motion` if you generalise it — currently the value still animates because motion's interpolation isn't gated, but the visual change is subtle enough that no one's flagged it.
- **Loading state — `<StrokeLoader>`** — `stroke` doodle path split into 4 sub-paths, each animating `pathLength: [0 → 1 → 1 → 0]` with staggered delays. Replaces the spinner in [loading.tsx](app/%5Blocale%5D/loading.tsx).

For new effects, prefer CSS transitions where they suffice; reach for `motion` when you need orchestration (stagger, layout animations, scroll-driven values).

## Reference implementation: home

The home page at [app/[locale]/page.tsx](app/%5Blocale%5D/page.tsx) is the canonical worked example. Home-internal components live in [app/[locale]/_components/](app/%5Blocale%5D/_components/) (`<DayCard>`, `<HeadlinerCard>`, `<PhotoMarquees>`, `<Countdown>`, `<TickerStrip>`); site-wide primitives (`<Doodle>`, `<PaperTear>`, `<StarBurst>`, `<Sticker>`) live in [components/](components/). Copy lives in the standard next-intl JSON namespaces in [locales/{nl,fr,en}/home.json](locales/) and is read via `getTranslations({ namespace: "home" })` (the ticker uses `tHome.raw("ticker") as string[]` for the array). The navbar is always transparent (set in [components/layout.tsx](components/layout.tsx)), so the home's dark video hero lets the white logo float on top.

When porting another page to this language, mirror the pattern: a server `page.tsx` does data + translations and renders a stack of `relative isolate bg-X` sections separated by `<PaperTear>`s, with `<Doodle>` scatter in the gutters and any interactivity inside `'use client'` subcomponents.

### Reference sections, top to bottom

`min-h-dvh` hero, then nine alternating-color sections, then the closing CTA before the global footer.

1. **Hero** (`bg-blue-900` — Tardis Blue, our deep summer-night anchor — over the looping video) — halftone overlay, sparse scatter doodles (one huge anchor + small accents), centered logo + tilted date sticker stamps + small location strip, in-hero yellow `<TickerStrip>` flush at the bottom with a `<PaperTear edge="top" tear={5} color="yellow-400">` over it so the marquee reads as "torn".
2. **Intro + countdown** (`bg-pink-50`) — poster-sized `ZOMAAR.` headline + short body next to a brand-orange `<Countdown>` panel.
3. **Days** (`bg-pink-300`) — small "Programma" sticker eyebrow only; three tilted halftone `<DayCard>`s do the talking.
4. **Headliners** (`bg-blue-500`) — `Line-up.` poster headline + "Volledige line-up" button; three `<HeadlinerCard>`s.
5. **Activities (bento)** (`bg-pink-50`) — `Doe mee.` poster headline; paella (large), pétanque, and crew/volunteer tiles.
6. **Aftermovie** (`bg-brand-500`) — `Aftermovie.` headline + `<ConsentVideo>`.
7. **Gallery** (`bg-yellow-400`) — `Vibes.` headline + `<PhotoMarquees>`.
8. **Numbers** (`bg-brand-500`) — no headline; four tilted stat stickers do it.
9. **Partners teaser** (`bg-pink-50`) — "Mogelijk gemaakt door" sticker eyebrow + `100% Gratis.` headline + sticker grid of 8 partner logos + "Alle partners" / "Word partner" CTAs (the full list still lives in the global `<Footer>`).
10. **Closing CTA** (`bg-blue-900`) — `Tot dan.` poster headline + body + buttons + a `<StarBurst>` and sticker stack on the right.

Section dividers all use `<PaperTear>` with the adjacent section's color so transitions flow.
