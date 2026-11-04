# Component Inventory — yusufyunus.com

> Components observed on the live site (desktop 1440×900, mobile 390×844, plus `/projects/`, `/canvas/`).
> States probed: default, active card, filters applied, modal open, search open, terminal open, dark mode, mobile menu.

## Global chrome

| Component | Variants / states | Notes |
|---|---|---|
| Floating header | 3 independent pills: logo, center nav, right cluster | Fixed top; hidden center nav on mobile; nav link active state = red dot under label |
| Section nav pill | 5 links (Work, Story, Skills, Proof, Desk) | "Desk" is a route link with a rotating sub-label ("Desk"→"Tea") |
| Icon cluster | Search (Ctrl+K), Appearance (color wheel), Theme toggle, "Let's talk" CTA | Circular icon buttons in a pill row + filled CTA |
| Welcome dialog | first-visit overlay | Full-screen, dismiss on click/Escape |
| Search palette | open, typed, arrow-navigate | Backdrop-blurred; sections: JUMP TO (chapters) + FEATURED PROJECTS; keyboard hints footer (`↑ ↓ to move`, `Enter to open`, `anywhere`, esc chip) |
| Terminal | open/idle | Faux-CLI window, `guest@yusufyunus: ~` titlebar + exit button, monospace typed intro |
| Mobile menu sheet | open/closed | Full-screen; giant stacked links incl. Search |
| Theme toggle | light ↔ dark | CSS-var swap; does not persisting banner |
| Footer | big display sentence + link pills + meta row | Red hairline rule on top; "Back to top", Recruiter view, Open the terminal |

## Home page sections

| Section (id) | Components | Interactive? |
|---|---|---|
| `#top` hero | Availability chip w/ red pulse dot; "30-second version" pill button; letter-split H1; Noise/Voice slider; serif intro; scroll hint link; `.spectro` canvas bg | slider drag, 30s modal/link |
| `#prologue` | 5 paragraphs, word-span-wrapped scrub text | scroll-driven |
| `#work` | Section eyebrow `1`; H2 word-reveal; intro para w/ inline list link; **card wall** (`.work-card`, covers + label chips + title band + arrow FAB); filter pill row; prev/next controls w/ counter | filters, arrows, card click, scroll-turn |
| Case modal | 2-col case study: chips (category, year), giant title, serif body, Role row, stat cards, cover image, next/prev/navigate | close/Esc, hash-routed |
| Orbit (`.orbit-sec`) | Black hole w/ orbiting poster covers; red ellipse ring; serif copy; "Pull it out ⭳" download pill PDF CTA | hover/click inferred |
| Interstitials | per-chapter italic serif one-liners | scroll reveal |
| `#story` | Eyebrow `2`; H2; pinned left year panel; right timeline list (year, H3, org, description) red spine + dots | scroll-driven |
| `#skills` | Eyebrow `3`; H2; filter pills w/ counts (Everything…Marketing); 3D tag cloud ("Drag to spin"); accordion-style group columns below | pills, drag |
| `#proof` | Eyebrow `4`; H2; 5 stat rows; Recognition list (trophy icons); Quote list (serif + big red “) | static/scroll |
| Teaser | "Prefer to poke around?" card w/ dot-grid inner panel + sticker preview cards (About/Stack/Now/Awards) + "Open the desk →" btn | link |
| `#contact` | Eyebrow `5`; H2; 2-col: form (name/email/company; pill radios group; textarea w/ 0/2000; consent note; Send message btn) | sidebar: prefer-email block w/ copy button; social rows w/ arrow ↗ icons; local-time serif note; download resume pill |

## Secondary routes

| Route | Components |
|---|---|
| `/projects/` | eyebrow count line ("20 projects, 2021 to now"); giant H2; serif intro; filter pills w/ counts; numbered list rows (index / big title / serif one-liner / category+year / →) |
| `/canvas/` Desk | Top toolbar (back link, logo, Fit all / Tidy up / Shuffle, appearance, theme); draggable sticker cards (About w/ photo, Now, Stack w/ nested tag pills, Work, Experience, Contact, Awards, Design w/ cover grid); welcome toast w/ "Got it"; bottom dock (12 icon buttons w/ active dots); zoom pill (− 62% +) |
| `/recruiter/` | (not inspected) |
| Case pages (`/work/<slug>/`) | exist (preloaded covers for untune/zakat-fitrah/harbor/portfolio) |

## Design-system tokens (CSS observed)

```css
--t-xs .8125rem … --t-4xl clamp(3rem,9vw,7.5rem)
--gutter clamp(16px,4vw,56px) · --max 1320px · --cw min(52vw,780px)
--radius-sm 10px / --radius 18px / --radius-lg 28px / chips 999px
--ease-out cubic-bezier(.22,1,.36,1)
--z-floor 0 · --z-content 10 · --z-nav 50 · --z-dialog 80
```

```css
@keyframes present: bhripple, brief-blink, brief-time, burst, cs-in, diskspin, draw, fade, fadeout, flare,
focusIn, gateIn, nfdraw, palette-in, pop, pulse, rise, seam, sink, steam, stretch, term-in, unpop, zd-in
```
