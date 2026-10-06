# Feature: header search drops into full-screen mode

## Status: implemented

## Page/Component

`src/components/Header.tsx`, `src/styles.css`.

The idle bar fills the whole gap in the top row, not a narrow pill. On focus it moves in one
movement to its centred place below the header, not widen-then-drop.

## Why

The search had its own band under the two header rows: a large empty strip on every page, and
the header looked sparse above it. The search moves into the top row, where it fills the space
between the section links and the catalog selects. Focusing it still gives the full-screen search
of before: the bar moves to where the band was and the overlay opens under it.

## Behaviour (testable)

- [x] At rest (desktop), the search bar sits in the top row and fills the gap between the section
      links and the catalog selects. There is no search band under the header any more.
- [x] On focus, the bar moves below the header and widens to 1100px (capped at the viewport minus
      4rem) in one movement: position and width change together. The full-screen overlay and ACP
      open under it as before.
- [x] Closing (Escape, blur) plays the same movement backwards, into the gap.
- [x] The ACP panel starts below the dropped bar, not under it.
- [x] While the overlay is open, the logo, links, selects, cart and category row dim and blur; the
      bar stays sharp.
- [x] When the gap is narrower than 14rem, the top row wraps and the bar takes its own line. The
      drop still starts from wherever the bar is.
- [x] Below 768px: the bar is on its own line in the header and does not move on focus.
- [ ] With `prefers-reduced-motion: reduce`, the bar moves without a transition.
- [x] `/vector-search` keeps an empty slot (it has its own input), so its top row does not shift.
- [x] `npx tsc --noEmit` clean inside the `example` container.

## Verified

On 2026-10-02 against the running stack, with screenshots and a headless position sampler:

- 1440px, `fashion_fr` and `papershop_de`: the bar fills the gap (533 to 985px on fashion), no
  section link clipped. Focused: centred, 1100px, below the header; the ACP panel under it.
- `toolbox_fr` (two category rows): the bar lands below both rows.
- 1100px: the row wraps, the selects and cart go to a second line, right-aligned; focus still drops.
- 390px: the bar has its own line above the category row; the ACP opens under it.
- `/vector-search`: empty slot, links and selects in place.
- Motion, sampled each animation frame with the one-movement timing: opening, `expanded` at 19ms,
  then 740px wide and 96px down at 91ms, 985px / 138px at 187ms, settled (1100px, 156px) by
  ~450ms - width and position change together. Closing: the same path backwards, 859px / 114px
  at 55ms into the move, back in the slot by ~400ms. The move starts about 170ms after blur,
  because `overlay-open` (which keeps the bar dropped) is removed that much later by the overlay's
  own close timing, unchanged here.
- The published `--search-slot-*` values equal the slot's live box.
- `tsc --noEmit` exit 0; `✓ Compiled`, no new error line over the last two capture runs.

- Page load, sampled each frame: the bar goes from its in-flow 291px straight to the absolute
  291px box, no transition (it used to shrink from 1280px). Resize to 1250px: bar and slot both
  261px within 30ms. Opening still animates (868px at 120ms).

**Not verified:**

- `prefers-reduced-motion`: not emulated. It rests on the CSS rule setting `transition: none`.
- The ACP scrolled with the header riding it (`feature-acp-header-rides-scroll.md`): the capture
  script cannot scroll the scrim. The bar is inside the translated group, so it should move with
  it; at the full `--header-height` clamp the dropped bar stays on screen, where the old band
  scrolled away with the header. Check by hand.
- Two `[browser] ⨯ unhandledRejection` GraphQL fetch errors were logged during the first capture
  runs (15:38, 15:41 UTC) and did not recur; most likely requests aborted by the script's
  navigation. Not proven.

## How it moves

A bar that fills the gap has a position and width that depend on the links and selects of each
catalog and language, so CSS alone cannot animate from it. `Header.tsx` measures an empty slot
(`.header-search-slot`, `flex: 1 1 14rem`) in the top row with the same ResizeObserver that
publishes `--header-height`, and publishes the slot's box relative to the header group as
`--search-slot-x`, `--search-slot-y`, `--search-slot-w` and `--search-slot-h`. Once measured it sets
`data-search-slot` on the group.

From then on (desktop only), `.search-bar-wrapper` is `position: absolute` in the group in both
states, so `left`, `top` and `width` are plain lengths that transition: at rest they come from the
slot variables, expanded they centre the bar below the header. All three share one 0.45s
transition with no delay, so the bar travels diagonally and resizes on the way, both directions.
D2's two-step timing (widen in the row, then drop) was built first and rejected: it read as two
separate moves.

Before the first measurement (server render, first paint) the bar is in normal flow inside the
slot, which looks the same at rest. Without JavaScript it simply never moves.

## SDK contract used

None. Layout only.

## Tracking (required)

Unchanged. `SearchBar` and `SearchOverlay` keep their tracking; only their position changes.

## UI constraints

- Tokens only. The tint stays on `.header`; the slot paints nothing.
- The bar is slimmer at rest (to fit the 2.5rem logo's row) and grows back to its previous size
  once dropped.

## MUST NOT change

- **No ancestor of `.search-bar-wrapper` inside the group may get a `filter`, `transform` or
  position.** A filter or transform makes that ancestor the containing block, and a position does
  too, so the bar would be placed against `.header-inner` instead of the group. This is why the
  overlay dimming targets the row's items and no longer `.header-inner` itself.
- **A measurement must not animate.** `Header.tsx` sets `data-search-measuring` (transition off)
  while it publishes the slot variables, forces a layout, then removes it. Without it the bar
  animated on every page load: the first measurement switches the bar from the slot's flow to
  absolute, and its `width: 100%` then resolved against the whole group, so it shrank from
  1280px to the slot's 291px over 0.4s. A resize would likewise make the bar trail the slot.
- **The slot variables are measured, never hardcoded.** Link and select widths change with the
  catalog and the language.
- **Keep the in-flow fallback before `data-search-slot`.** Making the bar absolute before the
  variables exist puts it at the group's top-left on first paint.
- The `--acp-scroll` transform on the group, the `--header-height` clamp and the
  `--acp-page-offset` term in both scrim paddings are unchanged
  (`feature-acp-header-rides-scroll.md`, `feature-header-scrolls-with-page.md`). The desktop scrim
  only adds `--search-drop`, the dropped bar's height and gaps.
- The tint lives on `.header` (`feature-header-light-two-row.md`).
- **One movement, no per-property delays.** Delays make it widen and drop as two moves, which was
  rejected.
- **`.header-nav` is `flex: 0 0 auto` on desktop.** With its old `flex: 1` and `overflow-x: auto` it
  grew alongside the slot and was then clipped under its content ("Recherche vectori", and only
  "Produits" left at 1100px).
