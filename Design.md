# Design.md — Zomaar Zomert

Living reference for the visual language, design tokens, and reusable primitives used across the site. Applies to the production pages and to the in-progress redesign at [/redesign](app/%5Blocale%5D/redesign/page.tsx).

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

| Role          | Token                 | Hex       | Usage                                                     |
| ------------- | --------------------- | --------- | --------------------------------------------------------- |
| Primary       | `--color-brand-500`   | `#de350b` | Big CTAs, headline accents, hot fills                     |
| Accent        | `--color-yellow-400`  | `#ffb600` | Stickers, highlights, "free entry" stamps                 |
| Cool          | `--color-blue-500`    | `#3b84db` | Secondary tiles, headliner cards                          |
| Soft          | `--color-pink-300/50` | —         | Background washes, soft frames                            |
| Ink           | `--color-gray-900`    | `#1a1a1a` | Body text, sticker borders, hard offset shadow            |
| Paper (page)  | `--color-pink-50`     | `#fff1f7` | Default body background — _never_ pure white              |

Don't introduce greys outside the existing scale. Black is reserved for **borders, type, and the offset shadow** — never as a fill behind body content.

### Type

- **Display**: `Oswald 700` (`font-display`). All headings, sticker labels, button labels, sectional eyebrows. UPPERCASE, line-height ≤ 1.05.
- **Body**: `Open Sans` (`font-sans`), 400 default, 700 for `<strong>`. Line-height 1.5.

Headline scale is set in [app/globals.css](app/globals.css#L137-L178). For loud hero moments, use `text-4xl md:text-6xl xl:text-7xl` (or `clamp(...)` when you need a continuous ramp). The redesign uses **stacked logo + headline + date triangle** as the visual anchor, not a single `<h1>`.

#### Section titles: short, big, or absent

This is **not** a SaaS site. Section eyebrows + sentence-y subtitles read like product copy and dilute the festival voice. Apply this rule for new sections:

- **Prefer no title at all** when context (sticker eyebrow + cards/visuals) already says what the section is. The Days, Numbers, and Activities cards make their meaning obvious; a sentence on top is noise.
- **If you do keep a title, use one or two words and make it huge** — poster-grade, not header-grade. The redesign uses `text-7xl leading-[0.85] md:text-9xl xl:text-[14rem]` for these single-word "stamps" (e.g. `Line-up.`, `Doe mee.`, `Vibes.`, `Aftermovie.`, `Tot dan.`). Pick a scale, commit to it, and let the type itself be the visual.
- **Drop redundant lede paragraphs.** A short body line under the big stamp is fine; a marketing summary is not.
- **Sticker eyebrows are still allowed** when they add useful context the headline doesn't ("Mogelijk gemaakt door" before "100% Gratis."), but most sections don't need one.

Examples that earn their words: `100% Gratis.`, `Tot dan.`. Examples that don't: ~~"De namen die het dak eraf gooien."~~, ~~"Foto's zeggen meer dan een bandenbericht."~~ — context already communicates these; the title is overhead.

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

### `<Sticker>` — [app/[locale]/redesign/_components/sticker.tsx](app/%5Blocale%5D/redesign/_components/sticker.tsx)

Rotated badge with bordered fill and offset shadow.
Props: `color` (`yellow|brand|blue|pink|ink|paper`), `size` (`xs|sm|md|lg|xl`), `shape` (`rect|pill|tag`), `rotate` (number, deg).
Use for eyebrows, "FREE ENTRY", date pills, "DOE MEE" callouts.

### `<Doodle>` — [app/[locale]/redesign/_components/doodle.tsx](app/%5Blocale%5D/redesign/_components/doodle.tsx)

Tiny inline-SVG decorative shapes — the building block for the maximalist, sticker-pack feel.

**Single-color shapes (24):** `dot`, `donut`, `ring`, `plus`, `cross`, `squiggle`, `wave`, `asterisk`, `blob`, `eye`, `star4`, `star8`, `diamond`, `triangle`, `halftone`, `bars`, `burst`, `spiral`, `lightning`, `flame`, `arrow`, `peace`, `note`, `radio-waves`.

**Multi-color shapes (use both `color` + `accent`):** `halftone-circle`, `halftone-blob`, `halftone-star`, `split-circle`, `concentric`, `eye-iris`, `sun-rays`, `wave-pair`, `striped-rect`, `striped-circle`, `burst-dot`, `flower`, `smile`, `checkered`, `tag`.

Add `grain` for risograph-style fractal noise (uses `<feTurbulence>` scoped to the SVG instance). Size doodles with Tailwind `w-*`/`h-*` utilities on `className` — the inline width/height attrs are overridden by CSS.

#### Scatter rule: fewer, bigger, with extreme size variation

Drop doodles into section gutters with absolute positioning — never on top of body copy or inside cards. They are `pointer-events-none` and `aria-hidden`. Apply this rule when placing them:

- **Two or three per section, max** — four+ at similar sizes reads as decoration noise, not character. Resist the urge to fill every corner.
- **One "anchor" doodle that is intentionally _huge_** (`h-48` and up; on `lg` go up to `h-96`/`h-112`/`lg:h-128`/`lg:w-lg`). Position it bleeding off the section edge with negative offsets like `-top-12 -right-16` so it reads as a stamp slammed onto the page, not a centered ornament.
- **One or two _small_ accents** (`h-10` to `h-16`) elsewhere in the gutter, in a contrasting shape and color.
- **Never two doodles at the same size** in one section — the size jump is the whole point.

Examples that earn their place: a 96–128 unit `halftone-star` bleeding off the right edge of the headliner section + a 14-unit `note` near the title; a 80-unit `flame` in the activities corner + a 12-unit `spiral` accent. Avoid: four 20-unit shapes evenly distributed around a section.

### `<PaperTear>` — [app/[locale]/redesign/_components/paper-tear.tsx](app/%5Blocale%5D/redesign/_components/paper-tear.tsx)

Reads the festival's torn-paper SVGs at module load (`fs.readFileSync`) and re-renders each path inline as `<svg><path fill={color}>…</svg>` — that's how we recolor on the fly without touching the source files. Each tear file ships only the wave silhouettes and stops at ~y=1000 of a 1418 viewBox, so the component also draws a backing `<rect>` from y=420 down to keep the divider opaque all the way to its bottom edge. The parent must be `position: relative` and **clip overflow** (`overflow-hidden`).

Pass the **adjacent section's color** as `color` so the tear visually flows:

- `edge="bottom"` → tear sits at the bottom of section A; pass section B's color (the section _below_).
- `edge="top"` → tear sits at the top of section B; pass section A's color (the section _above_).

Example: hero (`bg-gray-900`) followed by a yellow ticker → `<PaperTear edge="bottom" color="yellow-400" />` on the hero.

### `<TickerStrip>` — [app/[locale]/redesign/_components/ticker-strip.tsx](app/%5Blocale%5D/redesign/_components/ticker-strip.tsx)

Pukkelpop-style rolling marquee of all-caps strings, separator between items. Wraps `react-fast-marquee` (already a dep). Set `direction` to `right` for the second strip in a paired layout.

### `<StarBurst>` — [app/[locale]/redesign/_components/star-burst.tsx](app/%5Blocale%5D/redesign/_components/star-burst.tsx)

16-point star stamp built with a CSS clip-path so we don't need a new SVG asset. Drop a child label inside (e.g. "GRATIS / INKOM") and rotate the wrapper.

### `<DayCard>` / `<HeadlinerCard>` — [app/[locale]/redesign/_components/day-card.tsx](app/%5Blocale%5D/redesign/_components/day-card.tsx), [headliner-card.tsx](app/%5Blocale%5D/redesign/_components/headliner-card.tsx)

Tilted, halftoned image cards used in the line-up sections. Each has a slight per-card tilt (set in the page) so the row feels hand-arranged.

### `<PhotoMarquees>` — [app/[locale]/redesign/_components/photo-marquees.tsx](app/%5Blocale%5D/redesign/_components/photo-marquees.tsx)

Twin marquees of festival photos with a randomized client-side shuffle. Same behavior as the production `<HomeMarquees>`, minus the inner white tear SVGs that clash with the redesign's colored sections.

### `<Button>` — [components/ui/button.tsx](components/ui/button.tsx)

Existing component, now with extra variants for the redesign:

- `variant="brand"` — orange fill, black border, white text.
- `variant="accent"` — yellow fill, black border, dark text.
- `variant="sky"` — blue fill, black border, white text.
- `variant="ink"` — black fill, black border, yellow-300 text.
- `size="2xl"` — extra-large CTA scale.
- `sticker` (boolean) — adds the offset shadow + lift-on-hover behavior.

The legacy variants (`primary`, `transparent`, `minimal*`) are unchanged so existing pages keep their look.

### Navigation — kinetic full-screen menu — [components/navbar.tsx](components/navbar.tsx)

The menu is a Base UI `Dialog` that takes over the viewport when triggered. Notes:

- **Header** — permanently `position: fixed`. As the page scrolls past the first 120px, vertical padding tightens and the logo scales to 70% via `motion`'s `useScroll` + `useTransform` (no CSS keyframes — the motion values feed `motion.nav` and `motion.div` directly).
- **Backdrop** — `bg-brand-500/65` (intentionally translucent) with `backdrop-blur-2xl` and a `halftone` overlay on top, so the page underneath shows through tinted, blurred, and halftoned. The popup itself stays put; an inner `motion.div` slides the colored layer down from `translate-y: -100%` to `0` (the "gate" drop). No more clip-path reveal.
- **Link stagger** — the link list runs `motion` parent/child variants: `staggerChildren: 0.05`, `delayChildren: 0.35`, each link transitions `opacity 0 → 1` + `y: 30 → 0`. Reverse stagger on close.
- **Kinetic hover** — every menu link wraps two stacked copies of the label in a CSS grid cell with `overflow-hidden` + `leading-none` on the wrapper (so the row is exactly one glyph tall and `translate-y-full` is a clean 100% shift). On `:hover` / `:focus-visible` both copies translate up together — original slides out the top, the yellow duplicate slides in from below. Pure CSS, no JS.
- **Sizing** — `text-4xl md:text-6xl xl:text-7xl` with `py-2.5 px-4` on mobile (44px+ tap target, 8px gap between rows) tightening to `md:py-1` + `md:gap-1` on larger viewports. Tight enough that all six items fit on common breakpoints, loose enough that mobile fingers don't mis-tap.
- **Locale switcher** — uses [`<LocaleSwitcher>`](components/locale-switcher.tsx) (the previous globe-icon-opens-a-modal pattern is gone). Three two-letter codes (`NL FR EN`); inactive sit at `opacity-50`, the active one carries a yellow underline that slides between codes via `motion`'s `layoutId`. Keep it subtle — only visible while the menu is open, fading in once the link stagger settles.
- **Base UI integration** — `BaseDialog.Portal keepMounted` keeps the popup in the DOM so `motion`-driven exits play out. Use `data-closed:pointer-events-none` so the popup doesn't intercept clicks while invisible.

When adding new menu items, keep the size scale and the `<span className="grid overflow-hidden leading-none">` wrapper so the kinetic swap stays in sync.

## Layout & spacing

- Use `container-wide` for the redesign — `1640px` max width, more breathing room than `container-page`. The existing home page also uses `container-wide`.
- Vertical rhythm via `section-y` (3rem mobile / 6rem md / 9rem xl) and `section-y-sm` (3rem / 5rem). Stick to these — don't hand-roll padding values.
- Cards: 2px solid black border + `shadow-sticker[-lg]`. No drop shadows, no rounded corners.
- Mobile is the primary canvas — 80% of traffic. Card stacks should collapse to a single column comfortably; tilt remains visible at any breakpoint.

## Motion

The redesign currently ships with **no JS-driven motion** by design — we'll layer it in once the layout is approved. The only "motion" today is:

- The hero `<video>` background loop.
- `<TickerStrip>` (CSS marquee).
- Hover micro-translations on stickers / cards (`hover:-translate-y-1`).

When motion is added later, prefer `motion/react` (rebrand of `framer-motion`) — already a dep. Honor `useReducedMotion()`.

## Where the redesign lives

- Page: [app/[locale]/redesign/page.tsx](app/%5Blocale%5D/redesign/page.tsx)
- Local components: [app/[locale]/redesign/_components/](app/%5Blocale%5D/redesign/_components/)
- Shared copy strings: [copy.ts](app/%5Blocale%5D/redesign/_components/copy.ts) — keyed by locale, ready to extract into the next-intl JSON namespaces once the layout is locked.
- The `/redesign` route is registered in [lib/i18n/routing.ts](lib/i18n/routing.ts) and added to `transparentRoutes` in [components/layout.tsx](components/layout.tsx) so the navbar appears in white over the hero video.

### Sections, top to bottom

1. **Hero** — full-bleed video, halftone, edition sticker, "FREE ENTRY" starburst, stacked logo + date triangle, paper tear out.
2. **Ticker strip** — yellow ribbon, rolling all-caps copy.
3. **Intro + countdown** — short story of the festival next to a brand-orange countdown panel.
4. **Days** — three tilted halftone day-cards with sticker numbers (`<DayCard>`).
5. **Headliners** — three featured artists pulled from `artists.json` (`<HeadlinerCard>`).
6. **Activities (bento)** — paella (large) + pétanque + crew/volunteer tile.
7. **Aftermovie** — re-uses `<ConsentVideo>`, framed in dark.
8. **Gallery** — re-uses `<HomeMarquees>`, framed in yellow.
9. **Numbers** — four chunky stat stickers on brand-orange.
10. **Partners teaser** — sticker grid of 8 partner logos + "All partners" / "Become a partner" CTAs (full list still lives in the global `<Footer>`).
11. **Closing CTA** — last loud moment before the footer.
