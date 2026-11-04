# Asset Inventory — yusufyunus.com

> Reference captures live in `ref-shots/`; site stylesheet saved to `ref-shots/site.css`;
> DOM probes in `ref-shots/css-vars.json`, `ref-shots/tech-probe.json`, `ref-shots/section-map.json`.

## Reference screenshots captured (local)

| File | Shows |
|---|---|
| `01-hero-top.png` | Light hero, noise dots, letter H1, nav pills |
| `02-hero-scrolled.png` | Prologue "internet is noise." |
| `03-prologue.png` | Scrub text mid-state |
| `04-work-intro.png` | "Here's what that looks like." + word-blur H2 state |
| `05-work-cards.png` | Card wall: UnTune active card, Zakat side card, filter pills, grid floor |
| `06-work-cards-tall.png` | Wall between states (nav pill dominates) |
| `07-blackhole.png` | Orbit section visuals: mini previews of posters around the hole |
| `08-after-work.png` | Card wall 05/10 (Eman Channel card) |
| `09-story.png` | Card wall 07/10 (Yusha) + usability score sticker (85 card art) |
| `10-orbit.png` | Black-hole composition (posters, red ring) |
| `11-timeline.png` | Story: giant year panel, spine, filled/hollow dots |
| `12-skills.png` | Skills heading + pills + tag cloud |
| `13-skills-cloud.png` | Tag cloud mid-state, "Drag to spin" |
| `14-proof.png` | Stat rows + Recognition + first quote |
| `15-teaser.png` | Desk teaser card w/ sticker preview |
| `16-contact.png` | Form, pill radios, social sidebar |
| `17-footer.png` | "Thanks for listening." footer |
| `18-hero-dark.png` | Dark theme hero (violet signal hues) |
| `19-case-modal.png` | Case-study modal (Zakat Fitrah) |
| `20-search.png` | Ctrl+K command palette |
| `21-projects-page.png` | `/projects/` list |
| `22-canvas-desk.png` | `/canvas/` desk board |
| `23-mobile-hero.png` / `24-mobile-menu.png` | Mobile 390×844 |
| `25-terminal.png` | Backtick terminal easter egg |

## Fonts

| Family | Delivery | Use |
|---|---|---|
| **Anybody** (variable display sans; weight axis, site sets 820 display / 600–700 UI) | self-hosted woff2, `<link rel=preload as=font>` (`/_next/static/media/dfab0cefd93a9d64-s.p.03x-kc1owbo0-.woff2`), `next/font` module + generated fallback ("Anybody Fallback") | H1, section titles, buttons, chips, nav, numbers, timeline giant years, stickers |
| **Newsreader** (variable serif) | same mechanism (separate woff2 chunks likely non-preloaded) | body copy, interstitials, quotes, modal prose, captions |
| UI fonts in terminal / counters | system monospace / small Anybody | console, captions |

## Images

| Asset group | Format | Notes |
|---|---|---|
| Project card covers (`/work/<slug>/cover.webp`) | WebP, full-bleed 16:9ish art | Preloaded for the first wall cards (untune, zakat-fitrah, harbor, `portfolio/01.webp`) |
| Portfolio pages (`portfolio/NN.webp`) | WebP | Orbit section poster sheets + desk Design card grid |
| Avatar (desk About card) | webp/png | small |
| Iconography | inline SVG (icon.svg favicon; trophy, arrows, social glyphs) | no icon font observed |
| PDF | Static downloads: `Graphic-Design-Portfolio.pdf` (17pp/9MB), `Resume.pdf` | linked "Pull it out ⭳" |

## Technical stack (observed)

| Layer | Finding |
|---|---|
| Framework | **Next.js** (App Router; `/_next/static/chunks/…` + `turbopack-*.js` runtime; `next/font`; meta generator truncated but Next webpack chunk names evident) **[OBSERVED]** |
| Smooth scroll | **Lenis 1.3.26** global singleton **[OBSERVED]** |
| Animations | **GSAP 3.15.0** (`gsapVersions`) + custom CSS keyframes; author's own console log confirms "Next.js, GSAP and a lot of hand-written canvas" **[OBSERVED]** |
| Canvas | `.spectro` hero dot-matrix spectrogram; absolute, z0, DPR-aware (1425×900 backing at dpr1, viewport-fit) **[OBSERVED]** |
| Styling | Plain CSS w/ custom properties (90.4KB single stylesheet file after LightningCSS minification: `--lightningcss-*` tokens present) |
| Helpers | `prefers-reduced-motion` handling; `@media` breakpoints: 520/560/600/640/760/860/900/960/1000 (max), 961/1400 (min), pointer/hover conditionals |
| State | URL hash (`#project=slug`) for modals; localStorage/sessionStorage present for theme & dialog dismissal (inferred from APIs available) |
| Console | Branded greeting + stack confession + easter-egg hints (` for terminal) **[OBSERVED]** |
