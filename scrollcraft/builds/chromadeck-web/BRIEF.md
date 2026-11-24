# ChromaDeck landing page: brief

Self-authored under explicit creative delegation. The owner asked to "apply
scrollcraft" to the existing ChromaDeck site, after asking for a landing page
that fits the product the way ArtCraft's site fits its product. No interview
was run. Evidence below is marked; everything else is an authored decision.

Scope: rework the existing Next.js page in place (GSAP and Lenis already
present). Keep the catalog direction, the real screenshots and the walkthrough
video. No generated imagery, no kie.ai spend.

## The eight topics

1. **Vibe.** Authored: "a tool catalog, calibrated, quiet, exact." References:
   a monitor's on-screen display menu, a colour calibration target, a museum
   object label. Evidence: the owner pointed at ArtCraft (dark, mono labels,
   ruled grids, real screenshots).
2. **Journey.** Authored: see the app, walk its screens, watch a preset go on,
   watch it work, read the rules, download.
3. **Energy curve.** Calm hero, curious gallery, one loud change at Apply,
   calm after.
4. **Feeling, and the one moment.** See the feeling curve and peak below.
5. **The thing no other site does.** Authored: the page is a display, and
   ChromaDeck is applied to it. The visitor regrades every screenshot, the
   video and the page colours with the app's own gamma ramp math.
6. **Range.** Dense, leaning brutalist. Evidence: the app's own UI uses mono
   uppercase labels and hairline frames.
7. **World or scenes.** Distinct scenes. A catalog, not a flight.
8. **Assets.** Evidence: five real screenshots in `public/app/` (dashboard,
   monitors, editor, apply, library) and `public/video/chromadeck-walkthrough.mp4`.
   No photography, no brand kit beyond the logo and the app's tokens.

## Journey

1. Recognition: the main window, with the apply dialog open over it.
2. Range: the screens, one at a time, walked sideways.
3. Turn (peak): scrolling past "Apply it to a monitor" regrades the page.
4. Proof: the walkthrough plays.
5. Substance: the rules the tool keeps.
6. Commitment: pick an installer.

## Feeling curve

| Act | Feeling | What causes it |
|---|---|---|
| Hero | Recognition | The real app, the dialog floating off the dashboard as you scroll |
| Gallery | Curiosity | Screens slide in from the right, each labelled like an exhibit |
| Steps (peak) | Surprise, then control | The whole page shifts to Low Blue under your thumb, the readout says Pinned |
| Walkthrough | Trust | The real app moving, already in your chosen grade |
| Principles | Calm certainty | Dense plain rules, no motion |
| Download | Resolve | One label, one recommended file |

Authored silence: the empty band between the gallery and the steps. It is
there so the regrade has something to be a change from.

## Peak

> I scrolled past "Apply" and the whole site turned warm, like I had just
> applied the preset to my own screen.

Lives in the steps act. It gets the most scroll room on the page.

## Tell-someone sentence

It's the site where scrolling applies a colour preset to the site itself, and
then you can switch presets and watch every screenshot change.

## Score

Grammar: gallery / catalog. Why the others lost: filmic one-shot and
continuous world hide structure, but the owner asked for a catalog like
ArtCraft's. Live surface would need the real app running in the page.
Editorial, poster, split stage and cutlist do not fit a tool with four screens
and one action.

| Act | Device | Why this one |
|---|---|---|
| Hero (object one) | `parallax`, two planes | The dialog lifts off the window it belongs to |
| Screens | `pan` rail, items settle | Lateral travel reads as range |
| Steps (peak) | Signature regrade, scrubbed; sticky colour bar | The change happens to the page under the hand |
| Walkthrough | `reveal`, bottom-up wipe | A change of state: still page to moving app |
| Principles | `flow` + `in` | Dense rules, no motion needed |
| Download | `flow`, label plate | The close is a label, typeset like the catalog |

Signature move: the page wears a ChromaDeck preset. The app's NVCP gamma
ramp (src/lib/nvcp.ts) drives an SVG filter on every screenshot and the video,
and regrades the page tokens. Scroll applies Low Blue at "Apply" and pins it at
"Pin"; the on-screen-display control lets the visitor pick any preset.

Deviation from the skill: built inside the existing Next.js app with GSAP
ScrollTrigger, not the scrollcraft engine, so the act markup does not use
`data-sc-*`. The project's DESIGN.md bans shadows, so hero depth uses
occlusion (a ring of page ground) instead of an offset shadow.

## Update, 2026-11-24

The owner found the page regrade annoying, so it is removed: no SVG grade
filter, no token regrade, no preset control, no colour bar. How it works is
now a plain list of three steps. This build no longer has a signature move;
its fingerprint row below records what shipped first.
