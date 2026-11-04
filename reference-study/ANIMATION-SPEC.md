# Animation Spec — yusufyunus.com

> Observed via Playwright interaction + CSS/JS probing. Site stack: **Next.js (Turbopack) + GSAP 3.15 +
> Lenis 1.3.26 + hand-written canvas** (the anon confirms it in the page console log).
> CSS token `--ease-out: cubic-bezier(.22, 1, .36, 1)` **[OBSERVED]** is the standard ease.
> Timings marked with ~ are inferred from interaction, not frame-measured (capture tooling not run for this pass).

## Global

| # | Behaviour | Trigger | Details |
|---|---|---|---|
| G1 | Smooth scroll | wheel/touch/keys | Lenis smooth scrolling (global `lenis` singleton, v1.3.26). All scroll-driven anims are functions of Lenis-smoothed scroll position. **[OBSERVED]** |
| G2 | Reduced motion | `prefers-reduced-motion` | CSS has explicit `@media (prefers-reduced-motion: reduce)` and `no-preference` blocks. **[OBSERVED]** |
| G3 | Theme swap | theme toggle button | CSS custom properties swap (light↔dark). Instant, no reported transition. **[OBSERVED]** |

## Load sequence

| # | Element | Trigger | From → To | Notes |
|---|---|---|---|---|
| L1 | Welcome dialog | page load | overlay visible; click/Escape → dismissed | Full-screen tinted overlay, dialog box, "Click anywhere to come in". **[OBSERVED]** dismissed via Escape. |
| L2 | Hero heading | on load | letters reveal (per-letter spans exist in DOM: Y-u-s-u-f / Y-u-n-u-s) | **[OBSERVED spans]**; per-letter stagger animation of first paint inferred (~, letters rise/fade). |

## Hero (canvas + slider)

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| H1 | `.spectro` canvas | continuous rAF + scroll | Hand-written **canvas dot-matrix spectrogram** fills the hero background (dots in navy/red/violet, grid rows). It animates over time (renders visible in 2 screenshots at different ticks **[OBSERVED difference]**) and reacts to scroll (noise% counts down as you scroll: 100% at top → 0% deeper). **[OBSERVED counter and rendering]** |
| H2 | Noise / Voice slider | drag (pointer) | "Noise 100% — Voice" control right of the hero; a draggable micro-slider sets the dot field's noise/voice mix. Drag not exercised (custom drag element, no `<input>`) **[OBSERVED structure]**. |
| H3 | "Scroll to remove the noise" link | anchor | jumps to `#prologue`. **[OBSERVED]** |

## Prologue (scrub text) — the signature effect

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| P1 | Every word (span-wrapped paragraphs, ~106 spans) | scroll progress while section pinned/long | Words interpolate between **"noise" state** (blurred, low-opacity, periwinkle `--noise` colour) and **"voice" state** (crisp, full-ink, weight up). Word-level differential progress — a few words become crisp first ("signal" highlighted earlier than rest) **[OBSERVED pattern in screenshots: mixed crisp/blur states simultaneously]**. Scroll-scrubbed (function of position, not time). |

## Section titles (word blur reveal)

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| T1 | H2 section titles ("Things I've built, designed and grown." / "How I got here.") | scroll into view | Word-by-word reveal with blur→sharp + opacity; leading words arrive crisp while trailing words still blurred mid-scroll **[OBSERVED screenshot 04: "built," crisp, "designed" semi-blur, "and grown." heavy blur]**. Scrub or once-with-scrub feel — words are individually span-wrapped. **[OBSERVED spans]** |

## Work section (scrolljack card wall) — centerpiece

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| W1 | `#work` region | scroll | Section is **pinned** for ~5857px total height; scrolling "turns the wall": card index advances 01/10 → 10/10 as user scrolls (`work-card is-active` moves). **[OBSERVED: index changed 01→03→05→07 screenshots]** |
| W2 | `.work-card` transform | scroll progress | Cylinder/carousel layout with **matrix3d rotateY** measured live: active card `~0°`; side cards `~±38°` (cos .788/sin .615) with `translateX(±~730px)` and slight scale-down; far cards ~±76°. Cards are 3D-tilted outward from a center axis **[OBSERVED computed matrix3d values]**. |
| W3 | Card filter pills | click | Featured/Everything/…filters swap the deck (Featured=10, Everything=20). Active pill = filled ink. **[OBSERVED]** |
| W4 | Prev/next buttons + counter | click / scroll | Counter text `02 / of 10 …: Zakat Fitrah Tracker` updates; prev disabled at first. **[OBSERVED]** |
| W5 | Active card | click | Opens case-study modal; URL becomes `#project=zakat-fitrah`. **[OBSERVED]** |
| W6 | Side card | click | Promotes that card to active ("Show X…→" labels; the active card button label starts "Open X…"). **[OBSERVED]** |

## Case-study modal

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| M1 | Modal open | card click | Overlay sheet; content in two columns; Escape closes. Open/`pop` transitions exist as keyframes `pop/unpop/zd-in/cs-in` in the CSS **[OBSERVED keyframes list]**; exact easing not frame-measured. |
| M2 | URL state | open/close | hash `#project=slug` sync (deep-linkable). **[OBSERVED]** |

## Orbit section (black hole)

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| O1 | Poster thumbnails around the black hole | continuous | Posters orbit a black disc with a red halo ring ("They've been caught in orbit"); keyframes `diskspin`, `bhripple`, `orbit`-family present in CSS **[OBSERVED keyframes]**. Perpetual idle animation, more energetic on scroll/hover (inferred). |
| O2 | "Pull it out ⭳" button | click/hover | Download CTA pill near the hole; presumably the posters "pull out" on hover/click (inferred — not exercised). |

## Story (timeline)

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| S1 | Left sticky panel (`aria-hidden` duplicate) | scroll | Giant year + event title on the left **pinned** per item while the right list scrolls. **[OBSERVED: panel content changes 2017→2018→2020 as scroll progresses]** |
| S2 | Red timeline spine | scroll | Vertical red line grows; filled red dots for passed items, hollow gray dots for upcoming **[OBSERVED screenshot 11: mixed dot states]**. |
| S3 | Timeline items | scroll progress | Items below the current position are de-emphasized (grayed, lighter weight); passed items full ink. Scrub-based emphasis **[OBSERVED]**. |

## Skills (tag cloud)

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| K1 | Tag cloud of 67 skills | drag + inertia | "Drag to spin" 3D word-sphere: continuous slow spin; pointer drag sets rotation velocity with inertia (custom JS, no OrbitControls visual chrome). **[OBSERVED hint text + layout]**; implementation inferred to be JS 3D projection (rotate positions sorted by depth → font-size/opacity scaling). |
| K2 | Group filter pills (with counts) | click | Highlight a group: non-group tags dim, group tags emphasized. **[OBSERVED buttons with counts]** |

## Proof / stats

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| N1 | Stat numerals | scroll into view | Count-up from 0 to target presumed (12,000+ / 208,000 / …) — not frame-verified; layout static-verified. |
| N2 | Stat rows | scroll | Rows appear in sequence (fade/rise pattern typical; keyframes `rise`, `fade` exist in CSS **[OBSERVED]**). |

## Other

| # | Element | Trigger | Behaviour |
|---|---|---|---|
| X1 | Ctrl+K search | Ctrl+K | Command-palette overlay: backdrop blur; jump list + featured projects; type-to-filter; ↑/↓ move, Enter open, Esc close (footer hints literally printed). **[OBSERVED opened + hints]** |
| X2 | Terminal | `` ` `` key or footer button | Fake shell `guest@yusufyunus: ~` with typed monospace intro; keyframe `term-in` in CSS **[OBSERVED opened screenshot]**. |
| X3 | Desk `/canvas/` | route | Interactive board: cards draggable by header, scroll = pan/zoom, fit-all/tidy/shuffle toolbar, dock of card-type buttons with active dot, zoom % readout. **[OBSERVED screenshot + instruction copy]** |
| X4 | Header active dot | scroll position | Red dot slides to the nav link of the section currently scrolled into. **[OBSERVED dot under "Work" in shots 4-6 → "Story" deeper]** |
| X5 | Form controls | focus/type | 0/2000 counter live; pill radios toggling filled state **[OBSERVED markup]**. |
| X6 | Footer "Open the terminal" & "Recruiter view" | click | Terminal opens; recruiter route exists. **[OBSERVED links]** |

## Library attribution

- **GSAP 3.15** registered (window `gsapVersions`) — bundling suggests it powers scrub timelines, modal/letter animations; ScrollTrigger handle exists in memory (protected, not enumerable globally).
- **Lenis 1.3.26** — smooth scroll driver, global.
- **Hand-written canvas** — `.spectro` hero field (confirmed by console log), and the orbit visuals (covers + red ring) on canvas-free CSS.
- Everything else is custom CSS keyframes (25 `@keyframes` present) — no Framer/three.js/Lottie detected.
