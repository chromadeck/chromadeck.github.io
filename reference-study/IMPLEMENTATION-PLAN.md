# Implementation Plan — chromadeck-web ← yusufyunus.com design DNA

> What chromadeck-web needs to adopt to feel like the reference, without copying code or content.
> Stack of the target: (verify `package.json` before implementing — the plan assumes a modern Next.js or
> React-SPA repo; assume GSAP + Lenis as the animation core, both free and compatible).

## Fidelity target

**motion-faithful** for the signature interactions, **visual-DNA faithful** for the design system.
Copy: ChromaDeck's own content, not Yusuf's. The distinctive decisions to preserve:
1. Noise→voice metaphor (blurred/scrub words) as *the* scroll effect.
2. Display sans + bookish serif pairing, extreme scale contrast (895px→15px UI difference at hero).
3. Two-tone chrome (ink-on-paper) + colored media only.
4. Red signal color used sparingly for signal/attention (dots, eyebrows, rules).
5. Pill-based floating nav; numbered chapters; interstitial serif lines.
6. Hand-crafted canvas texture in the hero tied to scroll progress.
7. Reduced-motion support everywhere.

## Phase 0 — Foundations

- [ ] Load GSAP (+ ScrollTrigger) and Lenis; wire Lenis → ScrollTrigger (`scrollerProxy` not needed; use
      `ScrollTrigger.update` on Lenis `scroll` event + `gsap.ticker` sync, per GSAP/Lenis official recipe).
- [ ] Token layer in CSS: colors (ink `#14152b`, paper `#f2f3f7`-family equivalents, periwinkle muted,
      signal red family + accent violet `--signal` for dark), 2 fonts (Anybody + Newsreader via `next/font`
      or self-hosted variable woff2; declare fallback-adjusted metrics), radii 10/18/28 + pill 999px,
      gutter clamp, max 1320px, ease `cubic-bezier(.22,1,.36,1)`, shadow token (2-layer), z-index ladder
      (0/10/50/80), type scale (--t-xs…--t-4xl clamps).
- [ ] Global primitives: pill chips (filled/outline/tint), icon circle buttons, hairline rules,
      section eyebrow (`<i>1</i> The work`), interstitial serif line component.
- [ ] Respect `prefers-reduced-motion` gate: a single `useReducedMotion` helper controlling every effect.

## Phase 1 — Global chrome

- [ ] Floating 3-pill header (logo pill / center nav pill / actions cluster + CTA).
- [ ] Active-section red dot via IntersectionObserver or ScrollTrigger onEnter/EnterBack.
- [ ] Mobile full-screen menu sheet (giant links, translateY-in, stagger 40ms approx).
- [ ] Theme toggle: CSS custom-property swap w/ `data-theme`, persisted (localStorage), no flicker
      (inline script sets attribute pre-paint).
- [ ] Ctrl+K command palette: sections + entries; type-filter; ↑/↓/Enter/Esc; backdrop blur; hints row.
- [ ] Welcome overlay (first visit; sessionStorage flag) — dismiss on click/Escape, fade out ~400ms.
- [ ] Footer: red hairline top rule, giant display sentence, link pills, meta row, open-terminal easter egg optional.

## Phase 2 — Hero

- [ ] Letter-split H1 (per-letter spans; entrance rise+fade ~0.5s·stagger ~30ms; no scroll dependency).
- [ ] Availability chip w/ pulsing red dot; "30-second version" pill.
- [ ] Noise/Voice slider component (pointer-drag) → drives canvas mix param + percent label.
- [ ] `.spectro`-style canvas: dot-matrix field, rows in grid, blue noise dots / red signal dots,
      time-animated + scroll-scrubbed noise→voice (percent readout). DPR-aware sizing, rAF paused when offscreen.
- [ ] Serif intro paragraph + scroll-to hint; layout per reference (heading overlaps canvas, canvas band 34%).

## Phase 3 — Prologue + section titles (signature scrub)

- [ ] Words-as-spans text utility (`<W>` wrapper / client-side splitter, keep screen-reader text intact:
      `aria-hidden` spans + visually-hidden plain text, or `:not([data-split])` pattern).
- [ ] Scrub timeline: batch-to-batch word delta — words interpolate blur (blur-xpx→0), color
      (muted→ink), weight, opacity as scroll progresses; stagger by index (% progress per word).
- [ ] Same utility for H2 section titles (smaller amplitude, blur from ~8px, fade 0.4→1).
- [ ] Interstitial lines: soft rise on enter (0.6s, --ease-out).

## Phase 4 — Work wall

- [ ] Pinned section ('scrolljack'): section height ≈ N cards × ~585px each; inner sticky viewport.
- [ ] Cylinder math: per-card render θ = index − progress*(visibleSpan); transform:
      `rotateY(θ)` + `translateX(±r·sinθ)` + scale `cos(θ)`, perspective on container (~1200px).
      Keep CSS-variable-driven so progress scrub retargets cheaply.
- [ ] Card anatomy: cover + label chips + active gradient band w/ big Anybody title + serif line +
      arrow FAB. Radius 22px, shadow token.
- [ ] Controls: filter pills (functional filtering of the deck), prev/next, counter `0N / of NN : Title`.
- [ ] Click-center opens case modal (`pop`-in ~250ms, backdrop fade, hash sync `#<slug>`); Esc/backdrop closes.
- [ ] Grid floor: bottom perspective grid lines (CSS gradient + transform), per screenshot.

## Phase 5 — Story timeline

- [ ] Two-col: sticky left panel (giant year + event name, updates while right list scrolls) / right list.
- [ ] Red spine as SVG or pseudo element, scaleY by progress; dot state per item pass threshold
      (filled red vs hollow gray).
- [ ] Item emphasis swaps (grayed → ink) via scroll progress thresholds; reduced-motion: static ink.

## Phase 6 — Skills cloud

- [ ] 67-tag 3D sphere: precompute sphere points (fibonacci distribution), rotate with rAF idle spin +
      pointer-drag inertia (velocity decay, no external lib needed).
- [ ] Depth scaling: font-size/opacity/color by z; keep layout block height fixed to avoid CLS.
- [ ] Group filter pills w/ counts; non-group dimming (`opacity .25`-ish, 300ms).

## Phase 7 — Proof, contact, routes

- [ ] Stat rows: hairline separated; count-up numerals on enter (1.2s, --ease-out; skip reduced-motion);
      giant numeral left / serif sentence right.
- [ ] Recognition list with trophy SVG; quotes w/ oversized serif quote mark.
- [ ] Contact two-col form w/ pill radio group, live char counter, send button; sidebar w/ copy-email
      button (clipboard + toast), social arrow rows, local time note.
- [ ] `/projects/` list page: eyebrow count, giant H2, filter pills w/ counts, numbered rows w/ hover
      arrow shift.
- [ ] Desk teaser card (dot-grid inner panel + tilted sticker previews) → `/canvas/` if in scope.

## Phase 8 — Performance & a11y

- [ ] Fonts: preload two variable woff2 (~300KB max), `font-display: swap`, metric-compatible fallbacks.
- [ ] Images: WebP covers, `priority` preload for the first visible set, lazy for the rest.
- [ ] Canvas: devicePixelRatio-aware; `visibilitychange`/IntersectionObserver pauses.
- [ ] All scrolling sections keyboard reachable; focus rings visible; modal traps focus; Escape closes.
- [ ] `prefers-reduced-motion` disables: Lenis smoothing, scrubs become instant states, count-ups jump.
- [ ] Verify: LCP on hero text-first layout; no CLS from split text (reserve font metrics).

## Verification (reanimate-style)

For each cloned effect, build a capture harness page and compare against reference with
frame-diff (target ≤ stated tolerance): hero letter stagger ±80ms; prologue word scrub per-scroll-position
match; wall rotateY ±2°; timeline dot state thresholds ±10% scroll. Report sheets in
`reference-study/verify/` after implementation.

## Out of scope unless asked

Terminal easter egg, `/canvas/` desk app, recruiter route — carry the metaphor but non-essential.
