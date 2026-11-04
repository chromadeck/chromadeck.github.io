# Design DNA — yusufyunus.com

> Reverse-engineered design analysis of https://yusufyunus.com/ for chromadeck-web.
> Reference screenshots live in `ref-shots/`. Facts are labelled **[OBSERVED]** (seen/probed) or
> **[INFERRED]** (educated guess, not directly verifiable).

## 1. Concept & narrative structure

The whole site is built around one metaphor: **signal vs. noise** (from the owner's UnTune project —
"strips the music out of any video, live, and keeps the voices").

- **[OBSERVED]** Load: a full-screen welcome dialog ("Welcome to my humble abode… Click anywhere to come in").
- **[OBSERVED]** The page reads as five numbered "chapters", each announced by an eyebrow label `1–5`:
  1. The work — 3D card wall of projects
  2. The story — vertical timeline
  3. The toolkit — draggable 3D skill cloud
  4. The proof — stats, recognition, testimonials
  5. Your turn — contact form
- **[OBSERVED]** Between every chapter sits a one-line "interstitial" sentence in italics serif, centered
  ("That's the work. Here's the road that led to it." / "Tools only matter for what they ship. Here's what shipped.").
  These carry the story forward and pace the scroll.
- **[OBSERVED]** Footer echoes the hero: giant display type "Thanks for listening."
- **[OBSERVED]** Diary-like micro-copy everywhere ("I read every message myself", live local time in KL
  in the contact sidebar).
- **[OBSERVED]** Mood shift per context: main site = clean editorial; `/canvas/` "Desk" = playful sticker
  workbook (thick ink borders, offset shadows, pastel category headers); terminal easter egg (`` ` `` key)
  = monospace CLI with `guest@yusufyunus:~` prompt.

## 2. Color tokens

**[OBSERVED]** (extracted from the site CSS custom properties; values below are the dark-theme defaults,
light theme flips them):

```css
--bg:        #0c0e1c   /* deep navy-black page background (dark) */
--bg-2:      #11142a
--surface:   #171a31   /* card surface */
--surface-2: #1d2140
--text:      #ecedf5   /* near-white */
--muted:     #a4a8c4   /* periwinkle gray */ 
--line:      #ecedf51f /* 12% hairline */
--line-strong: #ecedf542
--noise:     #5d6190   /* haydon-blue used by the noise field */
--signal:    #c77bff   /* accent: violet signal color (dark) */
--signal-ink:#dba6ff
--on-signal: #14152b
--ink:       #14152b   /* near-black text on light surfaces */
--shadow:    0 1px 2px #0000004d, 0 20px 50px -18px #000000b3
--grid:      #a4a8c429 /* grid-line tint */
```

**[OBSERVED]** Light theme (default on load, from screenshots): near-white `#f2f3f7`-ish background,
near-ink `#14152b` type, same periwinkle-muted secondary text, and a **crimson red accent family**
(`#d71f2b`-ish: availability dot, timeline dots, footer rule, eyebrows "1/2/3/4/5", search hover tint)
plus the halftone hero dots in **red/violet/navy**.

**[OBSERVED]** Semantic scene tints (used on the Desk cards and search results):
`--h-about:#e8a3a8` (pink), `--h-stack:#a9aee6` (periwinkle), `--h-now:#a9d2b2` (mint), `--h-awards:#e3c77f`
(amber), `--h-work:#a8c7e6` (light blue), `--h-contact:#dea9c9` (rose). Each chapter/card owns a pastel hue.

**[OBSERVED]** Project covers each carry their own full-bleed art direction (dark navy waveform, teal
isometric chain, aurora dock, magenta candle shot) — the chrome stays monochrome, the *content* is colorful.
This is the site's most distinctive restraint: UI is two-tone ink-on-paper, imagery supplies the color.

## 3. Typography

**[OBSERVED]** Exactly two families, self-hosted woff2 via `next/font` (class names
`anybody_…__variable`, `newsreader_…__variable` on `<html>`; font preloaded in `<head>`):

| Role | Family | Usage |
|---|---|---|
| Display / UI | **Anybody** (variable, weight 820 seen on H1, plus 600/700 UI) | H1 245px clamp `--t-4xl`, section titles, buttons, chips, nav, numbers, timeline years, desk card headers |
| Body / editorial | **Newsreader** (serif) | paragraphs, quotes, interstitials, modal body, image captions |

**[OBSERVED]** H1 rendering measured: `font-weight:820; font-size:243px (at 1440w = clamp(--t-4xl));
line-height:0.8×; letter-spacing:-8.5px (~-0.035em)`. Extremely wide-tracked-negative, tight-ledding, two stacked
lines ("Yusuf" / "Yunus" — second line offset right).

**[OBSERVED]** Type scale tokens:
`t-xs .8125rem · t-sm .9375rem · t-md 1.0625rem · t-lg 1.3125rem · t-xl 1.75rem`,
`t-2xl: clamp(2rem,4vw,2.75rem)`, `t-3xl: clamp(2.5rem,6vw,4.5rem)`, `t-4xl: clamp(3rem,9vw,7.5rem)`.

**[OBSERVED]** Numbers (stats, `01/10`) are set in Anybody ExtraBold with thousands separators;
stat numerals are huge (≈96–120px) on the left of a hairline row, serif description on the right.

## 4. Spacing, grid, radii, shadows

- **[OBSERVED]** `--gutter: clamp(16px, 4vw, 56px)`; content max `--max: 1320px`; card width token
  `--cw: min(52vw, 780px)`.
- **[OBSERVED]** Radii tokens: `--radius-sm: 10px`, `--radius: 18px`, `--radius-lg: 28px`;
  pills/chips/badges use full-round `999px`. Work cards measured `22px`.
- **[OBSERVED]** Shadow token (two-layer, large soft ambient): `0 1px 2px #0000004d, 0 20px 50px -18px #000000b3`.
- **[OBSERVED]** Hairline `1px` rules everywhere (stat rows, timeline, footer top rule is a solid red rule, 2px).
- **[OBSERVED]** Section rhythm: generous vertical whitespace (~12–20rem between blocks), text-heavy
  sections are narrow measure (serif paragraphs ~60–70ch max 720px).

## 5. Layout architecture

- **[OBSERVED]** Single vertical-scroll page + separate routes: `/projects/` (list), `/canvas/` (desk), `/recruiter/`.
- **[OBSERVED]** Section heights (desktop 1440×900): hero 900px; prologue 3240px (tall pinned text area);
  work 5857px (pinned scrolljack); orbit 578px; story 3378px; skills 1101px; proof 1688px; teaser 564px;
  contact 1463px; total ~20,555px.
- **[OBSERVED]** Fixed floating header: 3 independent pills — logo pill (left), section nav pill (center),
  icon cluster + "Let's talk" pill (right); backdrop-blur/solid white on light theme.
- **[OBSERVED]** Nav has active-section indicator: small red dot under the current section link.
- **[OBSERVED]** Full-screen mobile menu sheet with giant stacked Anybody links.
- **[OBSERVED]** Grid overlay (2-col ~ "text column / media column") in orbit & teaser; proof splits
  2-col (stats full-width rows; recognition + quotes side-by-side).

## 6. Component patterns

- **Pill chip** — 999px radius, 15px Anybody 600, 14px×0 padding; variants: filled ink (active filter),
  outlined translucent, tinted soft.
- **Status chip** on cards ("Engineering", "Award winner" w/ trophy icon) — small white/ink pill, top-left/right.
- **Card** — work cards 22px radius, mixed surface: top = full-bleed cover image w/ overlay label chip,
  bottom = ink band with big Anybody title + serif one-liner + circular arrow button (44px, white bg, arrow glyph).
- **Stat row** — giant numeral | serif sentence, hairline separators.
- **Quote** — serif, oversized typographic open-quote in red, name in Anybody 700 + role muted.
- **Form** — labels Anybody 700; inputs large radius-10 fields; segmented pill radios; send arrow button ( filled ink,
  999px, paper-plane glyph); char counter `0 / 2000` mono-ish small text.
- **Toolbar (desk)** — floating white pill with icon buttons + dividers, bottom dock of circular icon buttons.
- **Modal** — near-fullscreen white sheet `95%` width, radius-lg, close-circle top-right; two-column
  case-study: left = title+serif body, right = stat cards + cover image.

## 7. Visual hierarchy & distinctive decisions

1. **[OBSERVED]** Literal type-scale contrast: 243px display vs 15px UI — scale is the #1 hierarchy tool.
2. **[OBSERVED]** Serif for *telling*, geometric sans for *UI*. Mixing a bookish serif narration inside a brutalist
   geometric chrome is the brand trick.
3. **[OBSERVED]** Continuous narrative device: words-as-spans everywhere (hero heading letters, prologue words,
   section titles, footer words) → enables word/letter-level scroll animation ("noise feels blurry, voice is crisp").
4. **[OBSERVED]** Halftone/canvas spectrogram dots as hero background — the *content of the metaphor is the texture*.
5. **[OBSERVED]** Red only as signal color (dots, dots timeline, eyebrow numbers, awards) — never fills large areas.
6. **[OBSERVED]** Monochrome chrome + full-color media: cards/modal images hold saturated art over neutral paper.
7. **[OBSERVED]** Dead-simple utility contrast in chips: outlined vs filled ink communicates state; no borders + heavy radius.
8. **[OBSERVED]** Playful annotation layer: hand-drawn desk cards, sticker arrows, "Drag to spin", "Click anywhere to come in".
